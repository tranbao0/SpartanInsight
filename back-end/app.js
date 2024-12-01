const express = require('express');
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);

// Export the app instance
module.exports = app;
