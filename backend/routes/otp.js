const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Use the hybrid OTP service (console + email)
const hybridOtpService = require('../services/hybridOtpService');
const otpService = hybridOtpService;

console.log('Using HYBRID mode for OTP verification - emails will be sent AND codes will be shown in console');

// Export the service for testing
const { sendOTP, verifyOTP } = otpService;

// Send OTP for email verification
router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if email is already verified by another user
    const existingUser = await User.findOne({ 
      email, 
      isEmailVerified: true 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'This email is already registered' 
      });
    }
    
    // Send OTP
    const result = await sendOTP(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        otpId: result.otpId
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending OTP', 
      error: error.message 
    });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { otpId, otp } = req.body;
    
    console.log(`OTP verification request received:`, {
      otpId,
      otp,
      otpType: typeof otp
    });
    
    if (!otpId || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP ID and OTP are required' 
      });
    }
    
    // Convert OTP to string to ensure consistent comparison
    const otpString = String(otp);
    
    // Special case for the specific OTP you mentioned
    if (otpString === '403692') {
      console.log('Processing special OTP case: 403692');
    }
    
    // Verify OTP
    const result = verifyOTP(otpId, otpString);
    console.log('OTP verification result:', result);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP verified successfully',
        email: result.email
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
});

// Update user's email verification status (requires authentication)
router.post('/update-email', auth, async (req, res) => {
  try {
    const { email, isVerified } = req.body;
    
    if (!email || typeof isVerified !== 'boolean') {
      return res.status(400).json({ message: 'Email and verification status are required' });
    }
    
    // Update user's email verification status
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        email,
        isEmailVerified: isVerified
      },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Email verification status updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating email verification status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating email verification status', 
      error: error.message 
    });
  }
});

module.exports = router;