const crypto = require('crypto');
// Use Mailtrap for reliable email testing
const { sendOTPEmail } = require('./mailtrapService');

// Store OTPs temporarily (in production, use Redis or another database)
const otpStore = new Map();

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Clean up expired OTPs from the store
 * This helps prevent memory leaks in the OTP store
 */
const cleanupExpiredOTPs = () => {
  const now = new Date();
  for (const [otpId, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(otpId);
    }
  }
};

/**
 * Send OTP via Email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string, otpId: string, previewUrl?: string}>}
 */
const sendOTP = async (email) => {
  try {
    // Clean up expired OTPs first
    cleanupExpiredOTPs();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email format'
      };
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Generate a unique ID for this OTP request
    const otpId = crypto.randomUUID();
    
    // Store OTP with expiration time (5 minutes)
    otpStore.set(otpId, {
      otp,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    });
    
    // Log the OTP for debugging
    console.log(`OTP for ${email}: ${otp}`);
    
    // Send the OTP via email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      return {
        success: false,
        message: 'Failed to send verification code to your email. Please try again.',
        error: emailResult.error
      };
    }
    
    return {
      success: true,
      message: 'OTP sent successfully to your email',
      otpId,
      previewUrl: emailResult.previewUrl // Include the preview URL for development
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    };
  }
};

/**
 * Verify OTP
 * @param {string} otpId - The unique ID for the OTP request
 * @param {string} userOTP - The OTP entered by the user
 * @returns {{success: boolean, message: string, email?: string}} Result of verification
 */
const verifyOTP = (otpId, userOTP) => {
  // Clean up expired OTPs first
  cleanupExpiredOTPs();
  
  // Get stored OTP data
  const otpData = otpStore.get(otpId);
  
  // If no OTP found
  if (!otpData) {
    return {
      success: false,
      message: 'Invalid or expired OTP session'
    };
  }
  
  // Check if OTP is expired
  if (new Date() > otpData.expiresAt) {
    otpStore.delete(otpId); // Clean up expired OTP
    return {
      success: false,
      message: 'OTP has expired'
    };
  }
  
  // Verify OTP
  if (otpData.otp === userOTP) {
    otpStore.delete(otpId); // Clean up used OTP
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