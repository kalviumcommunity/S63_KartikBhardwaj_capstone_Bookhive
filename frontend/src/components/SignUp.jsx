import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignUp.css';
import Navbar from './Navbar';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - for now just log the data
    console.log('Form submitted:', formData);
    // You would typically send this data to your backend here
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
              <h1>Create a Account</h1>
              <p className="signin-prompt">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>

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
                  placeholder="Email :"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
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
                    <span>I agree to the Terms & Conditions</span>
                  </label>
                </div>

                <button type="submit" className="create-account-btn">
                  Create account
                </button>

                <div className="alt-signup">
                  <p>Or register with</p>
                  <div className="social-signup">
                    <button type="button" className="google-btn">
                      <img src="/google-icon.svg" alt="Google" className="provider-icon" />
                      Sign up with Google
                    </button>
                    <button type="button" className="apple-btn">
                      <img src="/apple-icon.svg" alt="Apple" className="provider-icon" />
                      Sign up with Apple
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

export default SignUp; 