import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/BookDetailsPage.css';

const BookDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const containerRef = useRef(null);

  // Get book from location state
  useEffect(() => {
    const bookFromState = location.state?.book;
    if (bookFromState) {
      setBook(bookFromState);
      fetchBookDetails(bookFromState);
      fetchAuthorDetails(bookFromState.author);
      fetchBookReviews(bookFromState.title);
    } else {
      navigate('/books');
    }

    // Page entrance animation
    setTimeout(() => setPageLoaded(true), 100);
  }, [location.state, navigate]);

  const fetchBookDetails = async (bookData) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/books/external-details?title=${encodeURIComponent(bookData.title)}`
      );
      const details = await response.json();
      setBookDetails(details);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setBookDetails({ description: 'No description available.' });
    }
  };

  const fetchAuthorDetails = async (authorName) => {
    try {
      // Try to fetch from Open Library API
      const searchResponse = await fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}&limit=1`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.docs && searchData.docs.length > 0) {
        const authorKey = searchData.docs[0].key;
        
        // Get detailed author info
        const detailResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
        const authorData = await detailResponse.json();
        
        // Set author details with available info
        setAuthorDetails({
          name: authorData.name || authorName,
          bio: authorData.bio?.value || authorData.bio || null,
          birthDate: authorData.birth_date || null,
          photoUrl: authorData.photos && authorData.photos.length > 0 
            ? `https://covers.openlibrary.org/a/id/${authorData.photos[0]}-M.jpg`
            : null
        });
      } else {
        setAuthorDetails({
          name: authorName,
          bio: null,
          birthDate: null,
          photoUrl: null
        });
      }
    } catch (error) {
      console.error('Error fetching author details:', error);
      setAuthorDetails({
        name: authorName,
        bio: null,
        birthDate: null,
        photoUrl: null
      });
    }
  };

  const fetchBookReviews = async (bookTitle) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/reviews/book/${encodeURIComponent(bookTitle)}`
      );
      const reviewsData = await response.json();
      const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
      setReviews(reviewsArray);
      
      // Find user's review if logged in
      if (user && reviewsArray.length > 0) {
        const userReviewData = reviewsArray.find(review => review.userId === user.id);
        setUserReview(userReviewData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check authentication
    console.log('Auth check:', {
      user: user,
      isAuthenticated: isAuthenticated(),
      hasToken: !!localStorage.getItem('token')
    });
    
    if (!user || !isAuthenticated()) {
      alert('Please log in to submit a review');
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }

    // Check if token exists
    let token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // Clean the token (remove any whitespace)
    if (token) {
      token = token.trim();
      if (token !== localStorage.getItem('token')) {
        localStorage.setItem('token', token);
        console.log('Token was cleaned and updated');
      }
    }
    
    console.log('localStorage debug:', {
      token: token,
      tokenLength: token ? token.length : 0,
      savedUser: savedUser,
      tokenType: typeof token,
      tokenStartsWith: token ? token.substring(0, 20) : 'N/A'
    });
    
    if (!token) {
      alert('No authentication token found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      console.log('Submitting review:', {
        bookId: book.key || book.id || book.olid,
        bookTitle: book.title,
        rating: newReview.rating,
        comment: newReview.comment,
        bookAuthor: book.author,
        user: user,
        token: token ? `${token.substring(0, 10)}...` : 'No token'
      });

      // Test token validity first
      console.log('Testing token validity...');
      const testResponse = await fetch('http://localhost:5001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Token test response:', testResponse.status);
      if (!testResponse.ok) {
        try {
          const testError = await testResponse.json();
          console.log('Token test error:', testError);
          alert(`Authentication failed: ${testError.message}. Please log in again.`);
        } catch (e) {
          console.log('Failed to parse error response:', testResponse);
          alert('Authentication failed. Please log in again.');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      } else {
        console.log('Token is valid!');
      }

      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: book.key || book.id || book.olid,
          bookTitle: book.title,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
          bookAuthor: book.author,
          bookCover: book.coverUrl || book.largeCoverUrl
        })
      });

      if (response.ok) {
        const reviewData = await response.json();
        console.log('Review submitted successfully:', reviewData);
        setReviews(prev => [reviewData, ...(Array.isArray(prev) ? prev : [])]);
        setUserReview(reviewData);
        setNewReview({ rating: 5, comment: '' });
        setIsWritingReview(false);
        alert('Review submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          const shouldClearSession = confirm(
            'Authentication failed. Would you like to clear your session and log in again?\n\n' +
            'Click "OK" to clear session and redirect to login\n' +
            'Click "Cancel" to stay on this page'
          );
          
          if (shouldClearSession) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Session cleared. Please log in again.');
            navigate('/login');
          }
        } else {
          alert(errorData.message || 'Error submitting review. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const calculateAverageRating = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => {
              if (interactive && onRatingChange) {
                console.log('Star clicked:', star);
                onRatingChange(star);
              }
            }}
            style={interactive ? { cursor: 'pointer' } : {}}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!book) {
    return (
      <div className="book-details-loading">
        <div className="loading-spinner">📚</div>
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className={`simple-book-page ${pageLoaded ? 'loaded' : ''}`} ref={containerRef}>
      {/* Back Button */}
      <button className="simple-back-btn" onClick={handleGoBack}>
        <span className="back-arrow">←</span>
        <span>Back</span>
      </button>

      {/* Main Container */}
      <div className="simple-book-container">
        {/* Book Info Section */}
        <section className="simple-book-info">
          <div className="simple-book-cover">
            <img
              src={book.largeCoverUrl || book.coverUrl || '/default-book-cover.svg'}
              alt={book.title}
              className="simple-cover-image"
              onError={(e) => {
                e.target.src = '/default-book-cover.svg';
              }}
            />
          </div>

          <div className="simple-book-details">
            <h1 className="simple-title">{book.title}</h1>
            <p className="simple-author">by {book.author}</p>
            
            {book.firstPublishYear && (
              <p className="simple-year">Published in {book.firstPublishYear}</p>
            )}

            <div className="simple-rating">
              <div className="rating-display">
                {renderStars(Math.round(calculateAverageRating()))}
                <span className="rating-text">
                  {calculateAverageRating()}/5 ({Array.isArray(reviews) ? reviews.length : 0} reviews)
                </span>
              </div>
            </div>

            {bookDetails?.description && (
              <div className="simple-description">
                <h3>About this book</h3>
                <div className={`description-content ${showFullDescription ? 'expanded' : ''}`}>
                  <p>{bookDetails.description}</p>
                </div>
                {bookDetails.description.length > 500 && (
                  <button 
                    className="read-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Author Section */}
        <section className="simple-author-section">
          <h2>About the Author</h2>
          <div className="simple-author-info">
            <div className="simple-author-image">
              {authorDetails?.photoUrl ? (
                <img
                  src={authorDetails.photoUrl}
                  alt={book.author}
                  className="author-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`author-photo-placeholder ${!authorDetails?.photoUrl ? 'show' : ''}`}
                style={{ display: authorDetails?.photoUrl ? 'none' : 'flex' }}
              >
                <span className="author-initials">
                  {book.author.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="simple-author-details">
              <h3>{book.author}</h3>
              {authorDetails?.bio ? (
                <p>{authorDetails.bio}</p>
              ) : (
                <p>Information about this author is not available at the moment.</p>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="simple-reviews-section">
          <div className="reviews-title">
            <h2>📚 BookHive Community Reviews</h2>
            <span className="reviews-count">{Array.isArray(reviews) ? reviews.length : 0} reviews</span>
          </div>

          {/* Write Review Button/Form */}
          {user ? (
            !userReview ? (
              !isWritingReview ? (
                <button 
                  className="simple-write-review-btn"
                  onClick={() => setIsWritingReview(true)}
                >
                  ✏️ Write a Review
                </button>
              ) : (
                <div className="simple-review-form">
                  <h4>Write Your Review</h4>
                  <form onSubmit={handleSubmitReview}>
                    <div className="simple-rating-input">
                      <label>Your Rating:</label>
                      <div className="rating-stars">
                        {renderStars(newReview.rating, true, (rating) => 
                          setNewReview(prev => ({...prev, rating}))
                        )}
                      </div>
                    </div>
                    
                    <div className="simple-comment-input">
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                        placeholder="Share your thoughts about this book..."
                        required
                      />
                    </div>

                    <div className="simple-form-buttons">
                      <button type="button" onClick={() => setIsWritingReview(false)} className="cancel-btn">
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn">
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="user-has-reviewed-note">
                <p>✅ You have already reviewed this book. Your review appears below with other community reviews.</p>
              </div>
            )
          ) : (
            <div className="login-prompt">
              <p>Please <button onClick={() => navigate('/login')} className="login-link">login</button> to write a review</p>
            </div>
          )}

          {/* Community Reviews List */}
          <div className="community-reviews-section">
            <div className="simple-reviews-list">
              {loading ? (
                <div className="simple-loading">
                  <div className="loading-icon">💭</div>
                  <p>Loading reviews...</p>
                </div>
              ) : (!Array.isArray(reviews) || reviews.length === 0) ? (
                <div className="no-reviews-msg">
                  <div className="empty-icon">📝</div>
                  <h4>No Reviews Yet</h4>
                  <p>Be the first to share your thoughts about this book with the BookHive community!</p>
                </div>
              ) : (
                <>
                  {/* Show all reviews including user's review if it exists */}
                  {(Array.isArray(reviews) ? reviews : [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                    .map((review, index) => (
                  <div 
                    key={review.id || index} 
                    className={`simple-review-card ${user && review.userId === user.id ? 'user-own-review-card' : ''}`}
                  >
                    <div className="review-top">
                      <div className="reviewer-info">
                        <img 
                          src={review.userAvatar || '/default-avatar.png'} 
                          alt={review.username}
                        />
                        <div>
                          <div className="reviewer-name-container">
                            <span className="reviewer-name">{review.username}</span>
                            {user && review.userId === user.id && (
                              <span className="your-review-badge">Your Review</span>
                            )}
                          </div>
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookDetailsPage;