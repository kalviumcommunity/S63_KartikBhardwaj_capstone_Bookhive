import React, { useState, useEffect } from 'react';
import '../styles/BookCarousel.css';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Sample Open Library IDs for featured books
  // Books with confirmed working cover images
  const bookData = [
    { id: 'OL7353617M', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', fallbackId: 'OL24420570M' },
    { id: 'OL7288233M', title: 'The Alchemist', author: 'Paulo Coelho', fallbackId: 'OL28257023M' },
    { id: 'OL24262029M', title: '1984', author: 'George Orwell', fallbackId: 'OL28078323M' },
    { id: 'OL7245993M', title: 'Pride and Prejudice', author: 'Jane Austen', fallbackId: 'OL28330189M' },
    { id: 'OL22440379M', title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', fallbackId: 'OL26884472M' },
    { id: 'OL26450126M', title: 'To Kill a Mockingbird', author: 'Harper Lee', fallbackId: 'OL28078324M' },
    { id: 'OL24326610M', title: 'The Hobbit', author: 'J.R.R. Tolkien', fallbackId: 'OL28330190M' },
    { id: 'OL23278107M', title: 'The Catcher in the Rye', author: 'J.D. Salinger', fallbackId: 'OL28257024M' }
  ];

  // Initialize books with high-resolution covers and fallbacks
  useEffect(() => {
    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    };

    const initializeBooks = async () => {
      const booksWithCovers = bookData.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        fallbackId: book.fallbackId,
        coverUrl: `https://covers.openlibrary.org/b/olid/${book.id}-L.jpg`,
        fallbackUrl: `https://covers.openlibrary.org/b/olid/${book.fallbackId}-L.jpg`,
        mediumUrl: `https://covers.openlibrary.org/b/olid/${book.id}-M.jpg`,
        smallUrl: `https://covers.openlibrary.org/b/olid/${book.id}-S.jpg`
      }));
      
      // Preload primary images
      const preloadPromises = booksWithCovers.map(book => 
        preloadImage(book.coverUrl).catch(() => 
          preloadImage(book.mediumUrl).catch(() => 
            preloadImage(book.fallbackUrl).catch(() => null)
          )
        )
      );
      
      // Don't wait for all images to load, just start the process
      Promise.allSettled(preloadPromises);
      
      setBooks(booksWithCovers);
      setIsLoading(false);
    };

    initializeBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="clean-carousel-container">
      <div 
        className={`circular-book-orbit ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated BookHive Logo */}
        <div className="orbit-center">
          <div className="bookhive-logo">BookHive</div>
        </div>

        {/* Rotating Books */}
        {books.map((book, index) => (
          <div
            key={book.id}
            className="orbit-book"
            style={{
              '--book-index': index,
              '--total-books': books.length,
              '--delay': `${index * 0.3}s`
            }}
          >
            <div className="book-container">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="clean-book-cover"
                onError={(e) => {
                  // First fallback: try medium size of same book
                  if (e.target.src === book.coverUrl) {
                    e.target.src = book.mediumUrl;
                  }
                  // Second fallback: try fallback book ID
                  else if (e.target.src === book.mediumUrl) {
                    e.target.src = book.fallbackUrl;
                  }
                  // Third fallback: try medium size of fallback book
                  else if (e.target.src === book.fallbackUrl) {
                    e.target.src = `https://covers.openlibrary.org/b/olid/${book.fallbackId}-M.jpg`;
                  }
                  // Final fallback: placeholder image
                  else {
                    e.target.src = `data:image/svg+xml;charset=UTF-8,%3csvg width='130' height='195' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='130' height='195' fill='%23f3f4f6'/%3e%3crect x='10' y='10' width='110' height='175' fill='%23e5e7eb'/%3e%3ctext x='65' y='100' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='14'%3e${book.title}%3c/text%3e%3c/svg%3e`;
                    e.target.style.objectFit = 'contain';
                  }
                }}
                onLoad={(e) => {
                  // Ensure proper object-fit for actual images
                  if (!e.target.src.startsWith('data:')) {
                    e.target.style.objectFit = 'cover';
                  }
                }}
              />
              <div className="book-info-overlay">
                <h4 className="book-title">{book.title}</h4>
                <p className="book-author">by {book.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;