const express = require('express');
const Course = require('../models/Course');
const Review = require('../models/Review'); // Add this import
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Create a new course
router.post('/', protect, async (req, res) => {
  const { prefix, number, name, prerequisites, description } = req.body;

  console.log('Incoming data:', req.body);

  try {
    if (!prefix || !number || !name || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCourse = new Course({
      prefix,
      number: parseInt(number, 10),
      name,
      prerequisites: prerequisites || [],
      description,
    });

    const savedCourse = await newCourse.save();
    console.log('Saved course:', savedCourse);
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Error creating course');
  }
});

// Add this new route for getting course with reviews - directly in the routes file
router.get('/:id/reviews', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await Review.find({ course: req.params.id }).populate('user', 'username');

    res.json({
      course,
      reviews
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Error fetching course details' });
  }
});

module.exports = router;