/**
 * Test script for generating and verifying an OTP
 * 
 * This script generates an OTP and then verifies it
 * 
 * Usage:
 * node generate-and-verify-otp.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

const hybridOtpService = require('./services/hybridOtpService');

async function testGenerateAndVerifyOTP() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log(`Generating OTP for ${email}...`);
    
    // Generate OTP
    const result = await hybridOtpService.sendOTP(email);
    
    if (!result.success) {
      console.error('Failed to generate OTP:', result.message);
      return;
    }
    
    console.log('OTP generated successfully!');
    console.log('OTP ID:', result.otpId);
    
    // For testing purposes, we'll manually enter the OTP
    console.log('Please enter the OTP you see above:');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Prompt for OTP
    const otp = await new Promise(resolve => {
      readline.question('OTP: ', (answer) => {
        readline.close();
        resolve(answer);
      });
    });
    
    // Wait a moment before verifying
    console.log('Waiting 2 seconds before verifying...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify OTP
    console.log(`Verifying OTP ${otp} with ID ${result.otpId}...`);
    const verifyResult = hybridOtpService.verifyOTP(result.otpId, otp);
    
    if (verifyResult.success) {
      console.log('OTP verified successfully!');
      console.log('Email:', verifyResult.email);
    } else {
      console.error('Failed to verify OTP:', verifyResult.message);
    }
  } catch (error) {
    console.error('Error testing OTP generation and verification:', error);
  }
}

testGenerateAndVerifyOTP();