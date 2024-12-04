const express = require('express');
const Review = require('../models/Review');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// POST route to create a review (for either professor or course)
router.post('/', protect, async (req, res) => {
  const { professorId, courseId, rating, comment } = req.body;

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

    // Check for existing review by this user
    let existingReview;
    if (professorId) {
      existingReview = await Review.findOne({
        user: req.user.id,
        professor: professorId
      });
      
      if (existingReview) {
        return res.status(400).json({ 
          message: 'You have already reviewed this professor',
          existingReview 
        });
      }

      // Check if professor exists
      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: 'Professor not found' });
      }
    } else {
      existingReview = await Review.findOne({
        user: req.user.id,
        course: courseId
      });
      
      if (existingReview) {
        return res.status(400).json({ 
          message: 'You have already reviewed this course',
          existingReview 
        });
      }

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    // Create the review
    const review = new Review({
      professor: professorId || undefined,
      course: courseId || undefined,
      user: req.user.id,
      rating,
      comment,
    });

    // Save the review
    await review.save();

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

    res.status(201).json({ 
      message: 'Review created successfully', 
      review 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating review' });
  }
});

// GET route to fetch reviews (for either professor or course)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  try {
    const query = type === 'course' ? { course: id } : { professor: id };
    const reviews = await Review.find(query).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if it's the user's own review
    if (review.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot like your own review' });
    }

    // Check if already liked
    if (review.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Review already liked' });
    }

    // Remove from dislikes if exists
    review.dislikes = review.dislikes.filter(id => id.toString() !== req.user.id);

    // Add to likes
    review.likes.push(req.user.id);
    await review.save();

    res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a review
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if it's the user's own review
    if (review.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot dislike your own review' });
    }

    // Check if already disliked
    if (review.dislikes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Review already disliked' });
    }

    // Remove from likes if exists
    review.likes = review.likes.filter(id => id.toString() !== req.user.id);

    // Add to dislikes
    review.dislikes.push(req.user.id);
    await review.save();

    res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove like/dislike
router.post('/:id/remove-reaction', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Remove from both likes and dislikes
    review.likes = review.likes.filter(id => id.toString() !== req.user.id);
    review.dislikes = review.dislikes.filter(id => id.toString() !== req.user.id);
    
    await review.save();

    res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;