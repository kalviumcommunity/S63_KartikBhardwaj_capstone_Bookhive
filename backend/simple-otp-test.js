/**
 * Simple OTP test script
 * 
 * This script generates an OTP and displays it in the console
 */

const consoleOtpService = require('./services/consoleOtpService');

async function testOTP() {
  const email = 'kalviumkalvi@gmail.com';
  
  console.log(`Generating OTP for ${email}...`);
  
  const result = await consoleOtpService.sendOTP(email);
  
  if (result.success) {
    console.log('OTP generated successfully!');
    console.log('OTP ID:', result.otpId);
    console.log('Look for the OTP code in the console output above');
  } else {
    console.error('Failed to generate OTP:', result.message);
  }
}

testOTP();