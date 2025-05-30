import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import '../styles/WriteReview.css';

const WriteReview = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
  });

  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the request ID from the location state if it exists
  const requestId = location.state?.requestId;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.info('Please log in to write a review');
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please log in to write a review'
        } 
      });
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // If bookId starts with 'request-', it's a request ID
        if (bookId && bookId.startsWith('request-')) {
          // Extract the actual request ID
          const actualRequestId = bookId.replace('request-', '');
          
          // Fetch the request details
          const requestResponse = await axios.get(`http://localhost:5001/api/review-requests/${actualRequestId}`);
          const requestData = requestResponse.data;
          
          // Use the book details from the request
          setBook({
            id: requestData.bookId || 'unknown',
            title: requestData.bookTitle,
            author: requestData.bookAuthor,
            coverUrl: requestData.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover',
            requestId: actualRequestId
          });
        } else {
          // Regular book review
          try {
            // First try the local API endpoint
            const response = await axios.get(`http://localhost:5001/api/books/work/${bookId}`);
            const bookData = response.data;
            
            setBook({
              id: bookId,
              title: bookData.title,
              author: bookData.author || 'Unknown Author',
              coverUrl: bookData.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'
            });
          } catch (localApiError) {
            console.error('Error fetching from local API:', localApiError);
            
            // Fallback to OpenLibrary API
            const openLibraryResponse = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
            const openLibraryData = openLibraryResponse.data;
            
            // Get author information if available
            let authorName = 'Unknown Author';
            if (openLibraryData.authors && openLibraryData.authors.length > 0) {
              try {
                const authorKey = openLibraryData.authors[0].author.key;
                const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
                authorName = authorResponse.data.name || 'Unknown Author';
              } catch (authorError) {
                console.error('Error fetching author details:', authorError);
              }
            }
            
            setBook({
              id: bookId,
              title: openLibraryData.title || 'Unknown Title',
              author: authorName,
              coverUrl: openLibraryData.covers && openLibraryData.covers.length > 0
                ? `https://covers.openlibrary.org/b/id/${openLibraryData.covers[0]}-M.jpg`
                : 'https://via.placeholder.com/200x300?text=No+Cover'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Error loading book details. Please try again.');
        setError('Failed to load book details. Please try again or go back to the previous page.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, user, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.review.trim()) {
      toast.error('Please write a review before submitting');
      return;
    }
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      
      console.log('Submitting review for book:', book);
      
      // Submit the review
      await axios.post(
        `http://localhost:5001/api/books/works/${book.id}/review`, 
        {
          rating: formData.rating,
          review: formData.review
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // If this is fulfilling a request, mark it as fulfilled
      if (book.requestId || requestId) {
        const reqId = book.requestId || requestId;
        try {
          await axios.put(
            `http://localhost:5001/api/review-requests/${reqId}/fulfill`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
        } catch (requestError) {
          console.error('Error fulfilling request:', requestError);
          // Continue with the review submission even if request fulfillment fails
        }
      }
      
      // Show thank you animation
      setShowThankYou(true);
      toast.success('Your review has been submitted successfully!');
      
      // Redirect after animation completes
      setTimeout(() => {
        navigate('/my-reviews');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(`Error: ${error.response.data.message || 'Failed to submit review'}`);
      } else {
        toast.error('Error submitting your review. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="write-review-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="write-review-page">
        <Navbar />
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="write-review-page">
        <Navbar />
        <div className="thank-you-container">
          <div className="thank-you-animation">
            <div className="checkmark-circle">
              <div className="checkmark draw"></div>
            </div>
            <h2 className="thank-you-text">Thank You!</h2>
            <p className="thank-you-message">Your review has been submitted successfully.</p>
            <p className="redirect-message">Redirecting to your reviews...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="write-review-page">
        <Navbar />
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>Book Not Found</h2>
          <p>We couldn't find the book you're looking for. Please try again or go back.</p>
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="write-review-page">
      <Navbar />
      <div className="write-review-container">
        <div className="review-header">
          <h1>Write a Review</h1>
          <p>Share your thoughts about this book with the community</p>
        </div>
        
        <div className="book-review-content">
          <div className="book-info-section">
            <div className="book-cover">
              <img 
                src={book.coverUrl} 
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                }}
              />
            </div>
            <div className="book-details">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">by {book.author}</p>
              {book.requestId && (
                <div className="fulfilling-request">
                  <span className="request-badge">Fulfilling Community Request</span>
                </div>
              )}
            </div>
          </div>
          
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="rating-section">
              <h3>Your Rating</h3>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`star ${star <= formData.rating ? 'selected' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="rating-label">
                {formData.rating === 0 && 'Click to rate'}
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </p>
            </div>
            
            <div className="review-text-section">
              <h3>Your Review</h3>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="What did you think about this book? What did you like or dislike? Would you recommend it to others?"
                rows="8"
                required
              ></textarea>
              <div className="review-guidelines">
                <h4>Review Guidelines:</h4>
                <ul>
                  <li>Focus on the book's content and your experience</li>
                  <li>Be respectful and constructive in your criticism</li>
                  <li>Avoid spoilers or use spoiler warnings</li>
                  <li>Your review will be visible to the entire BookHive community</li>
                </ul>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;