import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
        document.body.classList.add('scrolled-page');
      } else {
        setScrolled(false);
        document.body.classList.remove('scrolled-page');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      
      if (menuOpen && navLinks && hamburger && 
          !navLinks.contains(event.target) && 
          !hamburger.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src="/Logo.png" alt="Book Hive Logo" />
      </div>
      
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <a href="/" className="active">Home</a>
        <a href="/books">Books</a>
        <a href="/login">Login</a>
        <a href="/signup">Sign Up</a>
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
      
      <div className="nav-right">
        <div className="user-profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'active' : ''}`}></div>
      </div>
    </nav>
  );
};

export default Navbar; 