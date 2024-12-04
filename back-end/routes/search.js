const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');
const Course = require('../models/Course');

router.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regex = new RegExp(`\\b${query}\\b`, 'i'); // Whole-word case-insensitive match

        const professors = await Professor.find({ name: regex });
        const courses = await Course.find({
          $or: [
              { name: regex },
              { $expr: { $regexMatch: { input: { $concat: ['$prefix', ' ', { $toString: '$number' }] }, regex: `\\b${query}\\b`, options: 'i' } } }
          ],
      });

        res.json({ professors, courses });
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ message: 'Failed to perform search' });
    }
});

module.exports = router;
