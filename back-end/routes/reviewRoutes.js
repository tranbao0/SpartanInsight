const express = require('express');
const Review = require('../models/Review');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
<<<<<<< HEAD
const { protect } = require('../middleware/authMiddleware');
=======
const { protect } = require('../middleware/authMiddleware'); // Assuming you have JWT middleware
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
const router = express.Router();

// POST route to create a review (for either professor or course)
router.post('/', protect, async (req, res) => {
<<<<<<< HEAD
  const { professorId, courseId, rating, comment } = req.body;
=======
  console.log("Inside createReview route:");
  console.log("req.user at start:", req.user); // Log req.user immediately
  const { courseId, professorId, rating, comment } = req.body;
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User information is missing' });
    }

    // Validate that either professorId or courseId is provided, but not both
    if ((!professorId && !courseId) || (professorId && courseId)) {
      return res.status(400).json({ 
        message: 'Please provide either a professor ID or course ID, but not both' 
      });
    }

<<<<<<< HEAD
    let review;
    if (professorId) {
      // Check if professor exists
      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: 'Professor not found' });
      }

      // Create professor review
      review = new Review({
        professor: professorId,
        user: req.user.id,
        rating,
        comment,
      });
    } else {
      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Create course review
      review = new Review({
        course: courseId,
        user: req.user.id,
        rating,
        comment,
      });
    }
=======
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new review
    const review = new Review({
      course: courseId,
      professor: professorId,
      user: req.user.id, // The authenticated user
      rating,
      comment,
    });
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b

    // Save the review
    await review.save();

<<<<<<< HEAD
    // Update average rating
    if (professorId) {
      const reviews = await Review.find({ professor: professorId });
      const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
      await Professor.findByIdAndUpdate(professorId, { rating: avgRating });
    } else {
      const reviews = await Review.find({ course: courseId });
      const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
      await Course.findByIdAndUpdate(courseId, { rating: avgRating });
    }
=======
    // Optionally, update the professor's average rating (in case of new review)
    const reviews = await Review.find({ professor: professorId });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    professor.rating = avgRating;
    course.rating = avgRating;
    await professor.save();
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating review' });
  }
});

// GET route to fetch reviews (for either professor or course)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // Add a query parameter to specify professor or course

  try {
    const query = type === 'course' ? { course: id } : { professor: id };
    const reviews = await Review.find(query).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

<<<<<<< HEAD
module.exports = router;
=======
router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ course: courseId }).populate('user', 'name'); // Populate user data if needed
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});


module.exports = router;
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
