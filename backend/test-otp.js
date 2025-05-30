const { sendOTP, verifyOTP } = require('./services/otpService');

async function testOTP() {
  try {
    // Test sending OTP
    console.log('Testing OTP service...');
    const email = 'test@example.com';
    
    console.log(`Sending OTP to ${email}...`);
    const sendResult = await sendOTP(email);
    
    if (sendResult.success) {
      console.log('OTP sent successfully!');
      console.log('OTP ID:', sendResult.otpId);
      
      // For testing, we'll get the OTP from the console output
      console.log('Please check the console output for the OTP code');
      console.log('Enter the OTP code to verify:');
      
      // In a real application, the user would enter the OTP
      // For this test, we'll simulate verification with a fake OTP
      const fakeOTP = '123456';
      console.log(`Verifying OTP ${fakeOTP}...`);
      
      const verifyResult = verifyOTP(sendResult.otpId, fakeOTP);
      
      if (verifyResult.success) {
        console.log('OTP verified successfully!');
      } else {
        console.log('OTP verification failed:', verifyResult.message);
      }
    } else {
      console.log('Failed to send OTP:', sendResult.message);
    }
  } catch (error) {
    console.error('Error testing OTP service:', error);
  }
}

testOTP();