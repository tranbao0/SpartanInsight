const path = require('path');
const express = require('express');
const connectDB = require('./config/db');  // MongoDB connection
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();
// test comment
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', professorRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to Spartan Insight API!');
});

app.get('/test', (req, res) => {
    res.send('Test route working');
});

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
