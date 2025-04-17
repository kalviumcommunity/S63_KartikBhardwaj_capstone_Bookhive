import React, { useEffect } from 'react';
import '../styles/BookModal.css';

const BookModal = ({ book, onClose, onAddToReadingList }) => {
  useEffect(() => {
    console.log('Modal received book data:', book);
    
    // Add keyboard listener for Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent clicks inside modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Generate star rating display
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  if (!book) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-grid">
          <div className="modal-image">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="book-cover-large"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover+Available';
              }}
            />
          </div>
          
          <div className="modal-details">
            <h2>{book.title}</h2>
            <p className="author">By {book.author}</p>
            
            <div className="rating-container">
              <div className="stars">
                {renderStars(parseFloat(book.rating))}
              </div>
              <span className="rating-text">
                {book.rating ? `${parseFloat(book.rating).toFixed(1)} / 5.0` : 'No rating'}
              </span>
            </div>

            <div className="book-metadata">
              <p><strong>Published:</strong> {book.publishYear || 'Unknown'}</p>
              <p><strong>Genre:</strong> {book.genre || 'Not specified'}</p>
              {book.pages && <p><strong>Pages:</strong> {book.pages}</p>}
            </div>

            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description || 'No description available.'}</p>
            </div>

            <div className="modal-actions">
              <button 
                className="action-button primary"
                onClick={() => onAddToReadingList(book)}
              >
                Add to Reading List
              </button>
              <button className="action-button secondary">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal; 