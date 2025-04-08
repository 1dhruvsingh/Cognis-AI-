const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Special middleware for chat routes that allows access without token verification
 * but still provides user information if token is present
 */
const chatAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token is provided, create a demo user for the request
    if (!token) {
        // Set a demo user ID for the request
        req.user = { id: 'demo-user-id' };
        return next();
    }
    
    // If token is provided, try to verify it but don't block if invalid
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // If token verification fails, still allow access with a demo user
        req.user = { id: 'demo-user-id' };
    }
    
    next();
};

module.exports = chatAuth;