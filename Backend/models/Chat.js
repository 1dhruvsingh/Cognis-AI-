const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Message Schema (sub-document)
const MessageSchema = new Schema({
    sender: {
        type: String,
        required: true
        // Removed enum restriction to allow user names instead of just 'user'
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create Chat Schema
const ChatSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    messages: [
        MessageSchema
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
ChatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Chat', ChatSchema);