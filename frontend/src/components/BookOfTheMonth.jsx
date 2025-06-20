import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getBookOfTheMonth } from '../services/BookService';
import '../styles/BookOfTheMonth.css';

const BookOfTheMonth = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchBookOfTheMonth = async () => {
      try {
        setLoading(true);
        const bookData = await getBookOfTheMonth();
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book of the month:', err);
        setError('Failed to load book of the month');
      } finally {
        setLoading(false);
      }
    };

    fetchBookOfTheMonth();
  }, []);

  const handleReadMore = () => {
    if (book) {
      navigate(`/book-of-the-month/${book.id}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically save to backend/localStorage
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

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section className="book-of-the-month-section">
        <div className="book-of-the-month-container">
          <div className="book-of-the-month-loading">
            <div className="loading-spinner"></div>
            <p>Loading Book of the Month...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="book-of-the-month-section">
        <div className="book-of-the-month-container">
          <div className="book-of-the-month-error">
            <h3>Unable to load Book of the Month</h3>
            <p>{error || 'Something went wrong'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="book-of-the-month-section">
      <div className="book-of-the-month-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Book of the Month</h2>
          <p className="section-subtitle">
            Our carefully curated monthly selection that's capturing readers' hearts
          </p>
        </motion.div>

        {/* Book Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="book-of-the-month-card"
        >
          {/* Book of the Month Ribbon */}
          <div className="book-ribbon">
            <span>📚 Featured Pick</span>
          </div>

          <div className="book-card-content">
            {/* Left Column - Book Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="book-cover-column"
            >
              <div className="book-cover-wrapper">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="book-cover-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = book.alternativeCoverUrl || 'https://via.placeholder.com/280x373/f3f4f6/9ca3af?text=No+Cover';
                  }}
                />
                <div className="book-cover-overlay">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="quick-view-btn"
                    onClick={handleReadMore}
                  >
                    <BookOpenIcon className="btn-icon" />
                    <span>Quick View</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Book Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="book-info-column"
            >
              {/* Title and Author */}
              <div className="book-header">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.authorName}</p>
              </div>

              {/* Rating and Reviews */}
              <div className="book-rating">
                <div className="stars-container">
                  {renderStars(parseFloat(book.rating))}
                  <span className="rating-text">{book.rating}</span>
                </div>
                <span className="reviews-count">({book.reviews} reviews)</span>
              </div>

              {/* Genre Badge */}
              <div className="book-genre-badge">
                <span className="genre-text">{book.genre}</span>
              </div>

              {/* Description */}
              <div className="book-description">
                <p>{truncateDescription(book.description, 140)}</p>
              </div>

              {/* Tags */}
              {book.subjects && book.subjects.length > 0 && (
                <div className="book-tags">
                  {book.subjects.slice(0, 3).map((subject, index) => (
                    <span key={index} className="book-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="book-actions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="primary-btn"
                  onClick={handleReadMore}
                >
                  <span>Read More</span>
                  <ArrowRightIcon className="btn-arrow" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`secondary-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="btn-icon" />
                  ) : (
                    <HeartIcon className="btn-icon" />
                  )}
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookOfTheMonth;