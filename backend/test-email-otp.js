/**
 * Test script for OTP email functionality
 * 
 * This script tests the OTP email functionality by:
 * 1. Sending an OTP to a specified email
 * 2. Displaying the OTP and preview URL (if using Ethereal)
 * 
 * Usage:
 * node test-email-otp.js [email]
 * 
 * If no email is provided, it will use the default test email.
 */

require('dotenv').config();
const otpService = require('./services/otpService');

async function testOTPEmail() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'test@example.com';
    
    console.log(`Sending OTP to ${email}...`);
    
    // Send OTP
    const result = await otpService.sendOTP(email);
    
    if (result.success) {
      console.log('OTP sent successfully!');
      console.log('OTP ID:', result.otpId);
      
      if (result.previewUrl) {
        console.log('Preview URL:', result.previewUrl);
        console.log('Open this URL in your browser to view the email');
      }
    } else {
      console.error('Failed to send OTP:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('Error testing OTP email:', error);
  }
}

testOTPEmail();