const express = require('express');
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);

// Export the app instance
module.exports = app;
