const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const passport = require('passport');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { username, email, password } = req.body;

    // Validate input



    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email and password' 
      });
    }

    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: normalizedEmail }, 
        { username: username }
      ] 
    });

    if (existingUser) {
      return res.status(400).json({ 



        
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email: normalizedEmail,
      password,
      role: 'user'
    });

    // Log user object before saving (without password)
    console.log('Attempting to create user:', {
      username: user.username,
      email: user.email,
      role: user.role
    });

    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bookhive_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    // Convert identifier to lowercase for case-insensitive comparison
    const normalizedIdentifier = identifier.toLowerCase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier }
      ]
    });

    if (!user) {
      console.log('User not found:', normalizedIdentifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', normalizedIdentifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bookhive_secret_key_2024',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.username);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .select('username email role lastLogin signupDate profilePicture bio');
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      signupDate: user.signupDate,
      profilePicture: user.profilePicture,
      bio: user.bio
    });
  } catch (error) {
    console.error('Error in profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?token=${token}`);
});

module.exports = router; 