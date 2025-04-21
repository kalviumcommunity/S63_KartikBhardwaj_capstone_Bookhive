import React, { useState, useRef } from 'react';
import '../styles/BookCarousel.css';

const BookCarousel = ({ books = [] }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const carouselRef = useRef(null);
  
  // Ensure we always have exactly 10 cards
  const getDisplayBooks = () => {
    if (books.length === 0) {
      return Array(10).fill({
        id: 'default',
        title: 'Sample Book',
        author: 'Sample Author',
        coverUrl: 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
      });
    }
    
    const repeatedBooks = [...books];
    while (repeatedBooks.length < 10) {
      repeatedBooks.push(...books);
    }
    return repeatedBooks.slice(0, 10);
  };

  const displayBooks = getDisplayBooks();

  // Calculate position for each book card
  const getBookStyles = (index) => {
    const totalBooks = 10;
    const angle = (index * (360 / totalBooks)); // Even distribution around the circle
    const radius = 250; // Consistent radius for perfect circle
    
    return {
      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
      zIndex: Math.round(Math.cos((angle * Math.PI) / 180) * 100), // Dynamic z-index based on position
    };
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  return (
    <div className="book-carousel-container">
      <div className="carousel-wrapper">
        <div className="circular-carousel">
          {displayBooks.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              className="carousel-book"
              style={getBookStyles(index)}
              onClick={() => handleBookClick(book)}
            >
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://covers.openlibrary.org/b/id/12003830-L.jpg';
                  }}
                />
              ) : (
                <div className="book-label">
                  <span>{book.title}</span>
                  <span>{book.author}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div className="book-detail-overlay" onClick={closeBookDetails}>
          <div className="book-detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-detail" onClick={closeBookDetails}>×</button>
            <div className="book-detail-content">
              <div className="book-detail-cover">
                <img 
                  src={selectedBook.coverUrl} 
                  alt={selectedBook.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://covers.openlibrary.org/b/id/12003830-L.jpg';
                  }}
                />
              </div>
              <div className="book-detail-info">
                <h3>{selectedBook.title}</h3>
                <p className="author">By {selectedBook.author}</p>
                {selectedBook.description && (
                  <div className="book-description">
                    <p>{selectedBook.description}</p>
                  </div>
                )}
                <div className="action-buttons">
                  <a 
                    href={`https://openlibrary.org/books/${selectedBook.id}`}
                    className="view-more-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Open Library
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCarousel; 