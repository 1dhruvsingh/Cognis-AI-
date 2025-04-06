const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// Import models
const Chat = require('../models/Chat');
const Subject = require('../models/Subject');

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// POST /api/chat - Process chat messages
router.post('/', async (req, res) => {
    try {
        const { message, chatId, subjectId, title } = req.body;
        const userId = req.user.id; // From auth middleware
        
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
               // Create a new chat
              chat = new Chat({
                userId: userId,
                subject: subjectId,
                title: title || 'New Chat',
                messages: []
            });
            await chat.save();
        } else {
            return res.status(400).json({ message: 'Either chatId or subjectId is required' });
        }
        
        // Send message to Gemini API
        const result = await model.generateContent(message);
        const response = await result.response;
        const aiReply = response.text();

        // Add messages to the chat in database
        chat.messages.push({ sender: 'user', text: message });
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
        const userId = req.user.id; // From auth middleware
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
        const userId = req.user.id; // From auth middleware
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
        const userId = req.user.id; // From auth middleware
        
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
        const userId = req.user.id; // From auth middleware
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