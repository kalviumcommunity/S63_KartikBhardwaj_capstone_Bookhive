import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/NavbarProfile.css';

const NavbarProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="profile-wrapper" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-button"
      >
        <div className="avatar-container">
          <span className="avatar-text">
            {user.username ? user.username[0].toUpperCase() : 'U'}
          </span>
        </div>
        <span className="username-text">{user.username}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* Header */}
          <div className="dropdown-header">
            <div className="header-content">
              <div className="header-avatar">
                <span className="header-avatar-text">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </span>
              </div>
              <div className="header-info">
                <h3>{user.username}</h3>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="account-info">
            <h4>Account Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <p><span>User ID:</span> {user.id}</p>
              </div>
              <div className="info-item">
                <p><span>Account Type:</span> {user.role || 'Regular User'}</p>
              </div>
              <div className="info-item">
                <p><span>Last Login:</span> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="dropdown-actions">
            <button
              onClick={() => navigate('/profile')}
              className="action-button"
            >
              View Full Profile
            </button>
            <button
              onClick={handleLogout}
              className="action-button logout"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarProfile; 