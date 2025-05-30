const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize SendGrid (if you have a SendGrid API key)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send OTP via Twilio Verify
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string, otpId: string}>}
 */
const sendOTP = async (email) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email format'
      };
    }

    // Send verification code using Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: email,
        channel: 'email'
      });

    console.log('Verification sent:', verification.status);
    
    return {
      success: true,
      message: 'OTP sent successfully to your email',
      otpId: email, // Use email as the OTP ID for Twilio Verify
      status: verification.status
    };
  } catch (error) {
    console.error('Error sending OTP via Twilio:', error);
    
    // If Twilio fails, try to send a manual email with SendGrid if available
    if (process.env.SENDGRID_API_KEY) {
      return sendManualOTP(email);
    }
    
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    };
  }
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP manually via SendGrid (fallback)
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string, otpId: string, otp: string}>}
 */
const sendManualOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in memory (in production, use Redis or another database)
    const otpId = `manual-${Date.now()}`;
    manualOtpStore.set(otpId, {
      otp,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    });
    
    // Send email with OTP
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'kbrupc2020@gmail.com',
      subject: 'Your BookHive Verification Code',
      text: `Your BookHive verification code is: ${otp}. This code will expire in 5 minutes.`,
      html: `
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
      `
    };
    
    await sgMail.send(msg);
    
    console.log(`Manual OTP for ${email}: ${otp}`);
    
    return {
      success: true,
      message: 'OTP sent successfully to your email (manual)',
      otpId,
      isManual: true
    };
  } catch (error) {
    console.error('Error sending manual OTP:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    };
  }
};

// Store for manual OTPs (in production, use Redis or another database)
const manualOtpStore = new Map();

/**
 * Verify OTP
 * @param {string} otpId - The unique ID for the OTP request or email for Twilio Verify
 * @param {string} userOTP - The OTP entered by the user
 * @returns {Promise<{success: boolean, message: string, email: string}>}
 */
const verifyOTP = async (otpId, userOTP) => {
  try {
    // Check if this is a manual OTP
    if (otpId.startsWith('manual-')) {
      return verifyManualOTP(otpId, userOTP);
    }
    
    // Otherwise, use Twilio Verify
    const email = otpId; // For Twilio, the otpId is the email
    
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: email,
        code: userOTP
      });
    
    if (verification.status === 'approved') {
      return {
        success: true,
        message: 'OTP verified successfully',
        email
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify OTP'
    };
  }
};

/**
 * Verify manual OTP
 * @param {string} otpId - The unique ID for the OTP request
 * @param {string} userOTP - The OTP entered by the user
 * @returns {{success: boolean, message: string, email: string}}
 */
const verifyManualOTP = (otpId, userOTP) => {
  // Get stored OTP data
  const otpData = manualOtpStore.get(otpId);
  
  // If no OTP found or expired
  if (!otpData) {
    return {
      success: false,
      message: 'Invalid or expired OTP session'
    };
  }
  
  // Check if OTP is expired
  if (new Date() > otpData.expiresAt) {
    manualOtpStore.delete(otpId); // Clean up expired OTP
    return {
      success: false,
      message: 'OTP has expired'
    };
  }
  
  // Verify OTP
  if (otpData.otp === userOTP) {
    manualOtpStore.delete(otpId); // Clean up used OTP
    return {
      success: true,
      message: 'OTP verified successfully',
      email: otpData.email
    };
  }
  
  return {
    success: false,
    message: 'Invalid OTP'
  };
};

module.exports = {
  sendOTP,
  verifyOTP
};