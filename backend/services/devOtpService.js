const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or another database)
const otpStore = new Map();

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via Email (simulated for development)
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
    
    // Generate OTP
    const otp = '123456'; // Fixed OTP for development
    
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
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    
    return {
      success: true,
      message: 'OTP sent successfully to your email (Development Mode)',
      otpId,
      devMode: true,
      fixedOTP: otp // Include the OTP in the response for development
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
 * @returns {boolean} Whether the OTP is valid
 */
const verifyOTP = (otpId, userOTP) => {
  // Get stored OTP data
  const otpData = otpStore.get(otpId);
  
  // If no OTP found or expired
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