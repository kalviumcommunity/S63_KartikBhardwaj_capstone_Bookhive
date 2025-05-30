import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookAvatar from './BookAvatar';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Introduction steps
  const introSteps = [
    {
      title: "Welcome to BookHive!",
      message: "Hi there! I'm Booky, your friendly guide to the world of literature!",
      delay: 1000
    },
    {
      title: "Discover Amazing Books",
      message: "I can help you find your next favorite book based on your interests and reading mood.",
      delay: 5000
    },
    {
      title: "Connect with Fellow Readers",
      message: "Share your thoughts on books, write reviews, and see what others are reading!",
      delay: 9000
    },
    {
      title: "Ready to Explore?",
      message: "Let's dive into the wonderful world of books together!",
      delay: 13000
    }
  ];
  
  // Show content with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Progress through intro steps
  useEffect(() => {
    if (currentStep < introSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, introSteps[currentStep].delay);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);
  
  // Handle get started button click
  const handleGetStarted = () => {
    navigate('/books');
  };
  
  // Handle explore button click
  const handleExplore = () => {
    navigate('/');
  };
  
  return (
    <div className="welcome-page">
      <div className={`welcome-content ${showContent ? 'visible' : ''}`}>
        <div className="welcome-header">
          <h1 className="welcome-title">{introSteps[currentStep].title}</h1>
        </div>
        
        <div className="welcome-avatar-container">
          <BookAvatar 
            message={introSteps[currentStep].message}
            showFacts={false}
            size="large"
            position="center"
            interactive={true}
          />
        </div>
        
        <div className="welcome-actions">
          <button 
            className="welcome-button primary"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
          <button 
            className="welcome-button secondary"
            onClick={handleExplore}
          >
            Explore Books
          </button>
        </div>
        
        <div className="welcome-steps">
          {introSteps.map((_, index) => (
            <div 
              key={index} 
              className={`step-indicator ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;