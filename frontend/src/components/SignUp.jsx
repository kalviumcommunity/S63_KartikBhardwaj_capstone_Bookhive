import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SignUp.css';
import Navbar from './Navbar';
import OTPVerification from './OTPVerification';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, sendOTP, verifyOTP } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  
  // OTP verification state
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState({
    otpId: '',
    email: '',
    isVerified: false
  });
  
  // Store form data during verification
  const [pendingSignup, setPendingSignup] = useState(null);
  
  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: '#e0e0e0'
  });

  // Handle input field focus
  const handleFocus = (field) => {
    setActiveField(field);
  };

  // Handle input field blur
  const handleBlur = () => {
    setActiveField(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        message: '',
        color: '#e0e0e0'
      });
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set message and color based on score
    let message = '';
    let color = '';
    
    switch(true) {
      case (score <= 1):
        message = 'Weak';
        color = '#e53e3e';
        break;
      case (score <= 3):
        message = 'Moderate';
        color = '#f39c12';
        break;
      case (score <= 5):
        message = 'Strong';
        color = '#5cb85c';
        break;
      default:
        message = '';
        color = '#e0e0e0';
    }
    
    setPasswordStrength({
      score,
      message,
      color
    });
  };

  // Handle email verification
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email) {
      setError('Please enter an email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send OTP to the email
      const response = await sendOTP(formData.email);
      
      if (response.success) {
        setOtpData({
          otpId: response.otpId,
          email: formData.email,
          isVerified: false,
          previewUrl: response.previewUrl,
          devMode: response.devMode || false
        });
        
        setShowOTP(true);
        setError('');
        
        // If we have a preview URL (for development), show it
        if (response.previewUrl) {
          toast.info(
            <div>
              Verification code sent! 
              <a 
                href={response.previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{display: 'block', marginTop: '8px', color: '#4a90e2'}}
              >
                Click here to view the email
              </a>
            </div>,
            { autoClose: false }
          );
        } else {
          toast.info('Verification code sent to your email');
        }
      } else {
        setError(response.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (otpCode) => {
    setIsLoading(true);
    
    try {
      const response = await verifyOTP(otpData.otpId, otpCode);
      
      if (response.success) {
        setOtpData(prev => ({
          ...prev,
          isVerified: true
        }));
        
        setShowOTP(false);
        toast.success('Email verified successfully!');
        
        // If there's a pending signup, complete it
        if (pendingSignup) {
          await completeSignup(pendingSignup.username, pendingSignup.email, pendingSignup.password);
          setPendingSignup(null);
        }
      } else {
        toast.error(response.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await sendOTP(formData.email);
      
      if (response.success) {
        setOtpData(prev => ({
          ...prev,
          otpId: response.otpId
        }));
        toast.info('A new verification code has been sent to your email');
      } else {
        toast.error(response.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend code. Please try again.');
    }
  };
  
  // Complete signup after verification
  const completeSignup = async (username, email, password) => {
    setIsLoading(true);
    
    try {
      console.log('Completing signup with verified email:', email);
      
      // Always pass true for isEmailVerified since we've already verified with OTP
      const response = await signup(
        username, 
        email, 
        password, 
        true
      );
      
      if (response.success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        setError(response.message || 'Error during signup');
      }
    } catch (err) {
      console.error('Error in completeSignup:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions');
      setIsLoading(false);
      return;
    }

    // Create username from first and last name
    const username = `${formData.firstName}${formData.lastName}`.toLowerCase();
    
    // If email is verified, complete signup
    if (otpData.isVerified) {
      await completeSignup(username, formData.email, formData.password);
    } 
    // If not verified, store signup data and trigger verification
    else {
      setPendingSignup({
        username,
        email: formData.email,
        password: formData.password
      });
      
      // Send OTP for verification
      await handleVerifyEmail(e);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="signup-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <motion.div 
        className="signup-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="signup-content"
          variants={itemVariants}
        >
          <motion.div 
            className="signup-image"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img src="/book-image.jpg" alt="Open book with glasses" />
          </motion.div>

          <motion.div 
            className="signup-form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="signup-form">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join BookHive Today!
              </motion.h1>
              
              <motion.p 
                className="welcome-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Start your reading journey with us
              </motion.p>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* OTP Verification Modal */}
              <AnimatePresence>
                {showOTP && (
                  <OTPVerification
                    email={otpData.email}
                    onVerify={handleVerifyOTP}
                    onCancel={() => setShowOTP(false)}
                    onResend={handleResendOTP}
                    isLoading={isLoading}
                    previewUrl={otpData.previewUrl}
                    devMode={otpData.devMode}
                  />
                )}
              </AnimatePresence>

              <motion.form 
                onSubmit={handleSubmit}
                variants={containerVariants}
              >
                <motion.div 
                  className="form-row"
                  variants={itemVariants}
                >
                  <motion.input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('firstName')}
                    onBlur={handleBlur}
                    required
                    whileFocus={{ scale: 1.02 }}
                    animate={{ 
                      borderColor: activeField === 'firstName' ? '#4a90e2' : '#e0e0e0',
                      boxShadow: activeField === 'firstName' ? '0 0 0 3px rgba(74, 144, 226, 0.15)' : 'none'
                    }}
                  />
                  
                  <motion.input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('lastName')}
                    onBlur={handleBlur}
                    required
                    whileFocus={{ scale: 1.02 }}
                    animate={{ 
                      borderColor: activeField === 'lastName' ? '#4a90e2' : '#e0e0e0',
                      boxShadow: activeField === 'lastName' ? '0 0 0 3px rgba(74, 144, 226, 0.15)' : 'none'
                    }}
                  />
                </motion.div>

                <motion.div
                  className="email-field-container"
                  variants={itemVariants}
                >
                  <motion.input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    whileFocus={{ scale: 1.02 }}
                    animate={{ 
                      borderColor: activeField === 'email' ? '#4a90e2' : '#e0e0e0',
                      boxShadow: activeField === 'email' ? '0 0 0 3px rgba(74, 144, 226, 0.15)' : 'none'
                    }}
                  />
                  
                  <AnimatePresence>
                    {!otpData.isVerified && (
                      <motion.button 
                        type="button" 
                        className="verify-email-btn"
                        onClick={handleVerifyEmail}
                        disabled={isLoading}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {isLoading ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            Sending...
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            Verify Email Address
                          </motion.span>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {otpData.isVerified && (
                      <motion.div 
                        className="email-verified"
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Email address verified
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  className="password-field-container"
                  variants={itemVariants}
                >
                  <motion.input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    required
                    whileFocus={{ scale: 1.02 }}
                    animate={{ 
                      borderColor: activeField === 'password' ? '#4a90e2' : '#e0e0e0',
                      boxShadow: activeField === 'password' ? '0 0 0 3px rgba(74, 144, 226, 0.15)' : 'none'
                    }}
                  />
                  
                  {formData.password && (
                    <motion.div 
                      className="password-strength"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="strength-bar-container">
                        <motion.div 
                          className="strength-bar"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <motion.span 
                        className="strength-text"
                        animate={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.message}
                      </motion.span>
                    </motion.div>
                  )}
                </motion.div>

                <motion.input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  required
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                  animate={{ 
                    borderColor: activeField === 'confirmPassword' ? '#4a90e2' : '#e0e0e0',
                    boxShadow: activeField === 'confirmPassword' ? '0 0 0 3px rgba(74, 144, 226, 0.15)' : 'none'
                  }}
                />

                <motion.div 
                  className="terms-container"
                  variants={itemVariants}
                >
                  <motion.label
                    whileHover={{ color: '#4a90e2' }}
                  >
                    <motion.input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                    <span>I agree to BookHive's Terms & Privacy Policy</span>
                  </motion.label>
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="create-account-btn" 
                  disabled={isLoading}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Signing up...
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Join BookHive
                    </motion.span>
                  )}
                </motion.button>

                <motion.div 
                  className="alt-signup"
                  variants={itemVariants}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Or continue with
                  </motion.p>
                  <motion.div 
                    className="social-signup"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <motion.button 
                      type="button" 
                      className="google-btn" 
                      onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.img 
                        src="/google-icon.svg" 
                        alt="Google" 
                        className="provider-icon"
                        whileHover={{ rotate: 10 }}
                      />
                      Continue with Google
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;