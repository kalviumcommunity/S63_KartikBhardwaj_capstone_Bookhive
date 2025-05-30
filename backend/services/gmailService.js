/**
 * Gmail Service for sending emails
 * 
 * This service uses Nodemailer with Gmail to send real emails to users
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a Gmail transporter
const createGmailTransporter = () => {
  // Get Gmail credentials from environment variables
  const email = process.env.EMAIL_USER || 'kbrupc2020@gmail.com';
  const password = process.env.EMAIL_PASSWORD;

  if (!password) {
    console.error('EMAIL_PASSWORD environment variable is not set!');
    console.error('Please set up your Gmail app password in the .env file');
    console.error('See GMAIL_APP_PASSWORD_SETUP.md for instructions');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });
};

/**
 * Send an email using Gmail
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Send result
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = createGmailTransporter();
    
    if (!transporter) {
      return {
        success: false,
        error: 'Gmail transporter could not be created. Check your EMAIL_PASSWORD in .env file.'
      };
    }
    
    const from = process.env.EMAIL_USER || 'kbrupc2020@gmail.com';
    
    const info = await transporter.sendMail({
      from: `"BookHive 📚" <${from}>`,
      to,
      subject,
      text,
      html
    });
    
    console.log('Email sent with Gmail:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email with Gmail:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send OTP verification email
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @returns {Promise<Object>} - Send result
 */
async function sendOTPEmail(email, otp) {
  const subject = 'Your BookHive Verification Code';
  
  const text = `
    Your BookHive verification code is: ${otp}
    
    This code will expire in 5 minutes.
    
    If you didn't request this code, please ignore this email.
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a90e2; text-align: center;">BookHive Verification</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes.</p>
      <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} BookHive. All rights reserved.
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
}

module.exports = {
  sendEmail,
  sendOTPEmail
};