const nodemailer = require('nodemailer');

// Create a transporter for sending emails
let transporter;

/**
 * Create a transporter for sending emails
 * Will use Gmail if credentials are available, otherwise falls back to Ethereal for testing
 * @returns {Promise<nodemailer.Transporter>} - The email transporter
 */
async function createTransporter() {
  // If we already have a transporter, return it
  if (transporter) return transporter;
  
  // Check if we have Gmail credentials
  const emailUser = process.env.EMAIL_USER || 'kbrupc2020@gmail.com';
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (emailPassword) {
    // Create a transporter using Gmail
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });
    
    console.log(`Gmail transporter created for ${emailUser}`);
    return transporter;
  } else {
    console.log('EMAIL_PASSWORD environment variable is not set!');
    console.log('Falling back to Ethereal for email testing...');
    return createEtherealTransporter();
  }
}

/**
 * Create a test email transporter using Ethereal
 * @returns {Promise<nodemailer.Transporter>} - The Ethereal email transporter
 */
async function createEtherealTransporter() {
  try {
    // Create a test account on Ethereal (fake SMTP service for testing)
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter using the test account
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('Ethereal Email credentials:');
    console.log('Username:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('Preview URL: https://ethereal.email');
    
    return transporter;
  } catch (error) {
    console.error('Failed to create Ethereal transporter:', error);
    throw error;
  }
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Send result
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    // Make sure we have a transporter
    if (!transporter) {
      await createTransporter();
    }
    
    // Get the email user from environment or use default
    const emailUser = process.env.EMAIL_USER || 'kbrupc2020@gmail.com';
    
    const info = await transporter.sendMail({
      from: `"BookHive 📚" <${emailUser}>`,
      to,
      subject,
      text,
      html
    });
    
    console.log('Email sent:', info.messageId);
    
    // Check if we're using Ethereal (which provides a preview URL)
    const isEthereal = transporter.options.host === 'smtp.ethereal.email';
    let previewUrl = null;
    
    if (isEthereal) {
      // Get the preview URL for Ethereal emails
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
      isRealEmail: !isEthereal
    };
  } catch (error) {
    console.error('Error sending email:', error);
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