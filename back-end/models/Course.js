const mongoose = require('mongoose');

// Define the schema for the course
const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  // You can add more fields like course list, email, etc.
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the Course model from the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
