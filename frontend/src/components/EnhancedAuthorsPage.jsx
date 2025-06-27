import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { fetchAllAuthors } from '../services/AuthorService';
import '../styles/EnhancedAuthorsPage.css';

const EnhancedAuthorsPage = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [followedAuthors, setFollowedAuthors] = useState(new Set());

  const genres = [
    'All',
    'Fiction',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Horror',
    'Historical Fiction',
    'Non-fiction',
    'Biography',
    'Poetry',
    'Magical Realism',
    'Dystopian Fiction',
    'Adventure',
    'Thriller',
    'Contemporary'
  ];

  const authorsPerPage = 12;

  useEffect(() => {
    loadAuthors();
  }, [currentPage, selectedGenre]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const genreFilter = selectedGenre === 'All' ? null : selectedGenre;
      const result = await fetchAllAuthors(currentPage, authorsPerPage, genreFilter);
      
      setAuthors(result.authors);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error loading authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/author/${authorId}`);
  };

  const handleFollowToggle = (authorId) => {
    const newFollowedAuthors = new Set(followedAuthors);
    if (followedAuthors.has(authorId)) {
      newFollowedAuthors.delete(authorId);
    } else {
      newFollowedAuthors.add(authorId);
    }
    setFollowedAuthors(newFollowedAuthors);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatFollowersCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  // Filter authors based on search term
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="pagination-icon" />
        </button>
        
        {startPage > 1 && (
          <>
            <button className="pagination-btn" onClick={() => handlePageChange(1)}>1</button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button className="pagination-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          </>
        )}
        
        <button
          className="pagination-btn nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="pagination-icon" />
        </button>
      </div>
    );
  };

  return (
    <div className="enhanced-authors-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="authors-page-header"
      >
        <div className="container">
          <div className="header-content">
            <motion.button
              className="back-button"
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="back-icon" />
              Back to Home
            </motion.button>
            
            <div className="header-text">
              <h1 className="page-title">Discover Authors</h1>
              <p className="page-subtitle">
                Explore {totalCount} talented authors from around the world
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="filters-section"
      >
        <div className="container">
          <div className="filters-container">
            {/* Search */}
            <div className="search-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search authors..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            {/* Genre Filter */}
            <div className="genre-filter">
              <FunnelIcon className="filter-icon" />
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="genre-select"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Authors Grid */}
      <div className="authors-content">
        <div className="container">
          {loading ? (
            <div className="loading-grid">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="author-card-skeleton">
                  <div className="skeleton-photo"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line subtitle"></div>
                    <div className="skeleton-line description"></div>
                    <div className="skeleton-stats">
                      <div className="skeleton-line stat"></div>
                      <div className="skeleton-line stat"></div>
                    </div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${selectedGenre}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="authors-grid"
                >
                  {filteredAuthors.map((author, index) => (
                    <motion.div
                      key={author.id}
                      className="enhanced-author-card"
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                      }}
                      onClick={() => handleAuthorClick(author.id)}
                    >
                      {/* Author Photo */}
                      <div className="enhanced-author-photo-container">
                        <motion.img
                          src={author.photoUrl}
                          alt={author.name}
                          className="enhanced-author-photo"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=120&background=667eea&color=ffffff&bold=true`;
                          }}
                        />
                        <div className="enhanced-photo-overlay"></div>
                      </div>

                      {/* Author Info */}
                      <div className="enhanced-author-info">
                        <h3 className="enhanced-author-name">{author.name}</h3>
                        <p className="enhanced-author-country">{author.country}</p>
                        <p className="enhanced-author-description">
                          {author.description || author.bio?.substring(0, 100) + '...'}
                        </p>

                        {/* Stats */}
                        <div className="enhanced-author-stats">
                          <div className="enhanced-stat-item">
                            <BookOpenIcon className="enhanced-stat-icon" />
                            <span className="enhanced-stat-value">{author.booksCount}</span>
                            <span className="enhanced-stat-label">Books</span>
                          </div>
                          <div className="enhanced-stat-item">
                            <UserGroupIcon className="enhanced-stat-icon" />
                            <span className="enhanced-stat-value">{formatFollowersCount(author.followersCount)}</span>
                            <span className="enhanced-stat-label">Followers</span>
                          </div>
                        </div>

                        {/* Follow Button */}
                        <motion.button
                          className={`enhanced-follow-btn ${followedAuthors.has(author.id) ? 'following' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowToggle(author.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {followedAuthors.has(author.id) ? 'Following' : 'Follow'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pagination-container"
                >
                  {renderPagination()}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthorsPage;