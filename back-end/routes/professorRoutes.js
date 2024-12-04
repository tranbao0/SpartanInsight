const express = require('express');
const Professor = require('../models/Professor');
const { protect } = require('../middleware/authMiddleware');
const { getProfessorWithReviews } = require('../controllers/professorController');
const router = express.Router();

// Fetch all professors
router.get('/', async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Fetch a professor by ID
router.get('/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor) {
      return res.status(404).send('Professor not found');
    }
    res.json(professor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Fetch a professor and their reviews - removed protect middleware
router.get('/:id/reviews', getProfessorWithReviews);

// Create a new professor (protected route)
router.post('/', protect, async (req, res) => {
  const { name, department } = req.body;

  try {
    const professorExists = await Professor.findOne({ name });
    if (professorExists) {
      return res.status(400).json({ message: 'Professor already exists' });
    }

    const professor = new Professor({ name, department });
    await professor.save();

    res.status(201).json({ message: 'Professor created successfully', professor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating professor' });
  }
});

module.exports = router;