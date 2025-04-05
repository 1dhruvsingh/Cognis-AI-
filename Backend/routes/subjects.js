const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Subject = require('../models/Subject');

// GET /api/subjects - Get all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.json({ subjects });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});

// POST /api/subjects - Create a new subject
router.post('/', async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        
        // Validate input
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }
        
        // Check if subject already exists
        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return res.status(400).json({ message: 'Subject already exists' });
        }
        
        // Create new subject
        const newSubject = new Subject({
            name,
            description,
            icon
        });
        
        await newSubject.save();
        
        res.status(201).json({ 
            message: 'Subject created successfully',
            subject: newSubject
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ message: 'Error creating subject' });
    }
});

// GET /api/subjects/:id - Get a specific subject
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        
        res.json({ subject });
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ message: 'Error fetching subject' });
    }
});

// PUT /api/subjects/:id - Update a subject
router.put('/:id', async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        
        // Find and update the subject
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name, description, icon },
            { new: true }
        );
        
        if (!updatedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        
        res.json({ 
            message: 'Subject updated successfully',
            subject: updatedSubject
        });
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ message: 'Error updating subject' });
    }
});

// DELETE /api/subjects/:id - Delete a subject
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        
        if (!deletedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ message: 'Error deleting subject' });
    }
});

module.exports = router;