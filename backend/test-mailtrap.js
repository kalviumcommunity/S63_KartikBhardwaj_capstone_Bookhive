/**
 * Test script for Mailtrap email service
 * 
 * This script tests sending an email to a specified address using Mailtrap
 * 
 * Usage:
 * node test-mailtrap.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

const { sendOTPEmail } = require('./services/mailtrapService');

async function testMailtrap() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log(`Sending test OTP to ${email} using Mailtrap...`);
    
    // Generate a test OTP
    const otp = '123456';
    
    // Send OTP
    const result = await sendOTPEmail(email, otp);
    
    if (result.success) {
      console.log('Email sent successfully to Mailtrap!');
      console.log('Message ID:', result.messageId);
      console.log('Preview URL:', result.previewUrl);
      console.log('Check your Mailtrap inbox to see the email');
    } else {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error testing Mailtrap:', error);
  }
}

testMailtrap();