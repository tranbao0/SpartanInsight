const mongoose = require('mongoose');

// Define schema for reviews
const reviewSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model set up
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
