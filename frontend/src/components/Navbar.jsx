import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import '../styles/MobileSearch.css';
import UserProfileMenu from './UserProfileMenu';
import SearchSuggestions from './SearchSuggestions';
import NotificationPanel from './NotificationPanel';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLink, setActiveLink] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const logoRef = useRef(null);

  // Navigation links with icons
  const navLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/books', label: 'Books', icon: 'books' },
    { path: '/mood-matcher', label: 'Mood Matcher', icon: 'mood' },
    { path: '/book-chat', label: 'Book Chat', icon: 'chat' },
    ...(isAuthenticated() ? [{ path: '/reviews', label: 'Reviews', icon: 'reviews' }] : []),
  ];

  // Set active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Handle scroll effect with enhanced animations
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.menu-toggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Focus search input when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [searchExpanded]);

  // Logo animation on scroll
  useEffect(() => {
    if (logoRef.current) {
      if (scrolled) {
        logoRef.current.classList.add('logo-animated');
      } else {
        setTimeout(() => {
          logoRef.current.classList.remove('logo-animated');
        }, 200);
      }
    }
  }, [scrolled]);

  // Toggle search expansion
  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchExpanded(false);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (searchExpanded) setSearchExpanded(false);
  };

  // Handle link hover for animation
  const handleLinkHover = (index) => {
    setHoverIndex(index);
  };

  // Handle link leave
  const handleLinkLeave = () => {
    setHoverIndex(null);
  };

  // Animated SVG icons for navigation
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="nav-icon animated-home-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* House structure with breathing animation */}
            <path className="home-structure" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Door with opening animation */}
            <path className="home-door" d="M9 22V12H15V22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated chimney smoke */}
            <g className="home-smoke">
              <circle className="smoke smoke-1" cx="16" cy="6" r="0.5" fill="currentColor" opacity="0.4"/>
              <circle className="smoke smoke-2" cx="17" cy="4" r="0.3" fill="currentColor" opacity="0.3"/>
              <circle className="smoke smoke-3" cx="15.5" cy="3" r="0.4" fill="currentColor" opacity="0.2"/>
            </g>
          </svg>
        );
      case 'books':
        return (
          <svg className="nav-icon animated-books-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Book spine with page flip animation */}
            <path className="book-spine" d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path className="book-cover" d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated pages */}
            <g className="book-pages">
              <line className="page page-1" x1="8" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
              <line className="page page-2" x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
              <line className="page page-3" x1="8" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
              <line className="page page-4" x1="8" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </g>
          </svg>
        );
      case 'mood':
        return (
          <svg className="nav-icon animated-mood-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Face circle with breathing */}
            <path className="mood-face" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated smile */}
            <path className="mood-smile" d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Blinking eyes */}
            <circle className="mood-eye eye-left" cx="9" cy="9" r="1" fill="currentColor"/>
            <circle className="mood-eye eye-right" cx="15" cy="9" r="1" fill="currentColor"/>
            {/* Mood sparkles */}
            <g className="mood-sparkles">
              <circle className="sparkle sparkle-1" cx="6" cy="6" r="0.5" fill="currentColor" opacity="0.6"/>
              <circle className="sparkle sparkle-2" cx="18" cy="7" r="0.3" fill="currentColor" opacity="0.5"/>
              <circle className="sparkle sparkle-3" cx="19" cy="16" r="0.4" fill="currentColor" opacity="0.4"/>
            </g>
          </svg>
        );
      case 'reviews':
        return (
          <svg className="nav-icon animated-reviews-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Document with writing animation */}
            <path className="review-document" d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated pen */}
            <path className="review-pen" d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Writing lines with typewriter effect */}
            <g className="review-lines">
              <line className="writing-line line-1" x1="5" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
              <line className="writing-line line-2" x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
              <line className="writing-line line-3" x1="5" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
            </g>
          </svg>
        );
      case 'search':
        return (
          <svg className="nav-icon animated-search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main search circle with pulsing animation */}
            <circle className="search-circle" cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Search handle with sliding animation */}
            <path className="search-handle" d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated search rays */}
            <g className="search-rays">
              <line className="ray ray-1" x1="11" y1="3" x2="11" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <line className="ray ray-2" x1="19" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <line className="ray ray-3" x1="11" y1="19" x2="11" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <line className="ray ray-4" x1="3" y1="11" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </g>
          </svg>
        );
      case 'login':
        return (
          <svg className="nav-icon animated-login-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Door with opening animation */}
            <path className="login-door" d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path className="login-frame" d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated arrow pointing in */}
            <g className="login-arrow">
              <path className="arrow-shaft" d="M10 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path className="arrow-head" d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        );
      case 'signup':
        return (
          <svg className="nav-icon animated-signup-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Document base */}
            <path className="signup-document" d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path className="signup-frame" d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated plus sign */}
            <g className="signup-plus">
              <line className="plus-vertical" x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line className="plus-horizontal" x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        );
      case 'chat':
        return (
          <svg className="nav-icon animated-chat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chat bubble with breathing */}
            <path className="chat-bubble" d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Animated typing dots */}
            <g className="chat-dots">
              <circle className="typing-dot dot-1" cx="10" cy="12" r="1" fill="currentColor"/>
              <circle className="typing-dot dot-2" cx="12.5" cy="12" r="1" fill="currentColor"/>
              <circle className="typing-dot dot-3" cx="15" cy="12" r="1" fill="currentColor"/>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`} ref={navbarRef}>
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="logo-container" ref={logoRef}>
            <Link to="/" className="logo-link">
              <div className="logo-wrapper">
                <img src="/Logo.png" alt="Book Hive Logo" className="logo-image" />
                <div className="logo-shine"></div>
              </div>
              <div className="logo-text">
                <span className="logo-text-main">BookHive</span>
                <span className="logo-text-tagline">Discover • Read • Connect</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navLinks.map((link, index) => (
                <li 
                  key={link.path} 
                  className={`nav-item ${activeLink === link.path ? 'active' : ''}`}
                  onMouseEnter={() => handleLinkHover(index)}
                  onMouseLeave={handleLinkLeave}
                >
                  <Link to={link.path} className="nav-link">
                    <span className="nav-icon-wrapper">
                      {getIcon(link.icon)}
                      <span className="nav-icon-glow"></span>
                    </span>
                    <span className="nav-text">{link.label}</span>
                    {(activeLink === link.path || hoverIndex === index) && (
                      <span className="nav-highlight"></span>
                    )}
                  </Link>
                </li>
              ))}
              
              {/* Find Books - Following Navbar Pattern */}
              <li className="nav-item search-item">
                <div className={`bookhive-search ${searchExpanded ? 'expanded' : ''}`}>
                  <button 
                    className="find-books-button-redesigned nav-link" 
                    onClick={toggleSearch}
                    aria-label="Toggle search"
                  >
                    <span className="nav-icon-wrapper">
                      {/* Animated search icon with moving elements */}
                      <svg 
                        className="nav-icon animated-search-icon"
                        width="22" 
                        height="22" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Main search circle with pulsing animation */}
                        <circle 
                          className="search-circle"
                          cx="11" 
                          cy="11" 
                          r="8" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        {/* Search handle with sliding animation */}
                        <path 
                          className="search-handle"
                          d="m21 21-4.35-4.35" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        {/* Animated search rays */}
                        <g className="search-rays">
                          <line className="ray ray-1" x1="11" y1="3" x2="11" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                          <line className="ray ray-2" x1="19" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                          <line className="ray ray-3" x1="11" y1="19" x2="11" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                          <line className="ray ray-4" x1="3" y1="11" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                        </g>
                      </svg>
                      <span className="nav-icon-glow"></span>
                    </span>
                    <span className="nav-text">Find Books</span>
                  </button>
                  
                  <div className="search-drawer">
                    <form className="bookshelf-search-form" onSubmit={handleSearchSubmit}>
                      <div className="search-page">
                        <div className="page-lines">
                          <input 
                            ref={searchInputRef}
                            type="text" 
                            className="bookshelf-search-input" 
                            placeholder="Search titles, authors, genres..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="page-corner"></div>
                      </div>
                      <button type="submit" className="bookshelf-search-submit">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="submit-text">Search</span>
                      </button>
                      
                      {/* Search Suggestions */}
                      {searchExpanded && (
                        <SearchSuggestions 
                          query={searchQuery} 
                          onSelect={() => setSearchExpanded(false)}
                          onClose={() => setSearchExpanded(false)}
                        />
                      )}
                    </form>
                    <div className="search-tags">
                      <span className="search-tag" onClick={() => { 
                        setSearchQuery('Fantasy'); 
                        handleSearchSubmit(new Event('submit')); 
                      }}>Fantasy</span>
                      <span className="search-tag" onClick={() => { 
                        setSearchQuery('Mystery'); 
                        handleSearchSubmit(new Event('submit')); 
                      }}>Mystery</span>
                      <span className="search-tag" onClick={() => { 
                        setSearchQuery('Romance'); 
                        handleSearchSubmit(new Event('submit')); 
                      }}>Romance</span>
                      <span className="search-tag" onClick={() => { 
                        setSearchQuery('Science Fiction'); 
                        handleSearchSubmit(new Event('submit')); 
                      }}>Sci-Fi</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          {/* Navbar Actions */}
          <div className="navbar-actions">
            {/* User Profile or Auth Buttons */}
            {isAuthenticated() ? (
              <div className="navbar-user-section">
                <NotificationPanel />
                <UserProfileMenu />
              </div>
            ) : (
              <div className="auth-buttons">
                {!isAuthenticated() && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="nav-item"
                    >
                      <Link to="/login" className="nav-link">
                        <span className="nav-icon-wrapper">
                           {getIcon('login')}
                          <span className="nav-icon-glow"></span>
                        </span>
                        <span className="nav-text">Login</span>
                         {(activeLink === '/login' || hoverIndex === navLinks.length) && (
                           <span className="nav-highlight"></span>
                         )}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                       className="nav-item"
                    >
                      <Link to="/signup" className="nav-link">
                         <span className="nav-icon-wrapper">
                           {getIcon('signup')}
                          <span className="nav-icon-glow"></span>
                        </span>
                        <span className="nav-text">Sign Up</span>
                         {(activeLink === '/signup' || hoverIndex === navLinks.length + 1) && (
                           <span className="nav-highlight"></span>
                         )}
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className={`menu-toggle ${menuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="menu-toggle-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <img src="/Logo.png" alt="Book Hive Logo" className="mobile-logo" />
            <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Mobile BookHive Search */}
          <div className="mobile-bookhive-search">
            <div className="mobile-bookshelf-header">
              <div className="mobile-bookshelf-icon">
                <span className="mobile-book"></span>
                <span className="mobile-book"></span>
                <span className="mobile-book"></span>
                <span className="mobile-magnifier">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <h3 className="mobile-search-title">Find Your Next Book</h3>
            </div>
            
            <form className="mobile-bookshelf-search-form" onSubmit={handleSearchSubmit}>
              <div className="mobile-search-page">
                <div className="mobile-page-lines">
                  <input 
                    type="text" 
                    className="mobile-bookshelf-search-input" 
                    placeholder="Search titles, authors, genres..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mobile-page-corner"></div>
              </div>
              <button type="submit" className="mobile-bookshelf-search-submit">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Search Library</span>
              </button>
              
              {/* Mobile Search Suggestions */}
              {menuOpen && searchQuery.length > 1 && (
                <div className="mobile-suggestions-wrapper">
                  <SearchSuggestions 
                    query={searchQuery} 
                    onSelect={() => setMenuOpen(false)}
                    onClose={() => setMenuOpen(false)}
                  />
                </div>
              )}
            </form>
            
            <div className="mobile-search-tags">
              <span className="mobile-search-tag" onClick={() => { 
                setSearchQuery('Fantasy'); 
                setMenuOpen(false);
                handleSearchSubmit(new Event('submit')); 
              }}>Fantasy</span>
              <span className="mobile-search-tag" onClick={() => { 
                setSearchQuery('Mystery'); 
                setMenuOpen(false);
                handleSearchSubmit(new Event('submit')); 
              }}>Mystery</span>
              <span className="mobile-search-tag" onClick={() => { 
                setSearchQuery('Romance'); 
                setMenuOpen(false);
                handleSearchSubmit(new Event('submit')); 
              }}>Romance</span>
              <span className="mobile-search-tag" onClick={() => { 
                setSearchQuery('Sci-Fi'); 
                setMenuOpen(false);
                handleSearchSubmit(new Event('submit')); 
              }}>Sci-Fi</span>
            </div>
          </div>
          
          <nav className="mobile-nav-menu">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.path} className={`mobile-nav-item ${activeLink === link.path ? 'active' : ''}`}>
                  <Link 
                    to={link.path} 
                    className="mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">{getIcon(link.icon)}</span>
                    <span className="mobile-nav-text">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {!isAuthenticated() && (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="mobile-auth-button login" onClick={() => setMenuOpen(false)}>
                <span className="mobile-auth-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Login</span>
              </Link>
              <Link to="/signup" className="mobile-auth-button signup" onClick={() => setMenuOpen(false)}>
                <span className="mobile-auth-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7V13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 10H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Join BookHive</span>
              </Link>
            </div>
          )}
          
          <div className="mobile-nav-footer">
            <p>© 2023 BookHive. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      <div 
        className={`overlay ${menuOpen ? 'active' : ''}`} 
        onClick={() => {
          setMenuOpen(false);
        }}
      ></div>
    </>
  );
};

export default Navbar; 