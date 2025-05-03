import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import UserProfileMenu from './UserProfileMenu';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.nav-links') && !event.target.closest('.hamburger')) {
        setMenuOpen(false);
      }
      if (profileDropdown && !event.target.closest('.user-profile')) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, profileDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdown(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <Link to="/">
          <img src="/Logo.png" alt="Book Hive Logo" />
        </Link>
      </div>
      
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/books" className={location.pathname === '/books' ? 'active' : ''}>
          Books
        </Link>
        {isAuthenticated() && (
          <Link to="/reviews" className={location.pathname === '/reviews' ? 'active' : ''}>
            Reviews
          </Link>
        )}
        {!isAuthenticated() && (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
              Login
            </Link>
            <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
              Sign Up
            </Link>
          </>
        )}
      </div>
      
      <div className="search-container">
        <div className="search-box">
          <input type="text" placeholder="Search Books..." />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {isAuthenticated() && (
      <div className="nav-right">
          <UserProfileMenu />
      </div>
      )}

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
      </div>
    </nav>
  );
};

export default Navbar; 