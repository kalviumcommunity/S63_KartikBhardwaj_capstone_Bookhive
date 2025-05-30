/**
 * Complete OTP Flow Test
 * 
 * This script tests the complete OTP flow:
 * 1. Generate an OTP and send it via email
 * 2. Verify the OTP
 * 
 * Usage:
 * node complete-otp-flow.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

require('dotenv').config();
const hybridOtpService = require('./services/hybridOtpService');

async function testCompleteOTPFlow() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log('======================================================');
    console.log('COMPLETE OTP FLOW TEST');
    console.log('======================================================');
    console.log(`Testing with email: ${email}`);
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD configured:', process.env.EMAIL_PASSWORD ? 'Yes' : 'No');
    console.log('======================================================\n');
    
    // Step 1: Generate OTP
    console.log('STEP 1: Generating OTP...');
    const result = await hybridOtpService.sendOTP(email);
    
    if (!result.success) {
      console.error('Failed to generate OTP:', result.message);
      return;
    }
    
    console.log('OTP generated successfully!');
    console.log('OTP ID:', result.otpId);
    console.log('Email sent:', result.emailSent ? 'Yes' : 'No');
    
    if (result.emailSent) {
      console.log(`Check ${email} inbox for the OTP email`);
    }
    
    console.log('\nThe OTP is displayed in the console output above');
    console.log('Look for a line like: 📧 VERIFICATION CODE for email@example.com: 123456');
    console.log('\n======================================================\n');
    
    // Step 2: Verify OTP
    console.log('STEP 2: Verifying OTP...');
    console.log('Please enter the OTP you received:');
    
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
    
    console.log(`Verifying OTP ${otp} with ID ${result.otpId}...`);
    
    // Verify OTP
    const verifyResult = hybridOtpService.verifyOTP(result.otpId, otp);
    
    if (verifyResult.success) {
      console.log('\n======================================================');
      console.log('✅ OTP VERIFIED SUCCESSFULLY!');
      console.log('======================================================');
      console.log('Email:', verifyResult.email);
      console.log('\nIn a real application, the user would now be marked as verified');
      console.log('and would be able to access the protected features of the app.');
    } else {
      console.log('\n======================================================');
      console.log('❌ OTP VERIFICATION FAILED!');
      console.log('======================================================');
      console.log('Error:', verifyResult.message);
      console.log('\nPossible reasons:');
      console.log('1. The OTP was entered incorrectly');
      console.log('2. The OTP has expired (they expire after 5 minutes)');
      console.log('3. The OTP has already been used');
    }
    
    console.log('\n======================================================');
    console.log('TEST COMPLETED');
    console.log('======================================================');
  } catch (error) {
    console.error('Error testing complete OTP flow:', error);
  }
}

testCompleteOTPFlow();