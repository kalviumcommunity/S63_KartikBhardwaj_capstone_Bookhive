import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HumanAvatar from './HumanAvatar';
import '../styles/FloatingBookAvatar.css';

/**
 * FloatingBookAvatar - A helpful assistant that appears when clicked
 * Provides navigation help and book recommendations
 */
const FloatingBookAvatar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  
  // Hide the avatar when clicking outside
  useEffect(() => {
    if (!isVisible) return;
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('.floating-avatar-container') && 
          !e.target.closest('.help-button')) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible]);
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Toggle the avatar visibility
  const toggleAvatar = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setHasBeenShown(true);
      setSelectedOption(null);
      setShowOptions(false);
      
      // Show options after a delay to allow avatar animation to complete
      setTimeout(() => {
        setShowOptions(true);
      }, 1500);
    }
  };
  
  // Handle navigation option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    // Wait a moment before navigating
    setTimeout(() => {
      switch(option) {
        case 'books':
          navigate('/books');
          break;
        case 'authors':
          navigate('/authors');
          break;
        case 'mood':
          navigate('/mood-matcher');
          break;
        case 'profile':
          navigate('/profile');
          break;
        default:
          break;
      }
      setIsVisible(false);
    }, 1500);
  };
  
  return (
    <div className="floating-avatar-wrapper">
      {/* Help button - always visible */}
      <button 
        className={`help-button ${isVisible ? 'active' : ''}`}
        onClick={toggleAvatar}
        aria-label={isVisible ? "Hide help" : "Get help"}
      >
        <span className="help-icon">?</span>
      </button>
      
      {/* The avatar and help options - conditionally visible */}
      {isVisible && (
        <div className="floating-avatar-container">
          <div className="help-header">
            <h3>Your Personal Librarian</h3>
            <button className="close-button" onClick={() => setIsVisible(false)}>×</button>
          </div>
          
          <div className="help-content">
            <div className="avatar-section">
              <HumanAvatar 
                message={selectedOption ? getMessageForOption(selectedOption) : 
                  (hasBeenShown ? "How can I help you today?" : `${getGreeting()}! I'm your BookHive librarian. How can I help you find your next great read?`)}
                size="small"
                showSuggestions={false}
              />
            </div>
            
            {!selectedOption && !showOptions && (
              <div className="loading-options">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Thinking of ways to help you...</p>
              </div>
            )}
            
            {!selectedOption && showOptions && (
              <div className="help-options">
                <p className="help-prompt">How can I assist you today?</p>
                <div className="option-buttons">
                  <button onClick={() => handleOptionSelect('books')}>
                    <span className="option-icon">📚</span>
                    <span>Browse Books</span>
                  </button>
                  <button onClick={() => handleOptionSelect('authors')}>
                    <span className="option-icon">✍️</span>
                    <span>Find Authors</span>
                  </button>
                  <button onClick={() => handleOptionSelect('mood')}>
                    <span className="option-icon">🔍</span>
                    <span>Book Recommendations</span>
                  </button>
                  <button onClick={() => handleOptionSelect('profile')}>
                    <span className="option-icon">👤</span>
                    <span>My Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get messages based on selected option
function getMessageForOption(option) {
  switch(option) {
    case 'books':
      return "Excellent choice! I'm taking you to our curated book collection. We have thousands of titles waiting for you!";
    case 'authors':
      return "Perfect! Let's explore our featured authors. You might discover your next favorite writer!";
    case 'mood':
      return "I love helping with this! I'll find the perfect book to match your current reading mood...";
    case 'profile':
      return "Of course! Taking you to your personal profile where you can see your reading history and reviews...";
    default:
      return "How can I help you today?";
  }
}

export default FloatingBookAvatar;