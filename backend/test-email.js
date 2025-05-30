require('dotenv').config();
const { sendOTPEmail } = require('./services/emailService');

async function testEmailService() {
  console.log('Testing email service...');
  console.log('Sending test OTP email to kbrupc2020@gmail.com');
  
  try {
    // Generate a test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send the test email
    const result = await sendOTPEmail('kbrupc2020@gmail.com', testOTP);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Test OTP:', testOTP);
    } else {
      console.error('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email service:', error);
  }
}

// Run the test
testEmailService();