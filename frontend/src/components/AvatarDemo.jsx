import React, { useState } from 'react';
import BookAvatar from './BookAvatar';
import LoadingPage from './LoadingPage';
import '../styles/AvatarDemo.css';

/**
 * AvatarDemo - A page to demonstrate all avatar implementations
 */
const AvatarDemo = () => {
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedPosition, setSelectedPosition] = useState('center');
  const [customMessage, setCustomMessage] = useState('');
  const [showFacts, setShowFacts] = useState(true);
  
  // Handle showing the loading page
  const handleShowLoadingPage = () => {
    setShowLoadingPage(true);
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
      setShowLoadingPage(false);
    }, 5000);
  };
  
  return (
    <div className="avatar-demo-page">
      <h1 className="demo-title">BookHive Avatar Showcase</h1>
      <p className="demo-description">
        Explore the different ways you can use the BookHive avatar in your application.
      </p>
      
      {/* Configuration Panel */}
      <div className="demo-config-panel">
        <h2>Configure Your Avatar</h2>
        
        <div className="config-row">
          <div className="config-group">
            <label>Size:</label>
            <div className="button-group">
              <button 
                className={selectedSize === 'small' ? 'active' : ''}
                onClick={() => setSelectedSize('small')}
              >
                Small
              </button>
              <button 
                className={selectedSize === 'medium' ? 'active' : ''}
                onClick={() => setSelectedSize('medium')}
              >
                Medium
              </button>
              <button 
                className={selectedSize === 'large' ? 'active' : ''}
                onClick={() => setSelectedSize('large')}
              >
                Large
              </button>
            </div>
          </div>
          
          <div className="config-group">
            <label>Position:</label>
            <div className="button-group">
              <button 
                className={selectedPosition === 'center' ? 'active' : ''}
                onClick={() => setSelectedPosition('center')}
              >
                Center
              </button>
              <button 
                className={selectedPosition === 'corner' ? 'active' : ''}
                onClick={() => setSelectedPosition('corner')}
              >
                Corner
              </button>
              <button 
                className={selectedPosition === 'floating' ? 'active' : ''}
                onClick={() => setSelectedPosition('floating')}
              >
                Floating
              </button>
            </div>
          </div>
        </div>
        
        <div className="config-row">
          <div className="config-group full-width">
            <label>Custom Message:</label>
            <input 
              type="text" 
              value={customMessage} 
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter a custom message for the avatar"
              className="message-input"
            />
          </div>
        </div>
        
        <div className="config-row">
          <div className="config-group">
            <label>Show Book Facts:</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="facts-toggle" 
                checked={showFacts}
                onChange={() => setShowFacts(!showFacts)}
              />
              <label htmlFor="facts-toggle"></label>
            </div>
          </div>
          
          <div className="config-group">
            <button 
              className="demo-button primary"
              onClick={handleShowLoadingPage}
            >
              Show Loading Page
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Area */}
      <div className="demo-preview-area">
        <h2>Preview</h2>
        <div className="preview-container">
          <BookAvatar 
            message={customMessage || undefined}
            showFacts={showFacts}
            size={selectedSize}
            position={selectedPosition}
            interactive={true}
          />
        </div>
      </div>
      
      {/* Usage Examples */}
      <div className="demo-usage-examples">
        <h2>Usage Examples</h2>
        
        <div className="example-cards">
          <div className="example-card">
            <h3>Welcome Guide</h3>
            <p>Use the avatar to guide new users through your application.</p>
            <code>{`<BookAvatar message="Welcome to BookHive!" showFacts={false} />`}</code>
          </div>
          
          <div className="example-card">
            <h3>Loading Indicator</h3>
            <p>Show the avatar during loading states to keep users engaged.</p>
            <code>{`<LoadingPage message="Fetching your books..." />`}</code>
          </div>
          
          <div className="example-card">
            <h3>Help Assistant</h3>
            <p>Add a floating avatar that users can click for help.</p>
            <code>{`<FloatingBookAvatar />`}</code>
          </div>
        </div>
      </div>
      
      {/* Show loading page if enabled */}
      {showLoadingPage && (
        <LoadingPage 
          message="This is a demonstration of the loading page..."
          onComplete={() => setShowLoadingPage(false)}
        />
      )}
    </div>
  );
};

export default AvatarDemo;