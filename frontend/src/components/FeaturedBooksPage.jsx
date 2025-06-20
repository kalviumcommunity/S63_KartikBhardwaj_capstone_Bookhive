import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  BookmarkIcon, 
  ChatBubbleLeftIcon,
  StarIcon,
  ArrowLeftIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid, 
  BookmarkIcon as BookmarkIconSolid 
} from '@heroicons/react/24/solid';
import { getFeaturedBooks } from '../services/BookService';
import { handleImageError } from '../utils/imageUtils';
import '../styles/FeaturedBooksPage.css';

const FeaturedBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [savedBooks, setSavedBooks] = useState(new Set());
  const [sortBy, setSortBy] = useState('rating');
  const [filterGenre, setFilterGenre] = useState('all');

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        // Load more books for the dedicated page
        const featuredBooks = await getFeaturedBooks();
        // You could extend this to load more books or different categories
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

  const handleLike = (bookId) => {
    setLikedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleSave = (bookId) => {
    setSavedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const sortedAndFilteredBooks = books
    .filter(book => filterGenre === 'all' || book.genre.toLowerCase().includes(filterGenre.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.authorName.localeCompare(b.authorName);
        case 'year':
          return (b.publishYear || 0) - (a.publishYear || 0);
        default:
          return 0;
      }
    });

  const genres = ['all', ...new Set(books.map(book => book.genre))];

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
      <div className="featured-books-page">
        <div className="featured-books-loading">
          <div className="loading-spinner"></div>
          <p>Loading featured books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-books-page">
        <div className="featured-books-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-books-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="page-header"
      >
        <div className="header-content">
          <motion.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="back-icon" />
            Back
          </motion.button>
          
          <div className="header-text">
            <h1 className="page-title">Featured Books</h1>
            <p className="page-subtitle">
              Discover our complete collection of handpicked literary gems
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="controls-section">
          <div className="filter-controls">
            <div className="control-group">
              <FunnelIcon className="control-icon" />
              <select 
                value={filterGenre} 
                onChange={(e) => setFilterGenre(e.target.value)}
                className="filter-select"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="control-group">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">Sort by Rating</option>
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="year">Sort by Year</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Books Grid */}
      <div className="books-grid-container">
        <div className="books-grid">
          <AnimatePresence>
            {sortedAndFilteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="book-card"
                onClick={() => handleBookClick(book.id)}
              >
                {/* Book Cover Section */}
                <div className="book-image-wrapper">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="book-image"
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'book', book.genre)}
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
                  <div className="rating-badge">
                    <StarIcon className="rating-star" />
                    <span>{book.rating}</span>
                  </div>

                  {/* Hover Overlay with Actions */}
                  <motion.div 
                    className="book-actions-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className={`action-btn like-btn ${likedBooks.has(book.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(book.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {likedBooks.has(book.id) ? 
                        <HeartIconSolid className="action-icon" /> : 
                        <HeartIcon className="action-icon" />
                      }
                    </motion.button>
                    
                    <motion.button
                      className={`action-btn save-btn ${savedBooks.has(book.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(book.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {savedBooks.has(book.id) ? 
                        <BookmarkIconSolid className="action-icon" /> : 
                        <BookmarkIcon className="action-icon" />
                      }
                    </motion.button>
                    
                    <motion.button
                      className="action-btn comment-btn"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChatBubbleLeftIcon className="action-icon" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Book Information */}
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.authorName}</p>
                  
                  {/* Rating and Reviews */}
                  <div className="book-meta">
                    <div className="stars-container">
                      {renderStars(parseFloat(book.rating))}
                      <span className="rating-text">{book.rating}</span>
                    </div>
                    <span className="reviews-count">{book.reviews} reviews</span>
                  </div>
                  
                  {/* Genre Tag */}
                  <motion.span 
                    className="book-genre"
                    whileHover={{ scale: 1.05 }}
                  >
                    {book.genre}
                  </motion.span>
                  
                  {/* Description */}
                  <p className="book-desc">
                    {book.description.length > 100 
                      ? `${book.description.substring(0, 100)}...` 
                      : book.description
                    }
                  </p>

                  {/* Additional Info */}
                  <div className="book-additional-info">
                    <span className="publish-year">Published: {book.publishYear}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sortedAndFilteredBooks.length === 0 && (
          <div className="no-books-message">
            <p>No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedBooksPage;