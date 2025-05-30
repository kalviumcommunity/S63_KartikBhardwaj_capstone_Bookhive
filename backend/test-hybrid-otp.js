/**
 * Test script for Hybrid OTP service
 * 
 * This script tests sending an OTP to a specified email using the hybrid OTP service
 * 
 * Usage:
 * node test-hybrid-otp.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

const hybridOtpService = require('./services/hybridOtpService');

async function testHybridOTP() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log(`Sending OTP to ${email} using hybrid OTP service...`);
    
    // Send OTP
    const result = await hybridOtpService.sendOTP(email);
    
    if (result.success) {
      console.log('OTP generated successfully!');
      console.log('OTP ID:', result.otpId);
      console.log('Look for the OTP in the console output above');
      console.log('Note:', result.note);
    } else {
      console.error('Failed to generate OTP:', result.message);
    }
  } catch (error) {
    console.error('Error testing hybrid OTP:', error);
  }
}

testHybridOTP();