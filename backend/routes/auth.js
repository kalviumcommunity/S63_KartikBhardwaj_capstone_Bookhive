const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const passport = require('passport');

// Use the hybrid OTP service for all OTP operations
const otpService = require('../services/hybridOtpService');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { username, email, password, isEmailVerified } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email and password' 
      });
    }

    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    const existingUserByUsername = await User.findOne({ username: username });

    // If username is taken
    if (existingUserByUsername && existingUserByUsername.email !== normalizedEmail) {
      return res.status(400).json({ 
        message: 'Username already taken. Please choose a different username.' 
      });
    }

    // If email exists but is not verified, we'll allow re-registration
    if (existingUserByEmail) {
      if (existingUserByEmail.isEmailVerified) {
        return res.status(400).json({ 
          message: 'Email already registered. Please login or use a different email.' 
        });
      } else {
        // Email exists but not verified - we'll delete the old user and create a new one
        console.log('Unverified user found with this email. Deleting and creating new user.');
        await User.deleteOne({ email: normalizedEmail });
      }
    }

    // Create new user with email verification based on the isEmailVerified flag
    // If the flag is provided and true, set isEmailVerified to true
    const user = new User({
      username,
      email: normalizedEmail,
      password,
      role: 'user',
      isEmailVerified: isEmailVerified === true
    });

    // Log user object before saving (without password)
    console.log('Attempting to create user:', {
      username: user.username,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isEmailVerifiedFromRequest: isEmailVerified === true
    });

    await user.save();
    console.log('User saved successfully');

    // Send OTP for email verification
    const otpResult = await otpService.sendOTP(normalizedEmail);
    
    if (!otpResult.success) {
      console.error('Failed to send OTP:', otpResult.message);
      // Continue with user creation even if OTP sending fails
      // We'll handle verification later
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bookhive_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully. Please verify your email.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      requireEmailVerification: true,
      otpId: otpResult.success ? otpResult.otpId : null,
      previewUrl: otpResult.previewUrl // For development purposes
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
      // Check which field caused the duplicate key error
      const keyPattern = error.keyPattern;
      if (keyPattern && keyPattern.email) {
        return res.status(400).json({ 
          message: 'Email already registered. Please use a different email or try to login.' 
        });
      } else if (keyPattern && keyPattern.username) {
        return res.status(400).json({ 
          message: 'Username already taken. Please choose a different username.' 
        });
      } else {
        return res.status(400).json({ 
          message: 'Username or email already exists. Please try different credentials.' 
        });
      }
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
    const { identifier, password, requireOTP } = req.body;

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

    // If OTP verification is required
    if (requireOTP) {
      // Return a partial success response indicating OTP is needed
      return res.json({
        message: 'OTP verification required',
        requireOTP: true,
        userId: user._id,
        email: user.email
      });
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
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Verify OTP and complete login
router.post('/verify-login', async (req, res) => {
  try {
    const { userId, otpId, otp } = req.body;
    
    if (!userId || !otpId || !otp) {
      return res.status(400).json({ message: 'User ID, OTP ID, and OTP are required' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify OTP
    const result = otpService.verifyOTP(otpId, otp);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    // Update last login and set email as verified
    user.lastLogin = new Date();
    user.isEmailVerified = true;
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bookhive_secret_key_2024',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Email verified and login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Error in OTP verification:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

// Verify email after signup
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, otpId, otp } = req.body;
    
    if (!userId || !otpId || !otp) {
      return res.status(400).json({ message: 'User ID, OTP ID, and OTP are required' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.json({
        message: 'Email already verified',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    }
    
    // Verify OTP
    const result = otpService.verifyOTP(otpId, otp);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    // Update email verification status
    user.isEmailVerified = true;
    await user.save();
    
    res.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Error in email verification:', error);
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
});

// Resend OTP for email verification
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, userId } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find the user if userId is provided
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      // Find user by email
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
      }
    }
    
    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.json({
        message: 'Email already verified. No need to resend OTP.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      });
    }
    
    // Send OTP
    const otpResult = await otpService.sendOTP(user.email);
    
    if (!otpResult.success) {
      return res.status(500).json({ 
        message: 'Failed to send verification code. Please try again.',
        error: otpResult.message
      });
    }
    
    res.json({
      message: 'Verification code sent successfully',
      otpId: otpResult.otpId,
      userId: user._id,
      previewUrl: otpResult.previewUrl // For development purposes
    });
  } catch (error) {
    console.error('Error in resending OTP:', error);
    res.status(500).json({ message: 'Error sending verification code', error: error.message });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .select('username email role lastLogin signupDate profilePicture bio isEmailVerified');
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      signupDate: user.signupDate,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isEmailVerified: user.isEmailVerified
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
  const clientUrl = process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' 
    ? 'https://s63-kartikbhardwaj-capstone-bookhive-1.onrender.com' 
    : 'http://localhost:5173');
  res.redirect(`${clientUrl}/?token=${token}`);
});

module.exports = router;