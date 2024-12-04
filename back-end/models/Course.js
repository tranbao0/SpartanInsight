const mongoose = require('mongoose');

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