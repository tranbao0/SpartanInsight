const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professor',
      required: function () {
        return !this.course;
      },
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: function () {
        return !this.professor;
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
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;