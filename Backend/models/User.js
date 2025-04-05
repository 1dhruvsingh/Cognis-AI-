const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Not required because Google OAuth users won't have a password
    },
    googleId: {
        type: String,
        // For Google OAuth users
    },
    picture: {
        type: String,
        // Profile picture URL (mainly for Google users)
    },
    token: {
        type: String,
        // For storing JWT token
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);