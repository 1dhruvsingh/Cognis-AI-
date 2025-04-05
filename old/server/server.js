const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
require('dotenv').config();

// Database connection
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Chat = require('./models/Chat');
const Subject = require('./models/Subject');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        
        // Save user to database
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        // Update user's token in database
        user.token = token;
        await user.save();
        
        // Return token and user info (excluding password)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture
        };
        
        res.json({
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if not exists
            user = new User({
                googleId,
                name,
                email,
                picture,
                password: null // No password for Google auth users
            });
            
            // Save to database
            await user.save();
        } else {
            // Update Google ID and picture if user exists but logged in with Google for the first time
            if (!user.googleId) {
                user.googleId = googleId;
                user.picture = picture;
                await user.save();
            }
        }
        
        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        // Update user's token in database
        user.token = token;
        await user.save();
        
        // Return token and user info
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            googleId: user.googleId
        };
        
        res.json({
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        // Find user by ID from token
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return user info (excluding password)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            googleId: user.googleId
        };
        
        res.json(userResponse);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        
        req.user = decoded;
        next();
    });
}

// Import routes
const chatRoutes = require('./routes/chat');
const subjectRoutes = require('./routes/subjects');

// Use routes
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/subjects', authenticateToken, subjectRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});