import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import BookDetailsModal from './BookDetailsModal';
import '../styles/Reviews.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaFilter, 
  FaClock, 
  FaThumbsUp, 
  FaReply, 
  FaShare, 
  FaFlag, 
  FaBook,
  FaUser,
  FaSearch,
  FaSort,
  FaSortAmountUp,
  FaSortAmountDown
} from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL REVIEWS');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMyReviews = location.pathname === '/my-reviews';

  const fetchAllReviews = async () => {
    try {
      // Use different endpoints based on whether we're showing all reviews or user reviews
      const endpoint = isMyReviews 
        ? `http://localhost:5001/api/books/reviews/user`
        : 'http://localhost:5001/api/books/reviews/all';

      const config = isMyReviews && user ? { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } : {};
      const response = await axios.get(endpoint, config);
      const validReviews = response.data.filter(review => 
        review && review.userId && review.review
      );

      const reviewsWithDetails = await Promise.all(
        validReviews.map(async (review) => {
          try {
            const bookKey = review.bookId.startsWith('/') ? review.bookId.slice(1) : review.bookId;
            const bookResponse = await axios.get(`http://localhost:5001/api/books/work/${bookKey}`);
            
            // Extract cover ID from the response
            const coverId = bookResponse.data.cover_i;
            
            return {
              ...review,
              bookDetails: {
                title: bookResponse.data.title,
                author: bookResponse.data.author,
                coverUrl: '/images/book-covers/fiction-book.jpg',
                largeCoverUrl: '/images/book-covers/fiction-book.jpg',
                olid: bookKey
              }
            };
          } catch (error) {
            console.error('Error fetching book details:', error);
            return {
              ...review,
              bookDetails: {
                title: 'Book Title Unavailable',
                author: 'Unknown Author',
                coverUrl: 'https://via.placeholder.com/200x300?text=No+Cover',
                largeCoverUrl: null,
                olid: null
              }
            };
          }
        })
      );

      setReviews(reviewsWithDetails);
    } catch (error) {
      toast.error('Error fetching reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMyReviews && !user) {
      navigate('/login');
      return;
    }
    fetchAllReviews();
  }, [isMyReviews, user]);

  const toggleExpandReview = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const getRatingStats = () => {
    const stats = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
      total: reviews.length,
      average: 0
    };

    reviews.forEach(review => {
      if (review.rating) {
        stats[review.rating]++;
      }
    });

    const totalRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    stats.average = totalRating / stats.total || 0;

    return stats;
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half-filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return <div className="star-rating">{stars}</div>;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <Navbar />
        <div className="loading-container">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading reviews...
          </motion.p>
        </div>
      </div>
    );
  }

  const stats = getRatingStats();

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.bookDetails.title.toLowerCase().includes(term) ||
        review.bookDetails.author.toLowerCase().includes(term) ||
        review.review.toLowerCase().includes(term) ||
        (review.userId.username && review.userId.username.toLowerCase().includes(term))
      );
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'RECENT':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'TOP RATED':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: // ALL REVIEWS
        return filtered;
    }
  };

  const handleBookClick = async (book) => {
    try {
      const bookData = {
        key: book.olid,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        largeCoverUrl: book.largeCoverUrl
      };
      
      setSelectedBook(bookData);
      setIsModalOpen(true);
      
      // Fetch additional book details
      const response = await axios.get(`http://localhost:5001/api/books/external-details?title=${encodeURIComponent(book.title)}`);
      setBookDetails(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Error fetching book details');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setBookDetails(null);
  };

  const filteredReviews = getFilteredReviews();

  return (
    <motion.div 
      className="reviews-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      <motion.div 
        className="reviews-hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="reviews-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isMyReviews ? 'My Reviews' : 'BookHive Community Reviews'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isMyReviews 
              ? 'Track and manage your book reviews' 
              : 'Discover what our community thinks about their recent reads'}
          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        className="reviews-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="reviews-controls"
          variants={itemVariants}
        >
          <div className="search-filter-container">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="tab-container">
              <motion.button 
                className={`tab ${activeTab === 'ALL REVIEWS' ? 'active' : ''}`}
                onClick={() => setActiveTab('ALL REVIEWS')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <FaBook /> All
              </motion.button>
              <motion.button 
                className={`tab ${activeTab === 'RECENT' ? 'active' : ''}`}
                onClick={() => setActiveTab('RECENT')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <FaClock /> Recent
              </motion.button>
              <motion.button 
                className={`tab ${activeTab === 'TOP RATED' ? 'active' : ''}`}
                onClick={() => setActiveTab('TOP RATED')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <FaStar /> Top Rated
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="reviews-dashboard">
          <motion.div 
            className="reviews-stats-card"
            variants={itemVariants}
          >
            <h2 className="stats-title">Rating Summary</h2>
            <div className="rating-summary">
              <div className="average-score">
                <motion.div 
                  className="score-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <h2>{stats.average.toFixed(1)}</h2>
                  <p>out of 5</p>
                </motion.div>
                <StarRating rating={stats.average} />
                <p className="total-reviews">{stats.total} reviews</p>
              </div>

              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                  <motion.div 
                    key={rating} 
                    className="rating-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <div className="rating-label">
                      {rating} <FaStar className="star-icon" />
                    </div>
                    <div className="rating-bar-wrapper">
                      <motion.div 
                        className="rating-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats[rating] / stats.total * 100) || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      />
                    </div>
                    <div className="rating-count">
                      {stats[rating]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="reviews-content"
            variants={itemVariants}
          >
            <div className="reviews-count-sort">
              <p className="reviews-count">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} 
                {searchTerm ? ` matching "${searchTerm}"` : ''}
              </p>
            </div>

            <AnimatePresence>
              {filteredReviews.length === 0 ? (
                <motion.div 
                  className="no-reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FaBook className="no-reviews-icon" />
                  <h3>No reviews found</h3>
                  <p>{searchTerm ? 'Try adjusting your search terms' : 'Be the first to write a review!'}</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="reviews-list"
                  variants={containerVariants}
                >
                  {filteredReviews.map((review, index) => (
                    <motion.div 
                      key={review._id} 
                      className="review-card"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      custom={index}
                      layout
                    >
                      <div className="review-card-header">
                        <div className="review-user-info">
                          <motion.div 
                            className="user-avatar-container"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId.username}`}
                              alt="User avatar" 
                              className="user-avatar"
                            />
                          </motion.div>
                          <div className="user-details">
                            <h3 className="username">{review.userId.username}</h3>
                            <div className="user-meta">
                              <span className="review-date">
                                <FaClock /> {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          <StarRating rating={review.rating || 0} />
                        </div>
                      </div>

                      <div className="review-book-info">
                        <motion.div 
                          className="book-cover-container"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleBookClick(review.bookDetails)}
                        >
                          <img
                            src={review.bookDetails.coverUrl}
                            alt={review.bookDetails.title}
                            loading="lazy"
                            className="book-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              if (e.target.src !== 'https://via.placeholder.com/200x300?text=No+Cover') {
                                e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                              }
                            }}
                          />
                        </motion.div>
                        <div className="book-details">
                          <motion.h4 
                            className="book-title"
                            onClick={() => handleBookClick(review.bookDetails)}
                            whileHover={{ x: 5 }}
                          >
                            {review.bookDetails.title}
                          </motion.h4>
                          <p className="book-author">by {review.bookDetails.author}</p>
                        </div>
                      </div>

                      <div className="review-content">
                        <p className={`review-text ${expandedReviews[review._id] ? 'expanded' : ''}`}>
                          {review.review}
                        </p>
                        {review.review.length > 300 && (
                          <motion.button 
                            className="read-more-btn"
                            onClick={() => toggleExpandReview(review._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {expandedReviews[review._id] ? 'Show less' : 'Read more'}
                          </motion.button>
                        )}
                      </div>

                      <div className="review-actions">
                        <motion.button 
                          className="action-btn like-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaThumbsUp /> Like
                        </motion.button>
                        <motion.button 
                          className="action-btn reply-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaReply /> Reply
                        </motion.button>
                        <motion.button 
                          className="action-btn share-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaShare /> Share
                        </motion.button>
                        <motion.button 
                          className="action-btn report-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaFlag /> Report
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedBook && (
          <BookDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            book={selectedBook}
            additionalDetails={bookDetails}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reviews; 