import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import BookDetailsModal from './BookDetailsModal';
import '../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL REVIEWS');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
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
                coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/200x300?text=No+Cover',
                largeCoverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
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
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <Navbar />
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  const stats = getRatingStats();

  const getFilteredReviews = () => {
    switch (activeTab) {
      case 'RECENT':
        return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'TOP RATED':
        return [...reviews].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: // ALL REVIEWS
        return reviews;
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

  return (
    <div className="reviews-page">
      <Navbar />
      <div className="reviews-main">
        <div className="reviews-header">
          <h1>{isMyReviews ? 'My Reviews' : 'BookHive Reviews'}</h1>
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'ALL REVIEWS' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL REVIEWS')}
            >
              ALL REVIEWS
            </button>
            <button 
              className={`tab ${activeTab === 'RECENT' ? 'active' : ''}`}
              onClick={() => setActiveTab('RECENT')}
            >
              RECENT
            </button>
            <button 
              className={`tab ${activeTab === 'TOP RATED' ? 'active' : ''}`}
              onClick={() => setActiveTab('TOP RATED')}
            >
              TOP RATED
            </button>
          </div>

          <div className="rating-summary">
            <div className="average-score">
              <h2>{stats.average.toFixed(1)}</h2>
              <StarRating rating={Math.round(stats.average)} />
              <p>{stats.total} reviews</p>
            </div>

            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-row">
                  <div className="rating-label">
                    {rating} star
                  </div>
                  <div className="rating-bar-wrapper">
                    <div 
                      className="rating-bar"
                      style={{ width: `${(stats[rating] / stats.total * 100) || 0}%` }}
                    />
                  </div>
                  <div className="rating-count">
                    {stats[rating]} reviews
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-content">
          {reviews.length === 0 ? (
            <div className="no-reviews">No reviews yet</div>
          ) : (
            <div className="reviews-list">
              {getFilteredReviews().map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="book-info">
                      <div className="review-book-cover">
                        <img
                          src={review.bookDetails.coverUrl}
                          alt={review.bookDetails.title}
                          loading="lazy"
                          onClick={() => handleBookClick(review.bookDetails)}
                          onError={(e) => {
                            e.target.onerror = null;
                            if (e.target.src !== 'https://via.placeholder.com/200x300?text=No+Cover') {
                              e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <div className="book-title-author">
                        <h4 
                          className="book-title"
                          onClick={() => handleBookClick(review.bookDetails)}
                          style={{ cursor: 'pointer' }}
                        >
                          {review.bookDetails.title}
                        </h4>
                        <p className="book-author">by {review.bookDetails.author}</p>
                      </div>
                    </div>
                    <div className="user-info">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId.username}`}
                        alt="User avatar" 
                        className="user-avatar"
                      />
                      <div className="user-details">
                        <h3 className="username">{review.userId.username}</h3>
                        <div className="rating-container">
                          <StarRating rating={review.rating || 0} />
                          <span className="review-for">reviewing</span>
                          <span 
                            className="reviewed-book-name"
                            onClick={() => handleBookClick(review.bookDetails)}
                            style={{ cursor: 'pointer' }}
                          >
                            {review.bookDetails.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="review-text">
                    {review.review}
                  </div>

                  <div className="review-meta">
                    <div className="review-date">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="review-actions">
                      <button className="action-btn">Reply</button>
                      <button className="action-btn">Share</button>
                      <button className="action-btn">Report</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <BookDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          book={selectedBook}
          additionalDetails={bookDetails}
        />
      )}
    </div>
  );
};

export default Reviews; 