// routes/search.js
const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');
const Course = require('../models/Course');

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).send({ message: 'Search query is required.' });
  }

  try {
    // Search professors and courses
    const professors = await Professor.find({ name: { $regex: query, $options: 'i' } });
    const courses = await Course.find({ name: { $regex: query, $options: 'i' } });

    res.send({
      professors,
      courses,
    });
  } catch (err) {
    res.status(500).send({ message: 'Error occurred while searching.' });
  }
});

module.exports = router;
