const express = require('express');
const Course = require('../models/Course'); // Import the Course model
const { protect } = require('../middleware/authMiddleware'); // Optional if authentication is needed
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

  // Debugging: Log the incoming request body
  console.log('Incoming data:', req.body);

  try {
    // Ensure all required fields are present
    if (!prefix || !number || !name || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCourse = new Course({
      prefix,
      number: parseInt(number, 10), // Ensure number is stored as an integer
      name,
      prerequisites: prerequisites || [], // Default to an empty array if not provided
      description,
    });

    const savedCourse = await newCourse.save();

    // Debugging: Log the saved course
    console.log('Saved course:', savedCourse);

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Error creating course');
  }
});

module.exports = router;
