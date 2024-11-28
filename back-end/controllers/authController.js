const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Register request received:', { username, email });

  if (!username || !email || !password) {
    console.log('Missing registration fields');
    return res.status(400).json({ message: 'please provide all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'user registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email });

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'please provide all fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
