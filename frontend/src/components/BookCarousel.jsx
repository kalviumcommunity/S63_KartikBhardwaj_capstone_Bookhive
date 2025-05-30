import React, { useState, useRef } from 'react';
import { handleImageError, PLACEHOLDER_IMAGES, FALLBACK_URLS } from '../utils/imageUtils';
import { generateAmazonLink } from '../utils/affiliateLinks';
import '../styles/BookCarousel.css';
import BookCover from './BookCover';

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
        coverUrl: FALLBACK_URLS.DEFAULT_BOOK
      });
    }
    
    // No need to modify coverUrl here, BookCover component handles fallbacks
    return books.slice(0, 10);
  };

  const displayBooks = getDisplayBooks();

  // Calculate position for each book card
  const getBookStyles = (index) => {
    const totalBooks = 10;
    const angle = (index * (360 / totalBooks)); // Even distribution around the circle
    const radius = 300; // Increased radius for larger carousel
    
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
              <BookCover 
                book={{ 
                  imageUrl: book.coverUrl,
                  title: book.title, 
                  author: book.author,
                  alternativeCoverUrl: book.alternativeCoverUrl
                }}
                size="medium"
                className="book-cover-image"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div className="book-detail-overlay" onClick={closeBookDetails}>
          <div className="book-detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-detail" onClick={closeBookDetails}>
              <span aria-hidden="true">×</span>
            </button>
            <div className="book-detail-content">
              <div className="book-detail-cover">
                <BookCover 
                  book={{ 
                    imageUrl: selectedBook.coverUrl,
                    title: selectedBook.title, 
                    author: selectedBook.author,
                    alternativeCoverUrl: selectedBook.alternativeCoverUrl
                  }}
                  size="large"
                  className="book-detail-cover-image"
                />
              </div>
              <div className="book-detail-info">
                <h3>{selectedBook.title}</h3>
                <p className="author">By {selectedBook.author}</p>
                
                {/* Book categories/genres if available */}
                {selectedBook.genres && selectedBook.genres.length > 0 && (
                  <div className="book-categories">
                    {selectedBook.genres.map((genre, index) => (
                      <span key={index} className="category-tag">{genre}</span>
                    ))}
                  </div>
                )}
                
                {/* Book description with fallback text */}
                <div className="book-description">
                  {selectedBook.description ? (
                    <p>{selectedBook.description}</p>
                  ) : (
                    <p>
                      This captivating book by {selectedBook.author} takes readers on an unforgettable journey. 
                      Explore the pages to discover more about this literary work that has captured readers' attention.
                    </p>
                  )}
                  
                  {/* Additional book details if available */}
                  {selectedBook.publishYear && (
                    <p><strong>Published:</strong> {selectedBook.publishYear}</p>
                  )}
                  {selectedBook.pages && (
                    <p><strong>Pages:</strong> {selectedBook.pages}</p>
                  )}
                </div>
                
                {/* Action buttons with icons */}
                <div className="action-buttons">
                  <a 
                    href={`https://openlibrary.org/books/${selectedBook.id}`}
                    className="view-more-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View on Open Library
                  </a>
                  <a 
                    href={generateAmazonLink(selectedBook.title, selectedBook.author)}
                    className="amazon-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Buy on Amazon
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