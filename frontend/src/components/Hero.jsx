import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Real book images from Open Library
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1650033243i/41733839.jpg",
      description: "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
      year: 1925,
      rating: 4.3
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1612238791i/56916837.jpg",
      description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores the irrationality of adult attitudes to race and class in the Deep South of the 1930s.",
      year: 1960,
      rating: 4.5
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      image: "https://miro.medium.com/v2/resize:fit:800/1*g8s4n-puPV3y-F2b7ilJ_A.jpeg",
      description: "Among the seminal texts of the 20th century, 1984 paints the bleak picture of a society in which all information is controlled by the government and independent thought is labeled 'thoughtcrime'.",
      year: 1949,
      rating: 4.2
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      image: "https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_.jpg",
      description: "Since its publication in 1813, Pride and Prejudice has become one of the world's best-loved books. The story of Elizabeth Bennet and her complicated relationship with the proud Mr. Darcy has delighted readers for generations.",
      year: 1813,
      rating: 4.4
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image: "https://m.media-amazon.com/images/M/MV5BMzU0NDY0NDEzNV5BMl5BanBnXkFtZTgwOTIxNDU1MDE@._V1_FMjpg_UX1000_.jpg",
      description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
      year: 1937,
      rating: 4.6
    }
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedBook) {
        setCurrentSlide((prev) => (prev + 1) % books.length);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [books.length, selectedBook]);

  // Calculate position for each slide
  const getSlideStyle = (index) => {
    // Calculate the distance from current slide (0 is current)
    let distance = index - currentSlide;
    
    // Handle wrap-around for proper circular navigation
    if (distance > books.length / 2) distance -= books.length;
    if (distance < -books.length / 2) distance += books.length;
    
    // Calculate position
    const translateX = distance * 60; // Horizontal spacing
    const translateZ = -Math.abs(distance) * 100; // Move non-active books back
    const rotateY = distance * 15; // Rotation for 3D effect
    const opacity = 1 - Math.min(0.6, Math.abs(distance) * 0.15); // Fade out distant books
    const zIndex = 10 - Math.abs(distance);  // Stack order
    const scale = 1 - Math.min(0.3, Math.abs(distance) * 0.1); // Scale down distant books
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % books.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + books.length) % books.length);
  };
  
  // Open book detail modal
  const openBookDetail = (book) => {
    setSelectedBook(book);
  };
  
  // Close book detail modal
  const closeBookDetail = () => {
    setSelectedBook(null);
  };
  
  // Generate star rating
  const renderStarRating = (rating) => {
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
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
    }
    
    return stars;
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Discover Your Next Favorite Read Today!</h1>
        <p>
          Dive into a world of books with honest reviews from fellow readers.
          <br />
          Start your journey to find the perfect book that resonates with you!
        </p>
        <button className="explore-btn" onClick={() => navigate('/books')}>Explore</button>
      </div>
      
      <div className="hero-image">
        <div className="book-carousel">
          <div className="carousel-container">
            {books.map((book, index) => (
              <div 
                key={book.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={getSlideStyle(index)}
                onClick={() => index === currentSlide && openBookDetail(book)}
              >
                <div className="book-cover-wrapper">
                  <img src={book.image} alt={book.title} className="book-cover" />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-nav prev" onClick={goToPrevSlide}>
            &lt;
          </div>
          <div className="carousel-nav next" onClick={goToNextSlide}>
            &gt;
          </div>
          
          <div className="carousel-dots">
            {books.map((_, index) => (
              <div 
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="book-detail-modal" onClick={closeBookDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeBookDetail}>×</button>
            <div className="modal-book-details">
              <div className="modal-book-cover">
                <img src={selectedBook.image} alt={selectedBook.title} />
                <div className="rating-container">
                  <div className="stars">
                    {renderStarRating(selectedBook.rating)}
                  </div>
                  <span className="rating-text">{selectedBook.rating} out of 5</span>
                </div>
              </div>
              <div className="modal-book-info">
                <h2>{selectedBook.title}</h2>
                <h3>by {selectedBook.author}</h3>
                <p className="publish-year">Published: {selectedBook.year}</p>
                <p className="book-description">{selectedBook.description}</p>
                <div className="book-actions">
                  <button className="action-btn primary">Add to Reading List</button>
                  <button className="action-btn secondary">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero; 