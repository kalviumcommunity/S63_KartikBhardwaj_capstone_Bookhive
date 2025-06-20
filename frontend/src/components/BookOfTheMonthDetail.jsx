import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  StarIcon,
  HeartIcon,
  HomeIcon,
  ChevronRightIcon,
  CalendarIcon,
  BookOpenIcon,
  GlobeAltIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { fetchBookDetails } from '../services/BookService';
import '../styles/BookOfTheMonthDetail.css';

const BookOfTheMonthDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const loadBookDetails = async () => {
      if (!bookId) {
        setError('No book ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookData = await fetchBookDetails(bookId);
        
        if (!bookData) {
          throw new Error('Book not found');
        }
        
        setBook(bookData);
      } catch (err) {
        console.error('Error loading book details:', err);
        setError(err.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    loadBookDetails();
  }, [bookId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
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
      <div className="book-detail-page">
        <div className="book-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading Book of the Month details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-detail-page">
        <div className="book-detail-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleBack} className="back-btn">
              <ArrowLeftIcon className="btn-icon" />
              Go Back
            </button>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-page">
        <div className="book-detail-error">
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBack} className="back-btn">
            <ArrowLeftIcon className="btn-icon" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      {/* Header with Breadcrumbs and Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="book-detail-header"
      >
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <motion.button
            onClick={() => navigate('/')}
            className="breadcrumb-item"
            whileHover={{ scale: 1.05 }}
          >
            <HomeIcon className="breadcrumb-icon" />
            <span>Home</span>
          </motion.button>
          <ChevronRightIcon className="breadcrumb-separator" />
          <span className="breadcrumb-item">Book of the Month</span>
          <ChevronRightIcon className="breadcrumb-separator" />
          <span className="breadcrumb-current">{book?.title || 'Book Details'}</span>
        </nav>

        <motion.button
          className="back-button"
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="back-icon" />
          Back to Home
        </motion.button>
      </motion.div>

      {/* Book of the Month Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="book-of-month-badge"
      >
        <span className="badge-text">📚 Book of the Month</span>
        <span className="badge-date">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="book-detail-content"
      >
        <div className="book-detail-container">
          {/* Book Cover Section */}
          <div className="book-cover-section">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="book-cover-wrapper"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="book-cover-large"
                onClick={openImageModal}
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = book.alternativeCoverUrl || 'https://via.placeholder.com/320x427/f3f4f6/9ca3af?text=No+Cover';
                }}
              />
              <div className="book-cover-overlay">
                <span className="featured-badge">Book of the Month</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="book-actions"
            >
              <motion.button
                className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isWishlisted ? <HeartIconSolid className="btn-icon" /> : <HeartIcon className="btn-icon" />}
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Book Information Section */}
          <div className="book-info-section">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Author Only */}
              <div className="book-header">
                <p className="book-author">by {book.authorName}</p>
                
                {/* Rating and Reviews */}
                <div className="book-rating">
                  <div className="stars-container">
                    {renderStars(parseFloat(book.rating))}
                    <span className="rating-text">{book.rating}</span>
                  </div>
                  <span className="reviews-count">({book.reviews} reviews)</span>
                </div>

                {/* Genre Badge */}
                <span className="book-genre">{book.genre}</span>
                
                {/* Meta Information */}
                <div className="book-meta-summary">
                  {book.publishYear && (
                    <div className="meta-item">
                      <CalendarIcon className="meta-icon" />
                      <span>Published: {book.publishYear}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <BookOpenIcon className="meta-icon" />
                    <span>{book.reviews} readers</span>
                  </div>
                  <a 
                    href={`https://openlibrary.org/works/${book.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-item open-library-link"
                  >
                    <GlobeAltIcon className="meta-icon" />
                    <span>View on Open Library</span>
                  </a>
                </div>
              </div>

              {/* About Section */}
              <div className="book-description">
                <h3>📖 About this Book</h3>
                <p>{book.description}</p>
              </div>

              {/* Key Information Cards */}
              <div className="book-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon">📚</div>
                  <div className="highlight-content">
                    <h4>Genre</h4>
                    <p>{book.genre}</p>
                  </div>
                </div>
                
                <div className="highlight-card">
                  <div className="highlight-icon">⭐</div>
                  <div className="highlight-content">
                    <h4>Rating</h4>
                    <p>{book.rating}/5.0 ({book.reviews} reviews)</p>
                  </div>
                </div>
                
                {book.publishYear && (
                  <div className="highlight-card">
                    <div className="highlight-icon">📅</div>
                    <div className="highlight-content">
                      <h4>Published</h4>
                      <p>{book.publishYear}</p>
                    </div>
                  </div>
                )}

                {book.language && (
                  <div className="highlight-card">
                    <div className="highlight-icon">🌐</div>
                    <div className="highlight-content">
                      <h4>Language</h4>
                      <p>{book.language}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subjects/Tags */}
              {book.subjects && book.subjects.length > 0 && (
                <div className="book-subjects">
                  <h4>
                    <TagIcon className="section-icon" />
                    Related Topics
                  </h4>
                  <div className="subjects-list">
                    {book.subjects.slice(0, 10).map((subject, index) => (
                      <span key={index} className="subject-tag">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Why This Month's Pick */}
              <div className="monthly-pick-reason">
                <h4>🌟 Why We Chose This Book</h4>
                <div className="reason-content">
                  <p>
                    This month's selection stands out for its compelling narrative and exceptional reader engagement. 
                    With a {book.rating}-star rating and {book.reviews} reviews, it has captured the attention of our 
                    reading community. The book's exploration of {book.genre.toLowerCase()} themes resonates with 
                    contemporary readers while offering timeless insights that make it a perfect choice for book 
                    club discussions and personal reflection.
                  </p>
                  <div className="reason-highlights">
                    <div className="reason-item">
                      <span className="reason-icon">📈</span>
                      <span>Trending with readers</span>
                    </div>
                    <div className="reason-item">
                      <span className="reason-icon">💬</span>
                      <span>Great for discussions</span>
                    </div>
                    <div className="reason-item">
                      <span className="reason-icon">🎯</span>
                      <span>Highly recommended</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="image-modal-overlay"
          onClick={closeImageModal}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={book.coverUrl} alt={book.title} />
            <button className="modal-close-btn" onClick={closeImageModal}>
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BookOfTheMonthDetail;