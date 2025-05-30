import React, { useState, useEffect } from 'react';
import '../styles/BookAvatar.css';

// Array of interesting book facts and quotes to display
const BOOK_FACTS = [
  "Did you know? The longest book ever published is 'Remembrance of Things Past' by Marcel Proust, with 9,609,000 characters.",
  "The word 'library' comes from the Latin word 'liber', meaning 'book'.",
  "The most expensive book ever sold was Leonardo da Vinci's Codex Leicester, purchased by Bill Gates for $30.8 million.",
  "A single medieval manuscript required the skins of up to 500 animals to create the parchment.",
  "The world's largest library is the Library of Congress with more than 170 million items.",
  "The first printed book in English was 'The Recuyell of the Historyes of Troye' in 1473.",
  "The three most read books in the world are The Holy Bible, Quotations from Chairman Mao, and Harry Potter.",
  "The word 'bookworm' originally referred to insects that feed on books.",
  "'The Lord of the Rings' took J.R.R. Tolkien 12 years to complete.",
  "The first e-book is considered to be the US Declaration of Independence, digitized in 1971.",
  "The average reader can finish a 300-page book in about 5 hours.",
  "The first public library in the US opened in 1790 in Franklin, Massachusetts.",
  "Shakespeare invented over 1,700 words that we still use today.",
  "The first book printed in America was 'The Bay Psalm Book' in 1640.",
  "The world's smallest book is 'Teeny Ted from Turnip Town', measuring just 0.07 mm × 0.10 mm."
];

/**
 * BookAvatar component - A friendly animated book character
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display (optional)
 * @param {boolean} props.showFacts - Whether to show book facts (default: true)
 * @param {string} props.size - Size of the avatar: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.position - Position on the page: 'corner', 'center', 'floating' (default: 'center')
 * @param {boolean} props.interactive - Whether the avatar responds to clicks (default: true)
 * @returns {JSX.Element}
 */
const BookAvatar = ({ 
  message,
  showFacts = true,
  size = 'medium',
  position = 'center',
  interactive = true
}) => {
  const [currentFact, setCurrentFact] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  
  // Set up animation for the avatar
  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      setShowSpeech(true);
      setCurrentFact(message || "Hello! I'm your BookHive assistant!");
    }, 500);
    
    // If showing facts, rotate through them
    if (showFacts) {
      const factInterval = setInterval(() => {
        setShowSpeech(false);
        
        setTimeout(() => {
          const randomFact = BOOK_FACTS[Math.floor(Math.random() * BOOK_FACTS.length)];
          setCurrentFact(randomFact);
          setShowSpeech(true);
        }, 500);
      }, 8000);
      
      return () => clearInterval(factInterval);
    }
  }, [message, showFacts]);
  
  // Handle avatar click
  const handleAvatarClick = () => {
    if (!interactive) return;
    
    // Make the avatar wave
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    
    // Show a random fact only if we're showing facts
    if (showFacts) {
      setShowSpeech(false);
      setTimeout(() => {
        const randomFact = BOOK_FACTS[Math.floor(Math.random() * BOOK_FACTS.length)];
        setCurrentFact(randomFact);
        setShowSpeech(true);
      }, 500);
    }
  };
  
  // Handle speech bubble click
  const handleSpeechClick = () => {
    if (!interactive) return;
    
    // Make the avatar jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
    
    // Show a different fact only if we're showing facts
    if (showFacts) {
      setShowSpeech(false);
      setTimeout(() => {
        const randomFact = BOOK_FACTS[Math.floor(Math.random() * BOOK_FACTS.length)];
        setCurrentFact(randomFact);
        setShowSpeech(true);
      }, 500);
    }
  };
  
  return (
    <div className={`book-avatar-container ${position} ${size}`}>
      {/* The animated book character */}
      <div 
        className={`book-character ${isWaving ? 'waving' : ''} ${isJumping ? 'jumping' : ''}`}
        onClick={handleAvatarClick}
      >
        <div className="book-body">
          <div className="book-cover"></div>
          <div className="book-pages"></div>
          <div className="book-binding"></div>
        </div>
        <div className="character-face">
          <div className="character-eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="character-mouth"></div>
        </div>
        <div className="character-arms">
          <div className="arm left"></div>
          <div className="arm right"></div>
        </div>
        <div className="character-legs">
          <div className="leg left"></div>
          <div className="leg right"></div>
        </div>
      </div>
      
      {/* Speech bubble with facts */}
      {showSpeech && (
        <div 
          className="speech-bubble"
          onClick={handleSpeechClick}
        >
          <p>{currentFact}</p>
        </div>
      )}
    </div>
  );
};

export default BookAvatar;