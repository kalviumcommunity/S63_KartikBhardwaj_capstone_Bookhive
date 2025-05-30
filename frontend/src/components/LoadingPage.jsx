import React, { useState, useEffect } from 'react';
import BookAvatar from './BookAvatar';
import '../styles/LoadingPage.css';

/**
 * LoadingPage - A full-page loading component with the BookAvatar
 * 
 * @param {Object} props
 * @param {string} props.message - Custom loading message
 * @param {number} props.progress - Loading progress (0-100)
 * @param {number} props.minDuration - Minimum duration to show in milliseconds
 * @param {Function} props.onComplete - Callback when loading is complete
 * @returns {JSX.Element}
 */
const LoadingPage = ({ 
  message = "Loading...", 
  progress = 0,
  minDuration = 3000,
  onComplete = () => {}
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [startTime] = useState(Date.now());
  
  // Simulate progress if none is provided
  useEffect(() => {
    if (progress === 0) {
      // Simulate progress from 0 to 100 over minDuration
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, minDuration / 100);
      
      return () => clearInterval(interval);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, minDuration]);
  
  // Ensure minimum duration before completing
  useEffect(() => {
    if (currentProgress >= 100) {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < minDuration) {
        // Wait until minimum duration is reached
        const remainingTime = minDuration - elapsedTime;
        const timer = setTimeout(() => {
          onComplete();
        }, remainingTime);
        
        return () => clearTimeout(timer);
      } else {
        // Minimum duration already passed
        onComplete();
      }
    }
  }, [currentProgress, startTime, minDuration, onComplete]);
  
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="loading-avatar-wrapper">
          <BookAvatar 
            message={message}
            size="large"
            position="center"
            showFacts={true}
          />
        </div>
        
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          <div className="loading-percentage">{currentProgress}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;