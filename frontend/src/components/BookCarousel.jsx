import React, { useState, useEffect, useRef } from 'react';
import '../styles/BookCarousel.css';

const BookCarousel = ({ books = [], autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookOpening, setIsBookOpening] = useState(false);
  const carouselRef = useRef(null);
  
  // Default books in case none are provided
  const defaultBooks = [
    {
      id: 'OL24236961M',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://covers.openlibrary.org/b/id/8432047-L.jpg',
      description: 'A story of wealth, love, and the American Dream in the 1920s.'
    },
    {
      id: 'OL7358913M',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverUrl: 'https://covers.openlibrary.org/b/id/8231286-L.jpg',
      description: 'A classic tale of racial injustice and moral growth in the American South.'
    },
    {
      id: 'OL26515564M',
      title: '1984',
      author: 'George Orwell',
      coverUrl: 'https://covers.openlibrary.org/b/id/8575741-L.jpg',
      description: 'A dystopian novel about totalitarianism, surveillance, and thought control.'
    },
    {
      id: 'OL24721971M',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverUrl: 'https://covers.openlibrary.org/b/id/8409593-L.jpg',
      description: 'A romantic novel of manners in early 19th-century England.'
    },
    {
      id: 'OL25887411M',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      coverUrl: 'https://covers.openlibrary.org/b/id/12003830-L.jpg',
      description: 'The adventure of Bilbo Baggins as he journeys to the Lonely Mountain.'
    }
  ];

  // Use provided books or fallback to default books
  const displayBooks = books.length > 0 ? books : defaultBooks;

  useEffect(() => {
    let timer;
    if (autoPlay && !isHovered && !isPaused && displayBooks.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBooks.length);
      }, interval);
    }
    return () => clearInterval(timer);
  }, [autoPlay, displayBooks, interval, isHovered, isPaused]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBooks.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayBooks.length) % displayBooks.length);
  };

  // Function to calculate the position and styling for each book
  const getBookStyles = (index) => {
    const totalBooks = displayBooks.length;
    
    // Calculate the position in the carousel (distance from current)
    const distance = (index - currentIndex + totalBooks) % totalBooks;
    // Normalize to be between -0.5*totalBooks and 0.5*totalBooks
    const normalizedDistance = distance > totalBooks / 2 
      ? distance - totalBooks 
      : distance;
    
    // Convert to angle (2π would be a full circle)
    const angle = (normalizedDistance / totalBooks) * 2 * Math.PI;
    
    // Calculate radius - adjust this value to change the "size" of the circle
    const radius = 180; 
    
    // Calculate position based on circular arrangement
    const x = Math.sin(angle) * radius;
    const z = 50 - Math.cos(angle) * radius; // Move all books forward in z-space
    
    // Calculate rotation to make books face outward from the circle
    // This gives a more realistic 3D carousel effect
    const rotateY = angle * (180 / Math.PI);
    
    // Calculate scale and opacity based on position
    // Front book is largest and most opaque
    const distanceFactor = Math.abs(normalizedDistance) / (totalBooks / 2);
    const scale = 1 - distanceFactor * 0.3;
    const opacity = 1 - distanceFactor * 0.6;
    const zIndex = Math.round((1 - distanceFactor) * 10);
    
    // Get color for books without covers
    const colorSchemes = [
      '#f97316', // Orange
      '#3b82f6', // Blue  
      '#8b5cf6', // Purple
      '#10b981', // Green
      '#f43f5e', // Pink
      '#facc15'  // Yellow
    ];
    
    const borderColor = colorSchemes[index % colorSchemes.length];
    
    // Return the styles object
    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      borderColor
    };
  };

  const handleBookClick = (index, book) => {
    if (index === currentIndex && !selectedBook) {
      // If clicking the current front book, show details
      setIsBookOpening(true);
      
      // Start the opening animation
      setTimeout(() => {
        setIsPaused(true);
        setSelectedBook(book);
        setIsBookOpening(false);
      }, 500); // Match this with the CSS animation duration
    } else {
      // If clicking any other book, make it the front book
      setCurrentIndex(index);
      setSelectedBook(null);
    }
  };

  const closeBookDetails = () => {
    setIsPaused(false);
    setSelectedBook(null);
  };

  // Generate star rating display
  const renderStarRating = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full-star">★</span>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half-star">★</span>);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
    }
    
    return <div className="star-rating">{stars}</div>;
  };

  return (
    <div 
      className={`book-carousel-container ${isPaused ? 'paused' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isPaused && setIsHovered(false)}
      ref={carouselRef}
    >
      {selectedBook && (
        <div className="book-detail-overlay">
          <div className="book-detail-card">
            <button className="close-detail" onClick={closeBookDetails}>×</button>
            <div className="book-detail-content">
              <div className="book-detail-cover">
                {selectedBook.coverUrl ? (
                  <img src={selectedBook.coverUrl} alt={selectedBook.title} />
                ) : (
                  <div className="no-cover">
                    <span>{selectedBook.title}</span>
                  </div>
                )}
              </div>
              <div className="book-detail-info">
                <h3>{selectedBook.title}</h3>
                <p className="author">By {selectedBook.author}</p>
                
                {renderStarRating(selectedBook.rating)}
                
                {selectedBook.reviewCount && (
                  <p className="review-count">{selectedBook.reviewCount} reviews</p>
                )}
                
                {selectedBook.publishYear && (
                  <p className="publish-year">Published: {selectedBook.publishYear}</p>
                )}
                
                {selectedBook.description && (
                  <div className="book-description">
                    <h4>Description</h4>
                    <p>{selectedBook.description}</p>
                  </div>
                )}
                
                {selectedBook.category && (
                  <span className="category-tag">{selectedBook.category}</span>
                )}
                
                <div className="action-buttons">
                  <a href={`https://openlibrary.org/books/${selectedBook.id}`} 
                     className="view-more-btn" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    View on Open Library
                  </a>
                  <button className="add-to-list-btn">+ Add to Reading List</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`book-carousel circular-carousel ${isPaused ? 'paused' : ''}`}>
        <div className="carousel-perspective" style={{
          animation: !isPaused && !isHovered ? `carouselSpin ${displayBooks.length * 5}s linear infinite` : 'none'
        }}>
          {displayBooks.map((book, index) => {
            const styles = getBookStyles(index);
            const isActive = index === currentIndex;
            const isOpeningClass = isBookOpening && isActive ? 'opening' : '';
            const focusedClass = isPaused && isActive ? 'focused' : '';
            
            return (
              <div 
                key={book.id} 
                className={`carousel-book ${isActive ? 'active' : ''} ${focusedClass} ${isOpeningClass}`}
                style={{
                  transform: styles.transform,
                  opacity: styles.opacity,
                  zIndex: styles.zIndex
                }}
                onClick={() => handleBookClick(index, book)}
              >
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="book-cover" />
                ) : (
                  <div 
                    className="book-label"
                    style={{ borderLeftColor: styles.borderColor }}
                  >
                    <span>{book.title}</span>
                    <span>{book.author}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {!isPaused && (
        <>
          <button className="carousel-nav prev" onClick={goToPrev}>
            &lt;
          </button>
          <button className="carousel-nav next" onClick={goToNext}>
            &gt;
          </button>
          
          <div className="carousel-dots">
            {displayBooks.map((_, index) => (
              <button 
                key={index} 
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookCarousel; 