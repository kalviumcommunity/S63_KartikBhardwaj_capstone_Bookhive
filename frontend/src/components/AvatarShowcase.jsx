import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookAvatar from './BookAvatar';
import '../styles/AvatarShowcase.css';

/**
 * AvatarShowcase - A component to showcase the BookAvatar on the home page
 */
const AvatarShowcase = () => {
  const [activeSize, setActiveSize] = useState('medium');
  const [activePosition, setActivePosition] = useState('center');
  
  return (
    <div className="avatar-showcase">
      <div className="showcase-header">
        <h2>Meet Booky, Your Reading Companion!</h2>
        <p>Booky helps you discover new books and shares interesting literary facts</p>
      </div>
      
      <div className="showcase-content">
        <div className="showcase-controls">
          <div className="control-group">
            <h3>Size</h3>
            <div className="control-buttons">
              <button 
                className={activeSize === 'small' ? 'active' : ''}
                onClick={() => setActiveSize('small')}
              >
                Small
              </button>
              <button 
                className={activeSize === 'medium' ? 'active' : ''}
                onClick={() => setActiveSize('medium')}
              >
                Medium
              </button>
              <button 
                className={activeSize === 'large' ? 'active' : ''}
                onClick={() => setActiveSize('large')}
              >
                Large
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <h3>Position</h3>
            <div className="control-buttons">
              <button 
                className={activePosition === 'center' ? 'active' : ''}
                onClick={() => setActivePosition('center')}
              >
                Center
              </button>
              <button 
                className={activePosition === 'corner' ? 'active' : ''}
                onClick={() => setActivePosition('corner')}
              >
                Corner
              </button>
              <button 
                className={activePosition === 'floating' ? 'active' : ''}
                onClick={() => setActivePosition('floating')}
              >
                Floating
              </button>
            </div>
          </div>
        </div>
        
        <div className="showcase-preview">
          <div className="preview-container">
            <BookAvatar 
              message="Click me to see a book fact!"
              size={activeSize}
              position={activePosition}
            />
          </div>
        </div>
      </div>
      
      <div className="showcase-footer">
        <Link to="/welcome" className="showcase-button">
          See Full Introduction
        </Link>
      </div>
    </div>
  );
};

export default AvatarShowcase;