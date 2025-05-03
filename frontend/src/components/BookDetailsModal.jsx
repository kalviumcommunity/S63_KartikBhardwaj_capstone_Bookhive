import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './BookDetailsModal.css';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const BookDetailsModal = ({ isOpen, onClose, book, additionalDetails }) => {
  if (!isOpen) return null;

  const { user } = useAuth();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (book) {
      fetchBookDetails();
    }
  }, [book]);

  const fetchBookDetails = async () => {
    try {
      // First fetch reviews if we have a book key
      if (book.key) {
        const reviewsResponse = await axios.get(`http://localhost:5001/api/books/works/${book.key}`);
        if (reviewsResponse.data && reviewsResponse.data.reviews) {
          const formattedReviews = reviewsResponse.data.reviews.map(review => ({
            _id: review._id,
            review: review.text,
            rating: review.rating,
            createdAt: review.createdAt,
            userId: {
              username: review.userName
            }
          }));
          setReviews(formattedReviews);
          
          if (formattedReviews.length > 0) {
            const avg = formattedReviews.reduce((acc, curr) => acc + curr.rating, 0) / formattedReviews.length;
            setAverageRating(avg);
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setLoading(false);
      toast.error('Error loading reviews');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add reviews');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/books/works/${book.key}/review`,
        {
          review,
          rating,
          userId: user.id,
          bookId: book.key
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Format the new review to match our expected structure
      const newReview = {
        _id: response.data._id,
        review: response.data.text,
        rating: response.data.rating,
        createdAt: response.data.createdAt,
        userId: {
          username: response.data.userName
        }
      };
      
      setReviews([...reviews, newReview]);
      setReview('');
      setRating(0);
      toast.success('Review added successfully');
      
      // Update average rating
      const newAvg = (averageRating * reviews.length + rating) / (reviews.length + 1);
      setAverageRating(newAvg);
    } catch (error) {
      console.error('Error adding review:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error adding review');
      }
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <div className="book-info">
            <h2>{book.title}</h2>
            <p className="author">by {book.author}</p>
            {additionalDetails && (
              <div className="book-metadata-summary">
                <p className="publish-info">
                  First published: {additionalDetails.firstPublishYear || 'Unknown'}
                  {additionalDetails.publishers && ` by ${additionalDetails.publishers}`}
                </p>
                <p className="pages-info">
                  {additionalDetails.numberOfPages !== 'Unknown' && `${additionalDetails.numberOfPages} pages`}
                </p>
                {additionalDetails.isbn && <p className="isbn">ISBN: {additionalDetails.isbn}</p>}
              </div>
            )}
          </div>
        </div>

        {additionalDetails && (
          <div className="book-details">
            <div className="book-description">
              <h3>Description</h3>
              <p>{additionalDetails.description}</p>
            </div>

            <div className="book-metadata">
              <div className="metadata-item">
                <h4>Publication Details</h4>
                <p>First Published: {additionalDetails.firstPublishYear || 'Unknown'}</p>
                <p>Publisher: {additionalDetails.publishers}</p>
                <p>Language: {additionalDetails.language}</p>
                {additionalDetails.publishDate && <p>Publish Date: {additionalDetails.publishDate}</p>}
              </div>
              <div className="metadata-item">
                <h4>Book Information</h4>
                {additionalDetails.numberOfPages !== 'Unknown' && (
                  <p>Pages: {additionalDetails.numberOfPages}</p>
                )}
                {additionalDetails.isbn && <p>ISBN: {additionalDetails.isbn}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="reviews-section">
          <h3>Reviews {reviews.length > 0 && `(${reviews.length})`}</h3>
          {user ? (
            <form onSubmit={handleReview} className="review-form">
              <div className="rating-input">
                <label>Your Rating:</label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this book..."
                required
                className="review-input"
              />
              <button type="submit">Submit Review</button>
            </form>
          ) : (
            <p className="login-prompt">
              Please <Link to="/login" state={{ from: window.location.pathname }}>login</Link> to add a review
            </p>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <h4>{review.userId?.username || 'Anonymous'}</h4>
                    <StarRating rating={review.rating || 0} />
                  </div>
                  <p className="review-text">{review.review}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal; 