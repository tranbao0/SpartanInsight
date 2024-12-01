const express = require('express');
const Course = require('../models/Course');
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add this new public route for course reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Fetch reviews separately based on course ID
    const reviews = await Review.find({ course: courseId }).populate('user', 'username email');

    // Calculate average rating
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      course.rating = avgRating;
      await course.save();
    }

    // Respond with both course details and reviews
    res.status(200).json({ course, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.post('/', protect, async (req, res) => {
  const { prefix, number, name, prerequisites, description } = req.body;

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
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Error creating course');
  }
});

module.exports = router;