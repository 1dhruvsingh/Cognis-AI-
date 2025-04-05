const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Subject Schema
const SubjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        // Optional icon for the subject
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);