const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const validateEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  // SJSU domain validation
  if (!email.toLowerCase().endsWith('@sjsu.edu')) {
    return "Email must be an SJSU email address";
  }

  return null;
};

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Register request received:', { username, email });

  if (!username || !email || !password) {
    console.log('Missing registration fields');
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  // Validate email format and domain
  const emailError = validateEmail(email);
  if (emailError) {
    console.log('Email validation failed:', emailError);
    return res.status(400).json({ message: emailError });
  }

  try {
    // Convert email to lowercase before checking/saving
    const normalizedEmail = email.toLowerCase();
    
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      username, 
      email: normalizedEmail, 
      password: hashedPassword 
    });
    await user.save();

    console.log('User registered successfully:', normalizedEmail);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email });

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Convert email to lowercase before checking
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch for user:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', normalizedEmail);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', protect, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;