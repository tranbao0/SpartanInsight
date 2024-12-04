const path = require('path');
const express = require('express');
const connectDB = require('./config/db'); // MongoDB connection
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Import course routes
const searchRoutes = require('./routes/search');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/professors', professorRoutes); // Professors routes
app.use('/api/reviews', reviewRoutes); // Reviews routes
app.use('/api/courses', courseRoutes); // New courses routes
app.use('/api/search', searchRoutes);
=======
app.use('/api/professors', professorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', professorRoutes); 
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b

// Test routes
app.get('/', (req, res) => {
  res.send('Welcome to Spartan Insight API!');
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Serve static files from React app (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
