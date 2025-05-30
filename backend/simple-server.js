require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Create a test account using Ethereal for reliable development testing
let transporter;

async function createTransporter() {
  // If we already have a transporter, return it
  if (transporter) return transporter;
  
  // Create a test account on Ethereal (fake SMTP service for testing)
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a transporter using the test account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  console.log('Ethereal Email credentials:');
  console.log('Username:', testAccount.user);
  console.log('Password:', testAccount.pass);
  console.log('Preview URL: https://ethereal.email');
  
  return transporter;
}

// Initialize the transporter
createTransporter().catch(console.error);

/**
 * Send an email
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    // Make sure we have a transporter
    if (!transporter) {
      await createTransporter();
    }
    
    const info = await transporter.sendMail({
      from: '"BookHive 📚" <bookhive@example.com>',
      to,
      subject,
      text,
      html
    });
    
    console.log('Email sent:', info.messageId);
    
    // Get the preview URL for Ethereal emails
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL:', previewUrl);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send OTP verification email
 */
async function sendOTPEmail(email, otp) {
  const subject = 'Your BookHive Verification Code';
  
  const text = `
    Your BookHive verification code is: ${otp}
    
    This code will expire in 5 minutes.
    
    If you didn't request this code, please ignore this email.
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a90e2; text-align: center;">BookHive Verification</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes.</p>
      <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} BookHive. All rights reserved.
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
}

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
    
    // For development, include the preview URL in the response
    const previewUrl = emailResult.previewUrl;
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      otpId,
      previewUrl // Include the preview URL for development
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple OTP server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});