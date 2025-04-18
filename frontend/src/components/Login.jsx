import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import Navbar from './Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
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
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-container">
            <div className="login-form">
              <h1>Welcome Back</h1>
              <p className="login-subtitle">Please sign in to your account</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email or Username :</label>
                  <input
                    type="text"
                    name="emailOrUsername"
                    placeholder="Enter your email"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="login-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password ?
                  </Link>
                </div>

                <button type="submit" className="sign-in-btn">
                  Sign In
                </button>

                <p className="signup-prompt">
                  Don't have an account? <Link to="/signup">Sign up</Link>
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