import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaSpinner,
  FaBook,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { searchBooksAdvanced, getBooksByGenre, getTrendingBooks, getAllBooks, getPopularTrendingBooks } from '../services/BookService';
import '../styles/Books.css';

const Books = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Refs
  const searchInputRef = useRef(null);
  const booksGridRef = useRef(null);
  
  // Available genres
  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'science_fiction', label: 'Science Fiction' },
    { value: 'horror', label: 'Horror' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'self_help', label: 'Self Help' },
    { value: 'business', label: 'Business' },
    { value: 'philosophy', label: 'Philosophy' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'author', label: 'Author A-Z' }
  ];

  // Load books based on current filters
  const loadBooks = async (page = 1) => {
    setLoading(true);
    try {
      let result;
      
      if (searchQuery.trim()) {
        // Search books
        result = await searchBooksAdvanced({
          query: searchQuery,
          genre: selectedGenre !== 'all' ? selectedGenre : null,
          sortBy,
          page,
          limit: 20
        });
      } else if (selectedGenre !== 'all') {
        // Get books by genre
        result = await getBooksByGenre(selectedGenre, page, 24, sortBy);
      } else {
        // Get popular trending books for main view
        result = await getPopularTrendingBooks(page, 48, sortBy);
      }
      
      if (result && result.books) {
        setBooks(result.books);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(page);
      } else {
        setBooks([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL params
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedGenre !== 'all') params.set('genre', selectedGenre);
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  };

  // Effects
  useEffect(() => {
    loadBooks(1);
  }, [searchQuery, selectedGenre, sortBy]);

  useEffect(() => {
    updateURLParams();
  }, [searchQuery, selectedGenre, sortBy, currentPage]);

  // Event handlers
  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(1);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleBookClick = (book) => {
    // Clean the book ID to ensure proper navigation
    let bookId = book.id || book.key || book.workId || '';
    
    // Remove '/works/' prefix if present
    if (bookId.startsWith('/works/')) {
      bookId = bookId.replace('/works/', '');
    }
    
    // Ensure we have a valid book ID
    if (!bookId) {
      toast.error('Unable to open book details');
      return;
    }
    
    console.log('Book clicked:', book);
    console.log('Navigating to book ID:', bookId);
    
    // Navigate to the book detail route
    navigate(`/book/${bookId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadBooks(page);
    if (booksGridRef.current) {
      booksGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getBookCoverUrl = (book) => {
    // Try multiple cover URL formats for better image loading
    if (book.coverUrl && book.coverUrl !== '/default-book-cover.svg') return book.coverUrl;
    if (book.primaryCoverUrl) return book.primaryCoverUrl;
    if (book.alternativeCoverUrl) return book.alternativeCoverUrl;
    
    // Try OpenLibrary cover formats with multiple strategies
    const bookId = book.id || book.key || book.workId || '';
    if (bookId) {
      // Clean the ID and try different formats
      const cleanId = bookId.replace(/[^\w]/g, '');
      
      // Try work ID format first (most reliable)
      if (bookId.startsWith('OL') && bookId.endsWith('W')) {
        return `https://covers.openlibrary.org/b/olid/${bookId}-L.jpg`;
      }
      
      // Try numeric ID format
      const numericId = bookId.replace(/[^\d]/g, '');
      if (numericId) {
        return `https://covers.openlibrary.org/b/id/${numericId}-L.jpg`;
      }
      
      // Try ISBN if available
      if (book.isbn) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
      }
    }
    
    // Generate a placeholder based on title and author
    if (book.title && book.author) {
      const title = encodeURIComponent(book.title.substring(0, 20));
      const author = encodeURIComponent(book.author.substring(0, 15));
      return `https://ui-avatars.com/api/?name=${title}&size=300&background=667eea&color=fff&bold=true&format=png`;
    }
    
    return '/default-book-cover.svg';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="books-pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  return (
    <div className="bookhive-books-page">
      <div className="bookhive-books-container">
        {/* Header */}
        <div className="bookhive-books-header">
          <motion.h1 
            className="bookhive-books-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HiOutlineSparkles className="title-icon" />
            Discover Amazing Books
          </motion.h1>
          <motion.p 
            className="bookhive-books-subtitle"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our vast collection of books from every genre imaginable
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          className="bookhive-books-controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="bookhive-search-section">
            <div className="bookhive-search-input-container">
              <FaSearch className="bookhive-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bookhive-search-input"
              />
            </div>
            <button type="submit" className="bookhive-search-button">
              <FaSearch />
              Search
            </button>
          </form>

          <div className="bookhive-filters-section">
            <div className="bookhive-filter-group">
              <label className="bookhive-filter-label">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="bookhive-filter-select"
              >
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bookhive-filter-group">
              <label className="bookhive-filter-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bookhive-filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div ref={booksGridRef}>
          {loading ? (
            <div className="bookhive-books-loading">
              <motion.div 
                className="bookhive-loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FaSpinner />
              </motion.div>
              <p>Discovering amazing books for you...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="bookhive-books-empty">
              <h3>No books found</h3>
              <p>Try adjusting your search criteria or browse different genres.</p>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="bookhive-books-results-info">
                <p>Found {books.length} amazing books</p>
                <p>Page {currentPage} of {totalPages}</p>
              </div>

              {/* Books Grid */}
              <AnimatePresence>
                <div className="bookhive-books-grid">
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id || book.key || index}
                      className="bookhive-book-card"
                      onClick={() => handleBookClick(book)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {/* Rating Badge */}
                      {book.rating && (
                        <motion.div 
                          className="bookhive-book-rating-badge"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaStar className="bookhive-rating-star" />
                          {book.rating.toFixed(1)}
                        </motion.div>
                      )}

                      {/* Book Cover - Large and Prominent */}
                      <div className="bookhive-book-cover-container">
                        <img
                          src={getBookCoverUrl(book)}
                          alt={book.title}
                          className="bookhive-book-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Try alternative sources before falling back to default
                            if (e.target.src !== '/default-book-cover.svg') {
                              if (book.alternativeCoverUrl && e.target.src !== book.alternativeCoverUrl) {
                                e.target.src = book.alternativeCoverUrl;
                              } else if (book.primaryCoverUrl && e.target.src !== book.primaryCoverUrl) {
                                e.target.src = book.primaryCoverUrl;
                              } else {
                                // Generate a nice placeholder with book info
                                const title = encodeURIComponent(book.title.substring(0, 15));
                                e.target.src = `https://ui-avatars.com/api/?name=${title}&size=300&background=667eea&color=fff&bold=true&format=png`;
                              }
                            }
                          }}
                        />
                        
                        {/* Loading overlay */}
                        <div className="bookhive-book-cover-overlay">
                          <motion.div
                            className="bookhive-book-overlay-content"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaBook className="bookhive-overlay-icon" />
                            <span>View Details</span>
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Book Info */}
                      <div className="bookhive-book-info">
                        <h3 className="bookhive-book-title">
                          {book.title.length > 45 ? `${book.title.substring(0, 45)}...` : book.title}
                        </h3>
                        <p className="bookhive-book-author">
                          by {book.author || book.authorName || 'Unknown Author'}
                        </p>
                        
                        {/* Book Meta Info */}
                        <div className="bookhive-book-meta">
                          {book.publishYear && (
                            <span className="bookhive-book-year">
                              <FaCalendarAlt className="meta-icon" />
                              {book.publishYear}
                            </span>
                          )}
                          
                          {book.reviews && (
                            <span className="bookhive-book-reviews">
                              <FaUsers className="meta-icon" />
                              {book.reviews} reviews
                            </span>
                          )}
                        </div>
                        
                        {/* Genre Badge */}
                        {book.genre && (
                          <motion.span 
                            className="bookhive-book-genre"
                            whileHover={{ scale: 1.05 }}
                            animate={{ 
                              scale: [1, 1.02, 1],
                              transition: { 
                                duration: 2, 
                                repeat: Infinity, 
                                repeatType: "reverse" 
                              }
                            }}
                          >
                            {book.genre}
                          </motion.span>
                        )}
                        
                        {/* Book Description Preview */}
                        {book.description && (
                          <p className="bookhive-book-description-preview">
                            {book.description.length > 80 
                              ? `${book.description.substring(0, 80)}...` 
                              : book.description
                            }
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;