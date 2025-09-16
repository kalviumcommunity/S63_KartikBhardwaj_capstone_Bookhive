import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft,
  FaStar,
  FaRegStar,
  FaUser,
  FaCalendarAlt,
  FaBook,
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { fetchBookDetails, getAuthorDetails, FALLBACK_BOOKS } from '../services/BookService';
import axios from 'axios';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks() || {};
  
  console.log('BookDetails component rendered with workId:', workId);
  console.log('Location state:', location.state);
  
  // Safe toast function
  const safeToast = (message, type = 'info') => {
    try {
      if (toast && typeof toast[type] === 'function') {
        toast[type](message);
      } else {
        console.log(`Toast ${type}:`, message);
      }
    } catch (error) {
      console.log(`Toast ${type}:`, message);
    }
  };
  
  // State management
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Helper function to clean workId
  const getCleanWorkId = (id) => {
    if (!id) return '';
    return id.startsWith('/works/') ? id.replace('/works/', '') : id;
  };

  // Load book details and reviews
  useEffect(() => {
    const loadBookData = async () => {
      if (!workId) {
        setError('No book ID provided');
        setLoading(false);
        return;
      }

      // Clean the workId to ensure it's in the correct format
      const cleanWorkId = getCleanWorkId(workId);
      
      console.log('Loading book data for workId:', cleanWorkId);

      try {
        setLoading(true);
        setError(null);
        
        // Check if we have book data from mood matcher first
        if (location.state && location.state.book && location.state.fromMoodMatcher) {
          console.log('Using book data from mood matcher:', location.state.book);
          const moodBook = location.state.book;
          
          // Enhance the mood book data with proper structure for BookDetails
          const enhancedBookData = {
            ...moodBook,
            id: cleanWorkId,
            workId: cleanWorkId,
            // Ensure we have all required fields
            title: moodBook.title,
            author: moodBook.author,
            authorName: moodBook.author,
            description: moodBook.description || `A captivating ${moodBook.genre || 'book'} that will keep you engaged from start to finish.`,
            coverUrl: moodBook.coverUrl || moodBook.largeCoverUrl,
            largeCoverUrl: moodBook.largeCoverUrl || moodBook.coverUrl,
            publishYear: moodBook.publishYear || moodBook.firstPublishYear,
            firstPublishYear: moodBook.firstPublishYear || moodBook.publishYear,
            rating: moodBook.rating || '4.0',
            genre: moodBook.genre,
            mood: moodBook.mood,
            reason: moodBook.reason,
            subjects: moodBook.subjects || [],
            isbn: moodBook.isbn,
            // Add some additional metadata
            source: 'mood-matcher',
            isMoodRecommendation: true
          };
          
          setBook(enhancedBookData);
          setLoading(false);
          
          // Scroll to reviews if requested
          if (location.state.scrollToReviews) {
            setTimeout(() => {
              const reviewSection = document.querySelector('.bookhive-review-section');
              if (reviewSection) {
                reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 500);
          }
          
          return; // Skip the normal loading process
        }
        
        // First try to use the BookService fetchBookDetails function
        try {
          console.log('Trying BookService fetchBookDetails...');
          const bookDetails = await fetchBookDetails(cleanWorkId);
          
          if (bookDetails && bookDetails.title) {
            console.log('Successfully loaded book details:', bookDetails);
            setBook(bookDetails);
            
            // Try to get author details if available
            if (bookDetails.authorData) {
              setAuthor(bookDetails.authorData);
            }
          } else {
            throw new Error('No book details returned from service');
          }
        } catch (serviceError) {
          console.warn('BookService failed, trying fallback:', serviceError.message);
          
          // Try fallback books
          let bookDetails = null;
          if (FALLBACK_BOOKS && Array.isArray(FALLBACK_BOOKS)) {
            bookDetails = FALLBACK_BOOKS.find(book => 
              book.id === cleanWorkId || 
              book.key === cleanWorkId || 
              book.workId === cleanWorkId
            );
          }
          
          if (bookDetails) {
            // Use fallback book data
            const enhancedBookDetails = {
              ...bookDetails,
              id: cleanWorkId,
              key: cleanWorkId, // Add key for bookmark consistency
              coverUrl: bookDetails.coverUrl || bookDetails.primaryCoverUrl || '/default-book-cover.svg',
              primaryCoverUrl: bookDetails.primaryCoverUrl || bookDetails.coverUrl || '/default-book-cover.svg',
              alternativeCoverUrl: bookDetails.alternativeCoverUrl || '/default-book-cover.svg',
              genres: bookDetails.subjects || (bookDetails.genre ? [bookDetails.genre] : ['Fiction']),
              firstPublishDate: bookDetails.publishYear || 'Unknown',
              description: bookDetails.description || 'No description available for this book.',
              author: bookDetails.author || bookDetails.authorName || 'Unknown Author'
            };
            console.log('Using fallback book data:', enhancedBookDetails);
            setBook(enhancedBookDetails);
          } else {
            // Try direct OpenLibrary API as last resort
            try {
              console.log('Trying direct OpenLibrary API...');
              const bookResponse = await axios.get(`https://openlibrary.org/works/${cleanWorkId}.json`, {
                timeout: 8000
              });
              const bookData = bookResponse.data;
          
              // Get cover image
              const coverId = bookData.covers?.[0];
              const coverUrl = coverId 
                ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                : '/default-book-cover.svg';

              // Get author details (enhanced)
              let authorName = 'Unknown Author';
              let authorData = null;
              if (bookData.authors && bookData.authors.length > 0) {
                try {
                  const authorResponse = await axios.get(`https://openlibrary.org${bookData.authors[0].author.key}.json`, {
                    timeout: 5000
                  });
                  authorName = authorResponse.data.name || 'Unknown Author';
                  authorData = {
                    name: authorResponse.data.name || 'Unknown Author',
                    bio: authorResponse.data.bio?.value || authorResponse.data.bio || 'No biography available.',
                    birthDate: authorResponse.data.birth_date || null,
                    deathDate: authorResponse.data.death_date || null,
                    key: bookData.authors[0].author.key,
                    photoUrl: authorResponse.data.photos?.[0] 
                      ? `https://covers.openlibrary.org/a/id/${authorResponse.data.photos[0]}-M.jpg`
                      : null,
                    wikipediaUrl: authorResponse.data.wikipedia || null,
                    personalName: authorResponse.data.personal_name || authorResponse.data.name
                  };
                  setAuthor(authorData);
                } catch (authorError) {
                  console.warn('Error fetching author, using default:', authorError.message);
                }
              }

              // Get subjects/genres
              const genres = bookData.subjects ? bookData.subjects.slice(0, 5) : ['Fiction'];

              const apiBookDetails = {
                id: cleanWorkId,
                key: cleanWorkId, // Add key for bookmark consistency
                title: bookData.title || 'Unknown Title',
                author: authorName,
                authorData: authorData,
                authorImage: authorData?.photoUrl,
                authorBio: authorData?.bio,
                coverUrl: coverUrl,
                primaryCoverUrl: coverUrl,
                alternativeCoverUrl: `https://covers.openlibrary.org/b/olid/${cleanWorkId}-L.jpg`,
                description: bookData.description?.value || bookData.description || 'No description available for this book.',
                genres: genres,
                firstPublishDate: bookData.first_publish_date || 'Unknown',
                publishYear: bookData.first_publish_date?.split(' ').pop() || 'Unknown',
                subjects: bookData.subjects || [],
                language: 'English',
                openLibraryUrl: `https://openlibrary.org/works/${cleanWorkId}`
              };
              
              console.log('Fetched book data from API:', apiBookDetails);
              setBook(apiBookDetails);
            } catch (apiError) {
              console.warn('OpenLibrary API failed, using generic book:', apiError.message);
              
              // Create a generic book object as absolute fallback
              const genericBookDetails = {
                id: cleanWorkId,
                key: cleanWorkId, // Add key for bookmark consistency
                title: 'Book Details',
                author: 'Unknown Author',
                coverUrl: '/default-book-cover.svg',
                primaryCoverUrl: '/default-book-cover.svg',
                alternativeCoverUrl: '/default-book-cover.svg',
                description: 'This book is available in our collection. Book details are currently being updated.',
                genres: ['Fiction'],
                firstPublishDate: 'Unknown',
                subjects: [],
                language: 'English'
              };
              setBook(genericBookDetails);
            }
          }
        }

        // Fetch reviews from backend (non-blocking)
        try {
          console.log('Fetching reviews from backend...');
          const reviewsResponse = await axios.get(`http://localhost:5001/api/books/works/${cleanWorkId}`, {
            timeout: 5000
          });
          if (reviewsResponse.data) {
            setReviews(reviewsResponse.data.reviews || []);
            setAverageRating(reviewsResponse.data.averageRating || 0);
            console.log('Reviews loaded successfully');
          }
        } catch (reviewError) {
          console.warn('Failed to load reviews (non-critical):', reviewError.message);
          setReviews([]);
          setAverageRating(0);
        }

      } catch (err) {
        console.error('Critical error loading book details:', err);
        
        // Last resort fallback - ensure we always have a book object
        const fallbackBook = {
          id: cleanWorkId,
          key: cleanWorkId, // Add key for bookmark consistency
          title: 'Book Details',
          author: 'Unknown Author',
          coverUrl: '/default-book-cover.svg',
          primaryCoverUrl: '/default-book-cover.svg',
          alternativeCoverUrl: '/default-book-cover.svg',
          description: 'We are currently experiencing technical difficulties loading book details. Please try again later.',
          genres: ['Fiction'],
          firstPublishDate: 'Unknown',
          subjects: [],
          language: 'English'
        };
        
        setBook(fallbackBook);
        setReviews([]);
        setAverageRating(0);
        setError('Unable to load complete book details, but you can still leave a review.');
      } finally {
        setLoading(false);
      }
    };

    // Wrap the entire function in a try-catch to prevent component crashes
    try {
      loadBookData();
    } catch (componentError) {
      console.error('Component error:', componentError);
      setError('Something went wrong loading this page. Please try again.');
      setLoading(false);
      
      // Set minimal fallback data
      const minimalFallback = {
        id: getCleanWorkId(workId),
        key: getCleanWorkId(workId), // Add key for bookmark consistency
        title: 'Book Details',
        author: 'Unknown Author',
        coverUrl: '/default-book-cover.svg',
        primaryCoverUrl: '/default-book-cover.svg',
        alternativeCoverUrl: '/default-book-cover.svg',
        description: 'Unable to load book details.',
        genres: ['Fiction'],
        firstPublishDate: 'Unknown',
        language: 'English'
      };
      setBook(minimalFallback);
    }
  }, [workId]);

  // Handle rating click
  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      safeToast('Please log in to submit a review', 'error');
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      safeToast('Please select a rating', 'error');
      return;
    }

    if (!userReview.trim()) {
      safeToast('Please write a review', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/books/works/${getCleanWorkId(workId)}/review`,
        {
          rating: userRating,
          review: userReview
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add new review to the list
      setReviews(prev => [response.data, ...prev]);
      
      // Recalculate average rating
      const newAverage = (averageRating * reviews.length + userRating) / (reviews.length + 1);
      setAverageRating(newAverage);

      // Reset form
      setUserRating(0);
      setUserReview('');
      
      safeToast('Review submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 400) {
        safeToast(error.response.data.message || 'You have already reviewed this book', 'error');
      } else {
        safeToast('Failed to submit review. Please try again.', 'error');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    try {
      if (!book || (!book.id && !book.key)) {
        safeToast('Unable to bookmark this book', 'error');
        return;
      }
      
      if (!isBookmarked || !addBookmark || !removeBookmark) {
        safeToast('Bookmark feature is not available', 'error');
        return;
      }
      
      // Use book.key for consistency with BookmarkContext, fallback to book.id
      const bookKey = book.key || book.id;
      
      if (isBookmarked(bookKey)) {
        removeBookmark(bookKey);
        safeToast('Bookmark removed', 'success');
      } else {
        // Ensure the book object has a key property for the bookmark context
        const bookToBookmark = {
          ...book,
          key: bookKey
        };
        addBookmark(bookToBookmark);
        safeToast('Book bookmarked', 'success');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      safeToast('Failed to update bookmark', 'error');
    }
  };

  // Handle like toggle
  const handleLikeToggle = () => {
    try {
      setIsLiked(!isLiked);
      safeToast(isLiked ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      console.error('Error toggling like:', error);
      safeToast('Failed to update favorites', 'error');
    }
  };

  // Render star rating
  const renderStarRating = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.button
          key={i}
          type="button"
          className={`star-button ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onStarClick && onStarClick(i)}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          disabled={!interactive}
        >
          {i <= rating ? (
            <FaStar className="star-filled" />
          ) : (
            <FaRegStar className="star-empty" />
          )}
        </motion.button>
      );
    }
    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bookhive-book-detail-loading">
        <motion.div 
          className="bookhive-loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner />
        </motion.div>
        <p>Loading book details...</p>
      </div>
    );
  }

  // Only show error if we have a critical error AND no book data
  if (error && !book) {
    return (
      <div className="bookhive-book-detail-error">
        <h2>Book Not Found</h2>
        <p>{error || 'The requested book could not be found.'}</p>
        <button onClick={() => navigate('/books')} className="bookhive-back-button">
          <FaArrowLeft /> Back to Books
        </button>
      </div>
    );
  }

  // If we don't have book data yet, show loading
  if (!book) {
    return (
      <div className="bookhive-book-detail-loading">
        <motion.div 
          className="bookhive-loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner />
        </motion.div>
        <p>Loading book details...</p>
      </div>
    );
  }

  // Render the main component with error boundary
  try {

  return (
    <div className="bookhive-book-detail-page">
      <div className="bookhive-book-detail-container">
        {/* Header with back button */}
        <motion.div 
          className="bookhive-book-detail-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={() => navigate('/books')} className="bookhive-back-button">
            <FaArrowLeft /> Back to Books
          </button>
          
          <div className="bookhive-book-actions">
            <motion.button
              className={`bookhive-action-button ${isLiked ? 'active' : ''}`}
              onClick={handleLikeToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </motion.button>
            
            <motion.button
              className={`bookhive-action-button ${isBookmarked && book && (book.key || book.id) && isBookmarked(book.key || book.id) ? 'active' : ''}`}
              onClick={handleBookmarkToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isBookmarked && book && (book.key || book.id) && isBookmarked(book.key || book.id) ? <FaBookmark /> : <FaRegBookmark />}
            </motion.button>
          </div>
        </motion.div>

        {/* Warning message for non-critical errors */}
        {error && book && (
          <motion.div 
            className="bookhive-warning-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '12px',
              margin: '10px 0',
              color: '#856404'
            }}
          >
            <p><strong>Note:</strong> {error}</p>
          </motion.div>
        )}

        {/* Book details section - Enhanced Layout */}
        <motion.div 
          className="bookhive-book-detail-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bookhive-book-detail-main-enhanced">
            {/* Left Side - Book Cover */}
            <div className="bookhive-book-cover-section-enhanced">
              <div className="bookhive-book-cover-container">
                <img
                  src={book?.coverUrl || '/default-book-cover.svg'}
                  alt={book?.title || 'Book Cover'}
                  className="bookhive-book-detail-cover-enhanced"
                  onError={(e) => {
                    // Try alternative cover sources
                    if (e.target.src !== '/default-book-cover.svg') {
                      e.target.src = book?.primaryCoverUrl || book?.alternativeCoverUrl || '/default-book-cover.svg';
                    }
                  }}
                />
                
                {/* Book Rating Badge */}
                {averageRating > 0 && (
                  <div className="bookhive-book-rating-badge">
                    <div className="bookhive-rating-stars">
                      {renderStarRating(Math.round(averageRating))}
                    </div>
                    <span className="bookhive-rating-text">
                      {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
              
              {/* Book Actions */}
              <div className="bookhive-book-actions-enhanced">
                <motion.button
                  className={`bookhive-action-btn ${isLiked ? 'active' : ''}`}
                  onClick={handleLikeToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span>Like</span>
                </motion.button>
                
                <motion.button
                  className={`bookhive-action-btn ${isBookmarked(book.id) ? 'active' : ''}`}
                  onClick={handleBookmarkToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isBookmarked(book.id) ? <FaBookmark /> : <FaRegBookmark />}
                  <span>Save</span>
                </motion.button>
              </div>
            </div>

            {/* Center - Book Information */}
            <div className="bookhive-book-info-section-enhanced">
              <div className="bookhive-book-header">
                <h1 className="bookhive-book-detail-title-enhanced">{book.title}</h1>
                <p className="bookhive-book-detail-author-enhanced">by {book.author}</p>
                
                {/* Mood Recommendation Badge */}
                {book.isMoodRecommendation && book.mood && (
                  <div className="bookhive-mood-recommendation-badge">
                    <span className="mood-badge-icon">🎯</span>
                    <span className="mood-badge-text">
                      Recommended for your <strong>{book.mood}</strong> mood
                    </span>
                    {book.reason && (
                      <div className="mood-badge-reason">
                        <em>"{book.reason}"</em>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Book Genres */}
              {book.genres && book.genres.length > 0 && (
                <div className="bookhive-book-genres-enhanced">
                  {book.genres.slice(0, 4).map((genre, index) => (
                    <span key={index} className="bookhive-genre-tag-enhanced">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Book Meta Information */}
              <div className="bookhive-book-meta-enhanced">
                <div className="bookhive-meta-item-enhanced">
                  <FaCalendarAlt className="bookhive-meta-icon" />
                  <span>Published: {book.firstPublishDate}</span>
                </div>
                <div className="bookhive-meta-item-enhanced">
                  <FaBook className="bookhive-meta-icon" />
                  <span>Language: {book.language || 'English'}</span>
                </div>
                {book.subjects && book.subjects.length > 0 && (
                  <div className="bookhive-meta-item-enhanced">
                    <FaUser className="bookhive-meta-icon" />
                    <span>Subjects: {book.subjects.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Book Description */}
              <div className="bookhive-book-description-enhanced">
                <h3>About This Book</h3>
                <p>{book.description}</p>
              </div>

              {/* Additional Book Stats */}
              <div className="bookhive-book-stats">
                <div className="bookhive-stat-item">
                  <FaStar className="bookhive-stat-icon" />
                  <span>{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</span>
                  <small>Rating</small>
                </div>
                <div className="bookhive-stat-item">
                  <FaUsers className="bookhive-stat-icon" />
                  <span>{reviews.length}</span>
                  <small>Reviews</small>
                </div>
                <div className="bookhive-stat-item">
                  <FaBook className="bookhive-stat-icon" />
                  <span>{book.publishYear || 'N/A'}</span>
                  <small>Year</small>
                </div>
              </div>
            </div>

            {/* Right Side - Author Information */}
            <div className="bookhive-author-section-enhanced">
              <div className="bookhive-author-card">
                <div className="bookhive-author-image-container">
                  <img
                    src={book.authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.author)}&size=150&background=667eea&color=fff&bold=true`}
                    alt={book.author}
                    className="bookhive-author-image"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.author)}&size=150&background=667eea&color=fff&bold=true`;
                    }}
                  />
                </div>
                
                <div className="bookhive-author-info">
                  <h4 className="bookhive-author-name">{book.author}</h4>
                  <p className="bookhive-author-title">Author</p>
                  
                  {book.authorBio && (
                    <p className="bookhive-author-bio">{book.authorBio}</p>
                  )}
                  
                  <motion.button
                    className="bookhive-author-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/author/${book.author.replace(/\s+/g, '-').toLowerCase()}`)}
                  >
                    View Author
                  </motion.button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bookhive-quick-actions">
                <motion.button
                  className="bookhive-quick-action-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(book.openLibraryUrl || `https://openlibrary.org/works/${book.id}`, '_blank')}
                >
                  <FaBook />
                  View on OpenLibrary
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating and Review Section */}
        <motion.div 
          className="bookhive-review-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Rate & Review This Book</h2>
          
          {user ? (
            <form onSubmit={handleSubmitReview} className="bookhive-review-form">
              <div className="bookhive-rating-input">
                <label>Your Rating:</label>
                <div className="bookhive-star-rating">
                  {renderStarRating(userRating, true, handleRatingClick)}
                </div>
              </div>

              <div className="bookhive-review-input">
                <label htmlFor="review">Your Review:</label>
                <textarea
                  id="review"
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  className="bookhive-review-textarea"
                />
              </div>

              <motion.button
                type="submit"
                className="bookhive-submit-review-button"
                disabled={submittingReview || userRating === 0 || !userReview.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submittingReview ? (
                  <>
                    <FaSpinner className="spinning" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </motion.button>
            </form>
          ) : (
            <div className="bookhive-login-prompt">
              <p>Please log in to rate and review this book.</p>
              <button 
                onClick={() => navigate('/login')}
                className="bookhive-login-button"
              >
                Log In
              </button>
            </div>
          )}
        </motion.div>

        {/* Reviews Display */}
        <motion.div 
          className="bookhive-reviews-display"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Reviews ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <div className="bookhive-no-reviews">
              <p>No reviews yet. Be the first to review this book!</p>
            </div>
          ) : (
            <div className="bookhive-reviews-list">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    className="bookhive-review-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="bookhive-review-header">
                      <div className="bookhive-reviewer-info">
                        <FaUser className="bookhive-user-icon" />
                        <span className="bookhive-reviewer-name">{review.userName}</span>
                      </div>
                      <div className="bookhive-review-rating">
                        {renderStarRating(review.rating)}
                      </div>
                    </div>
                    
                    <p className="bookhive-review-text">{review.text}</p>
                    
                    <div className="bookhive-review-date">
                      <FaCalendarAlt />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
  
  } catch (renderError) {
    console.error('Error rendering BookDetails component:', renderError);
    return (
      <div className="bookhive-book-detail-error">
        <h2>Something went wrong</h2>
        <p>We encountered an error while loading this page. Please try again.</p>
        <button onClick={() => navigate('/books')} className="bookhive-back-button">
          <FaArrowLeft /> Back to Books
        </button>
        <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
          Refresh Page
        </button>
      </div>
    );
  }
};

export default BookDetails;