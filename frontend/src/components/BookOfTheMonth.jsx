import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, HeartIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getBookOfTheMonth } from '../services/BookService';
import '../styles/BookOfTheMonth.css';

const BookOfTheMonth = () => {
  console.log('🎯 BookOfTheMonth component is rendering...');
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBookDetails, setShowBookDetails] = useState(false);

  useEffect(() => {
    const fetchBookOfTheMonth = async () => {
      try {
        setLoading(true);
        console.log('🚀 Starting to fetch book of the month...');
        const bookData = await getBookOfTheMonth();
        console.log('📚 Book data received:', bookData);
        setBook(bookData);
      } catch (err) {
        console.error('❌ Error fetching book of the month:', err);
        setError('Failed to load book of the month');
      } finally {
        setLoading(false);
      }
    };

    fetchBookOfTheMonth();
  }, []);

  useEffect(() => {
    if (book) {
      const timer = setTimeout(() => {
        setShowBookDetails(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [book]);

  const handleReadMore = () => {
    if (book) {
      navigate(`/book-of-the-month/${book.id}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically save to backend/localStorage
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

  const truncateDescription = (text, maxLength = 180) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section className="book-of-the-month-section">
        <div className="book-of-the-month-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="book-of-the-month-loading"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="loading-spinner"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Loading Book of the Month...
            </motion.p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error || !book) {
    console.log('🚫 Book of the Month not displaying due to error or no book data');
    return null; // Don't render anything if there's an error
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={{ 
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          {/* Book of the Month Ribbon */}
          <motion.div 
            className="book-ribbon"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <span>✨ 📚 Featured Pick</span>
          </motion.div>

          <div className="book-card-content">
            {/* Left Column - Book Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="book-cover-column"
            >
              <motion.div 
                className="book-cover-wrapper"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated glow effect on hover */}
                <motion.div
                  className="book-glow-effect"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.img
                  src={book.coverUrl}
                  alt={book.title}
                  className="book-cover-image"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = book.alternativeCoverUrl || 'https://via.placeholder.com/280x373/f3f4f6/9ca3af?text=No+Cover';
                  }}
                />
                
                <AnimatePresence>
                  <motion.div 
                    className="book-cover-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="quick-view-btn"
                      onClick={handleReadMore}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <BookOpenIcon className="btn-icon" />
                      <span>Quick View</span>
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
                
                {/* Floating stars effect */}
                <div className="floating-stars">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="floating-star"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: isHovered ? [0, 1, 0] : 0,
                        scale: isHovered ? [0, 1, 0] : 0,
                        y: isHovered ? [-20, -40, -60] : 0,
                        x: isHovered ? [0, (i - 1) * 20, (i - 1) * 30] : 0
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        repeatType: "loop"
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Genre Badge - Below Book Image */}
              <motion.div 
                className="book-genre-badge-below"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="genre-text-below">{book.genre}</span>
              </motion.div>
            </motion.div>

            {/* Right Column - Book Information */}
            <AnimatePresence>
              {showBookDetails && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="book-info-column"
                >
                  {/* Title and Author */}
                  <motion.div 
                    className="book-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.h3 
                      className="book-title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      {book.title}
                    </motion.h3>
                    <motion.p 
                      className="book-author"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                    >
                      by {book.authorName}
                    </motion.p>
                  </motion.div>

                  {/* Rating and Reviews */}
                  <motion.div 
                    className="book-rating"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    <div className="stars-container">
                      {renderStars(parseFloat(book.rating))}
                      <motion.span 
                        className="rating-text"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.7, duration: 0.3 }}
                      >
                        {book.rating}
                      </motion.span>
                    </div>
                    <motion.span 
                      className="reviews-count"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8, duration: 0.3 }}
                    >
                      ({book.reviews} reviews)
                    </motion.span>
                  </motion.div>



                  {/* Description */}
                  <motion.div 
                    className="book-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0, duration: 0.5 }}
                  >
                    <p>{truncateDescription(book.description, 180)}</p>
                  </motion.div>

                  {/* Tags */}
                  {book.subjects && book.subjects.length > 0 && (
                    <motion.div 
                      className="book-tags"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.1, duration: 0.5 }}
                    >
                      {book.subjects.slice(0, 3).map((subject, index) => (
                        <motion.span 
                          key={index} 
                          className="book-tag"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2.2 + index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {subject}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div 
                    className="book-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="primary-btn"
                      onClick={handleReadMore}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.6, duration: 0.4 }}
                    >
                      <span>Read More</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRightIcon className="btn-arrow" />
                      </motion.div>
                    </motion.button>

                    <motion.button
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`secondary-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={handleWishlist}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.7, duration: 0.4 }}
                    >
                      <AnimatePresence mode="wait">
                        {isWishlisted ? (
                          <motion.div
                            key="filled"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <HeartIconSolid className="btn-icon" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="outline"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <HeartIcon className="btn-icon" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookOfTheMonth;