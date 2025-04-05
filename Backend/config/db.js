const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI (from environment variables or default to local MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cognis-ai';

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;