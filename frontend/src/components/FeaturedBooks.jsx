import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getFeaturedBooks } from '../services/BookService';
import { handleImageError, PLACEHOLDER_IMAGES } from '../utils/imageUtils';
import '../styles/FeaturedBooks.css';

const FeaturedBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        const featuredBooks = await getFeaturedBooks();
        setBooks(featuredBooks);
      } catch (err) {
        setError('Failed to load featured books');
        console.error('Error loading featured books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  const handleQuickView = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Enhanced image error handling with multiple fallbacks
  const handleBookImageError = (event, book) => {
    const img = event.target;
    
    // Store the current src to avoid infinite loops
    const currentSrc = img.src;
    img.onerror = null; // Prevent infinite loop
    
    console.log(`Image failed to load: ${currentSrc} for book: ${book.title}`);
    
    // Try alternative cover URL if available and not already tried
    if (book.alternativeCoverUrl && currentSrc !== book.alternativeCoverUrl) {
      console.log(`Trying alternative cover: ${book.alternativeCoverUrl}`);
      img.src = book.alternativeCoverUrl;
      img.onerror = (e) => handleBookImageError(e, book);
      return;
    }
    
    // Try different OpenLibrary formats
    const formats = [
      `https://covers.openlibrary.org/b/olid/${book.id}-L.jpg`,
      `https://covers.openlibrary.org/b/olid/${book.id}-M.jpg`,
      `https://covers.openlibrary.org/b/id/${book.id.replace('OL', '').replace('W', '')}-L.jpg`,
      `https://covers.openlibrary.org/w/id/${book.id}-L.jpg`,
      `https://covers.openlibrary.org/b/key/works/${book.id}-L.jpg`
    ];
    
    // Find the next format to try
    const currentIndex = formats.findIndex(format => format === currentSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < formats.length) {
      console.log(`Trying format ${nextIndex + 1}: ${formats[nextIndex]}`);
      img.src = formats[nextIndex];
      img.onerror = (e) => handleBookImageError(e, book);
      return;
    }
    
    // Final fallback to placeholder
    console.log(`Using placeholder for: ${book.title}`);
    img.src = PLACEHOLDER_IMAGES.GENERIC_BOOK;
    img.onerror = null; // Stop trying
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="star-icon filled" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="star-icon half-filled">
          <StarIcon className="star-base" />
          <StarIcon className="star-fill" />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="star-icon empty" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <section className="featured-books-section">
        <div className="featured-books-loading">
          <div className="loading-spinner"></div>
          <p>Discovering amazing books for you...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-books-section">
        <div className="featured-books-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-books-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="featured-books-header"
      >
        <h2 className="featured-books-title">Featured Books</h2>
        <p className="featured-books-subtitle">
          Handpicked selections from our community of readers and literary experts
        </p>
      </motion.div>

      <div className="featured-books-grid">
        <AnimatePresence>
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="featured-book-card"
              onClick={() => handleQuickView(book.id)}
            >
              {/* Book Cover Section */}
              <div className="featured-book-image-wrapper">
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="featured-book-image"
                  loading="lazy"
                  onError={(e) => handleBookImageError(e, book)}
                  onLoad={(e) => {
                    // Add a subtle fade-in effect when image loads
                    e.target.style.opacity = '1';
                  }}
                  style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
                />
                
                {/* Featured Badge */}
                <motion.span 
                  className="featured-badge"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Featured
                </motion.span>
                
                {/* Rating Badge */}
                <div className="featured-rating">
                  <StarIcon className="rating-star" />
                  <span>{book.rating}</span>
                </div>

                {/* Quick View Button - Shows on Hover */}
                <motion.div 
                  className="quick-view-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    className="quick-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickView(book.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EyeIcon className="quick-view-icon" />
                    <span>Quick View</span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Book Information */}
              <div className="featured-book-info">
                <h3 className="featured-book-title">{book.title}</h3>
                <p className="featured-book-author">by {book.authorName}</p>
                
                {/* Genre Tag */}
                <motion.span 
                  className="featured-book-genre"
                  whileHover={{ scale: 1.05 }}
                >
                  {book.genre}
                </motion.span>
                
                {/* Reviews Count */}
                <div className="featured-book-reviews">
                  <span className="reviews-count">{book.reviews} reviews</span>
                </div>
                
                {/* Description */}
                <p className="featured-book-desc">
                  {book.description && book.description.length > 100 
                    ? `${book.description.substring(0, 100)}...` 
                    : book.description || 'Discover this amazing book and dive into its captivating story.'
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedBooks;