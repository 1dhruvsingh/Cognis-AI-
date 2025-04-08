const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const mongoose = require('mongoose');

// Import models
const Chat = require('../models/Chat');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Initialize Google Generative AI with API key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Get Gemini 2.0 Flash model
const model = 'gemini-2.0-flash';

// Helper function to get user info from request
const getUserInfo = async (req) => {
    // If we have a valid user ID from token
    if (req.user && req.user.id && req.user.id !== 'demo-user-id') {
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                return {
                    id: user._id,
                    name: user.name
                };
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    
    // Return demo user if no valid user found
    return {
        id: 'demo-user-id',
        name: 'Guest'
    };
};

// POST /api/chat - Process chat messages
router.post('/', async (req, res) => {
    try {
        const { message, chatId, subjectId, title } = req.body;
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id; // Get user ID from helper function
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Find or create a chat session
        let chat;
        if (chatId) {
            // Find existing chat
            chat = await Chat.findOne({ _id: chatId, userId: userId });
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
        } else if (subjectId) {
            // Create a new chat with a subject
            chat = new Chat({
                userId: userId,
                subject: subjectId,
                title: title || 'New Chat',
                messages: []
            });
            await chat.save();
        } else {
            // Create a new chat without a subject
            chat = new Chat({
                userId: userId,
                title: title || 'New Chat',
                messages: []
            });
            await chat.save();
        }
        
        // Send message to Gemini API using new format
        const response = await genAI.models.generateContent({
            model: model,
            contents: message
        });
        const aiReply = response.text;

        // Add messages to the chat in database with user's name
        chat.messages.push({ sender: userInfo.name || 'user', text: message });
        chat.messages.push({ sender: 'bot', text: aiReply });
        
        // Limit history size (keep last 50 messages)
        if (chat.messages.length > 50) {
            chat.messages = chat.messages.slice(-50);
        }
        
        // Save updated chat to database
        await chat.save();

        // Send response back to client
        res.json({ 
            message: aiReply,
            chatId: chat._id
        });
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ 
            message: 'Error processing your request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/chat/history - Get user's chat history
router.get('/history', async (req, res) => {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
        // Find all chats for this user, sorted by most recent first
        const chats = await Chat.find({ userId: userId })
            .sort({ updatedAt: -1 })
            .populate('subject', 'name icon')
            .select('_id title subject updatedAt');
        
        res.json({ chats });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Error fetching chat history' });
    }
});

// GET /api/chat/:chatId - Get a specific chat's messages
router.get('/:chatId', async (req, res) => {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
        const { chatId } = req.params;
        // Find the specific chat
        const chat = await Chat.findOne({           
            _id: chatId, 
            userId: userId 
        }).populate('subject', 'name');
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        
        res.json({ chat });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Error fetching chat' });
    }
});

// DELETE /api/chat/history - Clear all user's chat history
router.delete('/history', async (req, res) => {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
        
        // Delete all chats for this user from the database
        const result = await Chat.deleteMany({ userId: userId });
        
        res.json({ 
            message: 'Chat history cleared successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing chat history:', error);
        res.status(500).json({ message: 'Error clearing chat history' });
    }
});

// DELETE /api/chat/:chatId - Reset a specific chat
router.delete('/:chatId', async (req, res) => {
    try {
        const userInfo = await getUserInfo(req);
        const userId = userInfo.id;
        const { chatId } = req.params;
        
        // Find the chat
        const chat = await Chat.findOne({ 
            _id: chatId, 
            userId: userId 
        });
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        
        // Clear the messages array but keep the chat
        chat.messages = [];
        await chat.save();
        
        res.json({ 
            message: 'Chat reset successfully',
            chatId: chat._id
        });
    } catch (error) {
        console.error('Error resetting chat:', error);
        res.status(500).json({ message: 'Error resetting chat' });
    }
});


module.exports = router;