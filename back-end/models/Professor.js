const mongoose = require('mongoose');

// Define the schema for the professor
const professorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
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

// Create the Professor model from the schema
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
