require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { sendOTPEmail } = require('./services/realEmailService');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// Store OTPs temporarily (in production, use Redis or another database)
const otpStore = new Map();

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP endpoint
app.post('/api/otp/send', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Generate a unique ID for this OTP request
    const otpId = crypto.randomUUID();
    
    // Store OTP with expiration time (5 minutes)
    otpStore.set(otpId, {
      otp,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    });
    
    // Log the OTP for debugging
    console.log(`OTP for ${email}: ${otp}`);
    
    // Send the OTP via email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code to your email. Please try again.'
      });
    }
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      otpId
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending OTP', 
      error: error.message 
    });
  }
});

// Verify OTP endpoint
app.post('/api/otp/verify', (req, res) => {
  try {
    const { otpId, otp } = req.body;
    
    if (!otpId || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP ID and OTP are required' 
      });
    }
    
    // Get stored OTP data
    const otpData = otpStore.get(otpId);
    
    // If no OTP found or expired
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP session'
      });
    }
    
    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      otpStore.delete(otpId); // Clean up expired OTP
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }
    
    // Verify OTP
    if (otpData.otp === otp) {
      otpStore.delete(otpId); // Clean up used OTP
      return res.json({
        success: true,
        message: 'OTP verified successfully',
        email: otpData.email
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
});

// Update email verification status endpoint
app.post('/api/otp/update-email', (req, res) => {
  try {
    const { email, isVerified } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    // In a real application, you would update the user's email verification status in the database
    console.log(`Updating email verification status for ${email} to ${isVerified}`);
    
    // Return a mock user object
    res.json({
      success: true,
      message: 'Email verification status updated successfully',
      user: {
        email,
        isEmailVerified: isVerified
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Real Email OTP server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});