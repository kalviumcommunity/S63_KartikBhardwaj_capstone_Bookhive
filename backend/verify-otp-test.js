/**
 * Test script for verifying an OTP
 * 
 * This script tests verifying an OTP using the hybrid OTP service
 * 
 * Usage:
 * node verify-otp-test.js [otpId] [otp]
 * 
 * Example:
 * node verify-otp-test.js 5934387e-b5ff-4589-89c8-9290f3f08879 486229
 */

const hybridOtpService = require('./services/hybridOtpService');

async function testVerifyOTP() {
  try {
    // Get otpId and otp from command line
    const otpId = process.argv[2];
    const otp = process.argv[3];
    
    if (!otpId || !otp) {
      console.error('Please provide both otpId and otp');
      console.error('Usage: node verify-otp-test.js [otpId] [otp]');
      console.error('Example: node verify-otp-test.js 5934387e-b5ff-4589-89c8-9290f3f08879 486229');
      return;
    }
    
    console.log(`Verifying OTP ${otp} with ID ${otpId}...`);
    
    // Verify OTP
    const result = hybridOtpService.verifyOTP(otpId, otp);
    
    if (result.success) {
      console.log('OTP verified successfully!');
      console.log('Email:', result.email);
    } else {
      console.error('Failed to verify OTP:', result.message);
    }
  } catch (error) {
    console.error('Error testing OTP verification:', error);
  }
}

testVerifyOTP();