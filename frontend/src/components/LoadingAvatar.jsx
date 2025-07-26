import React from 'react';
import '../styles/LoadingAvatar.css';

const LoadingAvatar = ({ progress = 0, message = "Loading..." }) => {
  
  return (
    <div className="loading-avatar-container">
      <div className="loading-progress-bar">
        <div 
          className="loading-progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="avatar-scene">
        {/* Animated book character */}
        <div className="book-character">
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

      </div>
      
      <div className="loading-message">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingAvatar;