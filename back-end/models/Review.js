const mongoose = require('mongoose');

// Define schema for reviews
<<<<<<< HEAD
const reviewSchema = mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professor',
      required: function () {
        return !this.course; // `professor` is required if `course` is not provided
      },
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: function () {
        return !this.professor; // `course` is required if `professor` is not provided
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
=======
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
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
