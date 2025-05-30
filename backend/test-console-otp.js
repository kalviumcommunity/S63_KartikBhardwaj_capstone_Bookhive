/**
 * Test script for Console OTP service
 * 
 * This script tests generating an OTP and displaying it in the console
 * 
 * Usage:
 * node test-console-otp.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

const otpService = require('./services/consoleOtpService');

async function testConsoleOTP() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log(`Generating OTP for ${email}...`);
    
    // Send OTP
    const result = await otpService.sendOTP(email);
    
    if (result.success) {
      console.log('OTP generated successfully!');
      console.log('OTP ID:', result.otpId);
      console.log('Look for the OTP code in the console output above');
      
      // Now let's verify the OTP
      console.log('\nTesting verification with the generated OTP...');
      
      // For testing purposes, we'll use the OTP from the console output
      const otpId = result.otpId;
      
      // Get the OTP from the console output (this is a hack for testing)
      const consoleOutput = process.stdout.write;
      let capturedOtp = '';
      
      console.log('Please enter the OTP you see above:');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('OTP: ', (otp) => {
        console.log(`Using OTP: ${otp}`);
        
        const verifyResult = otpService.verifyOTP(otpId, otp);
        
        if (verifyResult.success) {
          console.log('Verification successful!');
        } else {
          console.error('Verification failed:', verifyResult.message);
        }
        
        readline.close();
      });
    } else {
      console.error('Failed to generate OTP:', result.message);
    }
  } catch (error) {
    console.error('Error testing console OTP:', error);
  }
}

testConsoleOTP();