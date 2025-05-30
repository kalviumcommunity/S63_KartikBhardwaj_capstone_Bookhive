import { useState } from 'react';

const FloatingBookAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`floating-avatar ${isOpen ? 'open' : ''}`}>
      <div 
        className="avatar-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="book-icon">
          <span className="book-cover"></span>
          <span className="book-page"></span>
          <span className="book-page"></span>
        </div>
      </div>
      
      {isOpen && (
        <div className="avatar-content">
          <h3>Need Help?</h3>
          <p>Ask our BookHive assistant for recommendations or help navigating the site!</p>
          <button className="chat-button">Start Chat</button>
        </div>
      )}
    </div>
  );
};

export default FloatingBookAvatar;