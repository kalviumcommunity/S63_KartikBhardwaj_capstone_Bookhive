import React, { useState, useEffect } from 'react';
import '../styles/HumanAvatar.css';

// Array of book suggestions based on interests
const BOOK_SUGGESTIONS = {
  fiction: [
    "Have you tried 'The Night Circus' by Erin Morgenstern?",
    "You might enjoy 'The Midnight Library' by Matt Haig.",
    "'Project Hail Mary' by Andy Weir is a fantastic sci-fi read!"
  ],
  mystery: [
    "'The Silent Patient' by Alex Michaelides is a gripping thriller.",
    "Try 'The Thursday Murder Club' by Richard Osman for a fun mystery.",
    "'Gone Girl' by Gillian Flynn keeps you guessing until the end."
  ],
  romance: [
    "'The Love Hypothesis' by Ali Hazelwood is a delightful romance.",
    "You might enjoy 'People We Meet on Vacation' by Emily Henry.",
    "'Red, White & Royal Blue' by Casey McQuiston is a modern favorite."
  ],
  fantasy: [
    "'The House in the Cerulean Sea' by TJ Klune is magical.",
    "Try 'Piranesi' by Susanna Clarke for something unique.",
    "'The Starless Sea' by Erin Morgenstern will transport you."
  ],
  classics: [
    "Have you read 'Pride and Prejudice' by Jane Austen?",
    "'To Kill a Mockingbird' by Harper Lee is always worth revisiting.",
    "'One Hundred Years of Solitude' by Gabriel García Márquez is a masterpiece."
  ]
};

// Navigation suggestions
const NAVIGATION_SUGGESTIONS = [
  "Would you like to browse our latest book releases?",
  "Can I help you find books by your favorite author?",
  "Looking for book recommendations based on your mood?",
  "Would you like to see your reading history and reviews?",
  "Need help finding a specific book or genre?"
];

/**
 * HumanAvatar component - A friendly librarian character to help users
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display (optional)
 * @param {boolean} props.showSuggestions - Whether to show book suggestions (default: true)
 * @param {string} props.size - Size of the avatar: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.position - Position on the page: 'corner', 'center', 'floating' (default: 'center')
 * @param {boolean} props.interactive - Whether the avatar responds to clicks (default: true)
 * @returns {JSX.Element}
 */
const HumanAvatar = ({ 
  message,
  showSuggestions = true,
  size = 'medium',
  position = 'center',
  interactive = true
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isNodding, setIsNodding] = useState(false);
  const [blinkInterval, setBlinkInterval] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('fiction');
  
  // Set up animation for the avatar
  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      setShowSpeech(true);
      setCurrentMessage(message || "Hello! I'm your BookHive librarian. What are you looking for today?");
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 500);
    
    // Set up random blinking
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    };
    
    const blinkTimer = setInterval(() => {
      // Random blink every 2-6 seconds
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blink, nextBlink);
    }, 6000);
    
    setBlinkInterval(blinkTimer);
    
    // If showing suggestions, rotate through them
    if (showSuggestions) {
      const suggestionInterval = setInterval(() => {
        setShowSpeech(false);
        
        setTimeout(() => {
          // Alternate between navigation suggestions and book suggestions
          const useNavSuggestion = Math.random() > 0.5;
          
          if (useNavSuggestion) {
            const randomNavSuggestion = NAVIGATION_SUGGESTIONS[Math.floor(Math.random() * NAVIGATION_SUGGESTIONS.length)];
            setCurrentMessage(randomNavSuggestion);
          } else {
            // Pick a random category
            const categories = Object.keys(BOOK_SUGGESTIONS);
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            setCurrentCategory(randomCategory);
            
            // Pick a random suggestion from that category
            const suggestions = BOOK_SUGGESTIONS[randomCategory];
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            setCurrentMessage(randomSuggestion);
          }
          
          setShowSpeech(true);
          setIsNodding(true);
          setTimeout(() => setIsNodding(false), 1000);
        }, 500);
      }, 10000);
      
      return () => {
        clearInterval(suggestionInterval);
        clearInterval(blinkTimer);
      };
    }
    
    return () => clearInterval(blinkTimer);
  }, [message, showSuggestions]);
  
  // Handle avatar click
  const handleAvatarClick = () => {
    if (!interactive) return;
    
    // Make the avatar wave
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    
    // Show a random suggestion
    if (showSuggestions) {
      setShowSpeech(false);
      setTimeout(() => {
        // Pick a random category
        const categories = Object.keys(BOOK_SUGGESTIONS);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        setCurrentCategory(randomCategory);
        
        // Pick a random suggestion from that category
        const suggestions = BOOK_SUGGESTIONS[randomCategory];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setCurrentMessage(`Looking for ${randomCategory}? ${randomSuggestion}`);
        setShowSpeech(true);
      }, 500);
    }
  };
  
  // Handle speech bubble click
  const handleSpeechClick = () => {
    if (!interactive) return;
    
    // Make the avatar nod
    setIsNodding(true);
    setTimeout(() => setIsNodding(false), 1000);
    
    // Show a different suggestion
    if (showSuggestions) {
      setShowSpeech(false);
      setTimeout(() => {
        const randomNavSuggestion = NAVIGATION_SUGGESTIONS[Math.floor(Math.random() * NAVIGATION_SUGGESTIONS.length)];
        setCurrentMessage(randomNavSuggestion);
        setShowSpeech(true);
      }, 500);
    }
  };
  
  return (
    <div className={`human-avatar-container ${position} ${size}`}>
      {/* The animated human character */}
      <div 
        className={`human-character ${isWaving ? 'waving' : ''} ${isNodding ? 'nodding' : ''}`}
        onClick={handleAvatarClick}
      >
        {/* Head */}
        <div className="head">
          <div className="face">
            <div className="eyes">
              <div className={`eye left ${isBlinking ? 'blinking' : ''}`}></div>
              <div className={`eye right ${isBlinking ? 'blinking' : ''}`}></div>
            </div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
          <div className="hair"></div>
          <div className="glasses"></div>
        </div>
        
        {/* Body */}
        <div className="body">
          <div className="torso">
            <div className="shirt"></div>
            <div className="badge">BookHive</div>
          </div>
          <div className="arms">
            <div className="arm left"></div>
            <div className="arm right">
              <div className="hand"></div>
            </div>
          </div>
        </div>
        
        {/* Book */}
        <div className="book">
          <div className="book-cover"></div>
          <div className="book-pages"></div>
          <div className="book-title">Books</div>
        </div>
      </div>
      
      {/* Speech bubble with suggestions */}
      {showSpeech && (
        <div 
          className={`speech-bubble ${currentCategory}`}
          onClick={handleSpeechClick}
        >
          <p>{currentMessage}</p>
        </div>
      )}
    </div>
  );
};

export default HumanAvatar;