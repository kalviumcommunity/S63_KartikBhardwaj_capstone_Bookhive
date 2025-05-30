/**
 * Test script for Gmail service
 * 
 * This script tests sending an email using the Gmail service
 * 
 * Usage:
 * node test-gmail-service.js [email]
 * 
 * If no email is provided, it will use kalviumkalvi@gmail.com
 */

require('dotenv').config();
const gmailService = require('./services/gmailService');

async function testGmailService() {
  try {
    // Get email from command line or use default
    const email = process.argv[2] || 'kalviumkalvi@gmail.com';
    
    console.log(`Testing Gmail service by sending an email to ${email}...`);
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD configured:', process.env.EMAIL_PASSWORD ? 'Yes' : 'No');
    
    if (!process.env.EMAIL_PASSWORD) {
      console.error('\nERROR: EMAIL_PASSWORD is not set in .env file!');
      console.error('Please set up your Gmail app password in the .env file');
      console.error('See GMAIL_APP_PASSWORD_SETUP.md for instructions');
      return;
    }
    
    // Generate a test OTP
    const otp = '123456';
    
    // Send OTP email
    const result = await gmailService.sendOTPEmail(email, otp);
    
    if (result.success) {
      console.log('\nEmail sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log(`Check ${email} inbox for the test email`);
    } else {
      console.error('\nFailed to send email:', result.error);
      console.error('Please check your Gmail app password and try again');
    }
  } catch (error) {
    console.error('Error testing Gmail service:', error);
  }
}

testGmailService();