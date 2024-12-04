const mongoose = require('mongoose');

<<<<<<< HEAD
const courseSchema = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
    trim: true, 
    uppercase: true, 
  },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => Number.isInteger(value), 
      message: 'Course number must be an integer.',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  prerequisites: {
    type: [String], 
    default: [], 
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model('Course', courseSchema);
=======
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
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
