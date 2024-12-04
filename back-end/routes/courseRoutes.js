const express = require('express');
const Course = require('../models/Course');
<<<<<<< HEAD
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
=======
const { protect } = require('../middleware/authMiddleware'); // Optional: protect route with JWT
const { getCourseWithReviews } = require('../controllers/courseController');
const router = express.Router();

router.get('/:id/reviews', protect, getCourseWithReviews);
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find(); 
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
<<<<<<< HEAD

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
=======
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
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
