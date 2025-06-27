import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon,
  GlobeAltIcon,
  CheckIcon,
  PlusIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { fetchAuthorDetails } from '../services/AuthorService';
import '../styles/AuthorDetailPage.css';

const AuthorDetailPage = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllBooks, setShowAllBooks] = useState(false);

  useEffect(() => {
    const loadAuthorDetails = async () => {
      if (!authorId) {
        setError('No author ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const authorData = await fetchAuthorDetails(authorId);
        setAuthor(authorData);
      } catch (err) {
        console.error('Error loading author details:', err);
        setError(err.message || 'Failed to load author details');
      } finally {
        setLoading(false);
      }
    };

    loadAuthorDetails();
  }, [authorId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const formatFollowersCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.getFullYear();
    } catch {
      return dateString;
    }
  };

  const visibleBooks = showAllBooks ? author?.topBooks : author?.topBooks?.slice(0, 6);

  if (loading) {
    return (
      <div className="author-detail-page">
        <div className="author-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading author details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="author-detail-page">
        <div className="author-detail-error">
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

  if (!author) {
    return (
      <div className="author-detail-page">
        <div className="author-detail-error">
          <h2>Author Not Found</h2>
          <p>The author you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBack} className="back-btn">
            <ArrowLeftIcon className="btn-icon" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="author-detail-page">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="author-detail-header"
      >
        <motion.button
          className="back-button"
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="back-icon" />
          Back
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="author-detail-content"
      >
        <div className="author-detail-container">
          {/* Author Profile Section */}
          <div className="author-profile-section">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="author-photo-wrapper"
            >
              <img
                src={author.photoUrl}
                alt={author.name}
                className="author-photo-large"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=667eea&color=ffffff&bold=true`;
                }}
              />
              <div className="photo-gradient-overlay"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="author-info-section"
            >
              <h1 className="author-name-large">{author.name}</h1>
              
              {/* Author Meta Info */}
              <div className="author-meta">
                {author.birthDate && (
                  <div className="meta-item">
                    <CalendarIcon className="meta-icon" />
                    <span>Born: {formatDate(author.birthDate)}</span>
                    {author.deathDate && <span> - {formatDate(author.deathDate)}</span>}
                  </div>
                )}
                <div className="meta-item">
                  <GlobeAltIcon className="meta-icon" />
                  <span>{author.nationality || author.country}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="author-stats-large">
                <div className="stat-card">
                  <BookOpenIcon className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{author.booksCount}</span>
                    <span className="stat-label">Books Published</span>
                  </div>
                </div>
                <div className="stat-card">
                  <UserGroupIcon className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{formatFollowersCount(author.followersCount)}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <motion.button
                className={`follow-btn-large ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
                animate={{
                  backgroundColor: isFollowing ? '#10b981' : '#667eea'
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="btn-content"
                  initial={false}
                  animate={{
                    x: isFollowing ? 0 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isFollowing ? (
                    <>
                      <CheckIcon className="btn-icon" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="btn-icon" />
                      <span>Follow Author</span>
                    </>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </div>

          {/* Biography Section */}
          {author.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="biography-section"
            >
              <h3>Biography</h3>
              <p className="biography-text">{author.bio}</p>
            </motion.div>
          )}

          {/* Genre Tags */}
          {author.genres && author.genres.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="genres-section"
            >
              <h4>
                <TagIcon className="section-icon" />
                Genres
              </h4>
              <div className="genres-list">
                {author.genres.map((genre, index) => (
                  <motion.span
                    key={index}
                    className="genre-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Books Section */}
          {author.topBooks && author.topBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="books-section"
            >
              <div className="books-header">
                <h3>Notable Works</h3>
                {author.topBooks.length > 6 && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowAllBooks(!showAllBooks)}
                  >
                    {showAllBooks ? 'Show Less' : `Show All (${author.topBooks.length})`}
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                <div className="books-grid">
                  {visibleBooks?.map((book, index) => (
                    <motion.div
                      key={index}
                      className="book-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -5, 
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                      }}
                    >
                      <div className="book-cover-container">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="book-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150x200/f3f4f6/9ca3af?text=No+Cover';
                          }}
                        />
                        <div className="book-overlay">
                          <a
                            href={book.openLibraryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-book-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowTopRightOnSquareIcon className="btn-icon" />
                            View on OpenLibrary
                          </a>
                        </div>
                      </div>
                      <h4 className="book-title">{book.title}</h4>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthorDetailPage;