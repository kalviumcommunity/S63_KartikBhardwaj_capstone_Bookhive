import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/SignUp.css';
import Navbar from './Navbar';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
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

    try {
      // Create username from first and last name
      const username = `${formData.firstName}${formData.lastName}`.toLowerCase();
      const response = await signup(username, formData.email, formData.password);
      
      if (response.success) {
        navigate('/');
      } else {
        setError(response.message || 'Error during signup');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-image">
            <img src="/book-image.jpg" alt="Open book with glasses" />
          </div>

          <div className="signup-form-container">
            <div className="signup-form">
              <h1>Join BookHive Today!</h1>
              <p className="welcome-text">Start your reading journey with us</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <div className="terms-container">
                  <label>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <span>I agree to BookHive's Terms & Privacy Policy</span>
                  </label>
                </div>

                <button type="submit" className="create-account-btn" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Join BookHive'}
                </button>

                <div className="alt-signup">
                  <p>Or continue with</p>
                  <div className="social-signup">
                    <button type="button" className="google-btn" onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}>
                      <img src="/google-icon.svg" alt="Google" className="provider-icon" />
                      Continue with Google
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 