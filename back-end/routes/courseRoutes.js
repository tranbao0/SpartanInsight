const express = require('express');
const Course = require('../models/Course');
const { protect } = require('../middleware/authMiddleware'); // Optional: protect route with JWT
const { getCourseWithReviews } = require('../controllers/courseController');
const router = express.Router();

router.get('/:id/reviews', protect, getCourseWithReviews);
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find(); 
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
// backend/routes/courseRoutes.js
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id); // Get course by ID
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to create a new course (only accessible by authenticated users)
router.post('/', protect, async (req, res) => {
  const { name } = req.body;

  try {
    // Check if course already exists
    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    // Create a new course object
    const course = new Course({
      name,
    });

    // Save the course to the database
    await course.save();

    // Send the response
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating course' });
  }
});

module.exports = router;
