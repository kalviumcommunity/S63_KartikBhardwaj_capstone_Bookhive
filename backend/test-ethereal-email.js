require('dotenv').config();
const { sendOTPEmail } = require('./services/emailService');

async function testEmailService() {
  console.log('Testing Ethereal email service...');
  
  try {
    // Generate a test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send the test email
    console.log('Sending test email to test@example.com...');
    const result = await sendOTPEmail('test@example.com', testOTP);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Test OTP:', testOTP);
      
      if (result.previewUrl) {
        console.log('\n📧 View the email at this URL:');
        console.log(result.previewUrl);
        console.log('\nThis URL will show you exactly what the email looks like and contains the OTP code.');
      }
    } else {
      console.error('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email service:', error);
  }
}

// Run the test
testEmailService();