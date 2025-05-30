import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendAPI } from '../utils/axiosConfig';
import '../styles/AIAssistantWidget.css';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    // Focus the input when opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Redirect to the Book Chat page with the query as a parameter
    navigate(`/book-chat?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleQuickPrompt = (promptText) => {
    navigate(`/book-chat?q=${encodeURIComponent(promptText)}`);
    setIsOpen(false);
  };

  return (
    <div className={`ai-assistant-widget ${isOpen ? 'open' : ''}`}>
      <button 
        className="ai-toggle-button"
        onClick={toggleWidget}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <>
            <span className="ai-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="ai-label">Ask BookHive AI</span>
          </>
        )}
      </button>

      <div className="ai-widget-content">
        <div className="ai-widget-header">
          <h3>BookHive AI Assistant</h3>
          <p>Ask me anything about books or get recommendations!</p>
        </div>

        <form onSubmit={handleSubmit} className="ai-query-form">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about books, authors, genres..."
            className="ai-query-input"
          />
          <button type="submit" className="ai-submit-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div className="quick-prompts">
          <h4>Try asking:</h4>
          <div className="prompt-buttons">
            <button onClick={() => handleQuickPrompt("Recommend books similar to Harry Potter")}>
              Books like Harry Potter
            </button>
            <button onClick={() => handleQuickPrompt("What are some good mystery novels?")}>
              Good mystery novels
            </button>
            <button onClick={() => handleQuickPrompt("Who are the best fantasy authors?")}>
              Best fantasy authors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantWidget;