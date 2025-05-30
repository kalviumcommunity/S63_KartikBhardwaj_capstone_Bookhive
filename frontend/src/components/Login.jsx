import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Login.css';
import Navbar from './Navbar';
import OTPVerification from './OTPVerification';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, checkAuthStatus, sendOTP, verifyLoginOTP } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP verification state
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState({
    userId: '',
    otpId: '',
    email: ''
  });
  
  // Get the redirect path and message from location state
  const from = location.state?.from || '/';
  const message = location.state?.message;

  useEffect(() => {
    // Display message if provided in location state
    if (message) {
      toast.info(message);
    }
    
    // Handle OAuth token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      checkAuthStatus();
      navigate(from);
    }
  }, [navigate, checkAuthStatus, from, message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Try to login with OTP requirement
      const response = await login(formData.identifier, formData.password, true);
      
      if (response.success) {
        // Check if OTP verification is required
        if (response.requireOTP) {
          // Store user ID and email
          setOtpData({
            userId: response.userId,
            email: response.email,
            otpId: '' // Will be set after sending OTP
          });
          
          // Send OTP to the user's email
          const otpResponse = await sendOTP(response.email);
          
          if (otpResponse.success) {
            setOtpData(prev => ({
              ...prev,
              otpId: otpResponse.otpId,
              previewUrl: otpResponse.previewUrl,
              devMode: otpResponse.devMode || false
            }));
            
            // Show OTP verification modal
            setShowOTP(true);
            
            // If we have a preview URL (for development), show it
            if (otpResponse.previewUrl) {
              toast.info(
                <div>
                  Verification code sent! 
                  <a 
                    href={otpResponse.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{display: 'block', marginTop: '8px', color: '#4a90e2'}}
                  >
                    Click here to view the email
                  </a>
                </div>,
                { autoClose: false }
              );
            }
          } else {
            setError(otpResponse.message || 'Failed to send verification code');
          }
        } else {
          // No OTP required, proceed with login
          toast.success('Login successful!');
          navigate(from);
        }
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (otpCode) => {
    setIsLoading(true);
    
    try {
      const response = await verifyLoginOTP(otpData.userId, otpData.otpId, otpCode);
      
      if (response.success) {
        toast.success('Login successful!');
        setShowOTP(false);
        navigate(from);
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
      const response = await sendOTP(otpData.userId);
      
      if (response.success) {
        setOtpData(prev => ({
          ...prev,
          otpId: response.otpId
        }));
        toast.info('A new verification code has been sent');
      } else {
        toast.error(response.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-container">
            <div className="login-form">
              <h1>Welcome Back</h1>
              <p className="login-subtitle">Please login to your account</p>

              {error && <div className="error-message">{error}</div>}
              
              {/* OTP Verification Modal */}
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

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="identifier">Email or Username</label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email or username"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>

                <div className="login-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="alt-signup">
                  <p>Or continue with</p>
                  <button
                    type="button"
                    className="google-btn"
                    onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
                  >
                    <img src="/google-icon.svg" alt="Google" className="provider-icon" />
                    Continue with Google
                  </button>
                </div>

                <p className="signup-prompt">
                  Don't have an account? <Link to="/signup">Create Account</Link>
                </p>
              </form>
            </div>
          </div>
          
          <div className="login-image">
            <div className="image-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Magical floating book in library" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 