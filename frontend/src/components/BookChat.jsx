import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { backendAPI } from '../utils/axiosConfig';
import '../styles/BookChat.css';

const BookChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial welcome message and process query parameter if present
  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm your BookHive assistant. Ask me anything about books, authors, or get recommendations!",
        sender: 'bot'
      }
    ]);
    
    // Check if there's a query parameter
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q');
    
    if (initialQuery) {
      // Process the initial query
      setTimeout(() => {
        handleInitialQuery(initialQuery);
      }, 1000); // Small delay for better UX
    }
  }, [location.search]);
  
  // Handle initial query from URL parameter
  const handleInitialQuery = async (query) => {
    // Add user message to chat
    const userMessage = { text: query, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Send request to AI service
      const response = await backendAPI.post('/api/ai/book-chat', {
        question: query
      });

      // Check if it's a fallback response
      if (response.data.isFallback) {
        console.log("Received fallback response from server");
      }
      
      // Add bot response to chat
      setMessages(prev => [
        ...prev,
        { 
          text: response.data.response, 
          sender: 'bot',
          isFallback: response.data.isFallback
        }
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "I'm sorry, I couldn't process your request. Please try again later.",
          sender: 'bot',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send request to AI service
      const response = await backendAPI.post('/api/ai/book-chat', {
        question: input
      });

      // Check if it's a fallback response
      if (response.data.isFallback) {
        console.log("Received fallback response from server");
      }
      
      // Add bot response to chat
      setMessages(prev => [
        ...prev,
        { 
          text: response.data.response, 
          sender: 'bot',
          isFallback: response.data.isFallback
        }
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "I'm sorry, I couldn't process your request. Please try again later.",
          sender: 'bot',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-chat-container">
      <div className="chat-header">
        <h2>BookHive Assistant</h2>
        <p>Ask me about books, authors, or get recommendations</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender} ${msg.error ? 'error' : ''}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about books or authors..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default BookChat;