import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CategoryBooks.css';

const CATEGORY_MAP = {
  'fiction': 'fiction',
  'romance': 'romance',
  'mystery': 'mystery',
  'science_fiction': 'science_fiction',
  'self_help': 'self_help',
  'biography': 'biography',
  'history': 'history',
  'fantasy': 'fantasy',
  'science': 'science',
  'non-fiction': 'nonfiction',
  'nonfiction': 'nonfiction',
  'science & technology': 'science',
};

// Category emojis and colors for theming
const CATEGORY_THEMES = {
  'fiction': { emoji: '📚', gradient: 'from-blue-500 to-blue-700', color: '#667eea' },
  'romance': { emoji: '💕', gradient: 'from-pink-400 to-pink-600', color: '#ec4899' },
  'mystery': { emoji: '🔍', gradient: 'from-purple-500 to-purple-700', color: '#8b5cf6' },
  'science_fiction': { emoji: '🚀', gradient: 'from-cyan-400 to-blue-600', color: '#06b6d4' },
  'self_help': { emoji: '💪', gradient: 'from-green-500 to-green-700', color: '#10b981' },
  'biography': { emoji: '👤', gradient: 'from-orange-500 to-red-500', color: '#f59e0b' },
  'history': { emoji: '🏛️', gradient: 'from-yellow-500 to-orange-600', color: '#eab308' },
  'fantasy': { emoji: '🧙', gradient: 'from-indigo-500 to-purple-600', color: '#6366f1' },
};

// Loading skeleton component
const BookSkeleton = () => (
  <div className="category-book-skeleton">
    <div className="skeleton-cover"></div>
    <div className="skeleton-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-author"></div>
    </div>
  </div>
);

const CategoryBooks = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleBooks, setVisibleBooks] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const containerRef = useRef(null);

  // Get category theme
  const categoryTheme = CATEGORY_THEMES[category] || { 
    emoji: '📖', 
    gradient: 'from-gray-500 to-gray-700', 
    color: '#6b7280' 
  };

  useEffect(() => {
    // Page entrance animation
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setBooks([]);
      setVisibleBooks([]);
      
      const subject = CATEGORY_MAP[category?.toLowerCase()] || category;
      
      try {
        const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=24`);
        const data = await response.json();
        
        const booksData = data.works.map((book, index) => ({
          id: `${book.key}-${index}`,
          title: book.title,
          author: book.authors?.[0]?.name || 'Unknown Author',
          coverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null,
          largeCoverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : null,
          key: book.key,
          firstPublishYear: book.first_publish_year,
          editionCount: book.edition_count || 1,
          availability: book.availability || {},
        }));
        
        setBooks(booksData);
        
        // Staggered animation for books
        booksData.forEach((book, index) => {
          setTimeout(() => {
            setVisibleBooks(prev => [...prev, book.id]);
          }, index * 100);
        });
        
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchBooks();
  }, [category]);

  const handleBookClick = (book) => {
    // Navigate to detailed book page with book data
    navigate('/book-details', {
      state: { book }
    });
  };



  const formatCategoryName = (cat) => {
    return cat?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Books';
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={`category-books-page ${pageLoaded ? 'loaded' : ''}`} ref={containerRef}>
      
      {/* Animated Background */}
      <div className="category-background">
        <div className="floating-books">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`floating-book floating-book-${i + 1}`}
              style={{ '--theme-color': categoryTheme.color }}
            >
              {categoryTheme.emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="category-books-container">
        {/* Enhanced Header */}
        <div className="category-header">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-arrow">←</span>
            <span>Back to Categories</span>
          </button>
          
          <div className="category-title-section">
            <div className="category-emoji-large" style={{ '--theme-color': categoryTheme.color }}>
              {categoryTheme.emoji}
            </div>
            <h1 className="category-main-title">
              {formatCategoryName(category)}
            </h1>
            <p className="category-subtitle">
              Discover amazing {formatCategoryName(category).toLowerCase()} books from our collection
            </p>
          </div>

          <div className="category-stats">
            <div className="stat-item">
              <span className="stat-number">{books.length}</span>
              <span className="stat-label">Books Found</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{books.filter(b => b.coverUrl).length}</span>
              <span className="stat-label">With Covers</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="category-content">
          {loading ? (
            <div className="loading-section">
              <div className="loading-animation">
                <div className="loading-book">
                  <div className="book-spine"></div>
                  <div className="book-pages"></div>
                </div>
                <div className="loading-text">
                  <h3>Loading {formatCategoryName(category)} Books</h3>
                  <p>Please wait while we gather the best books for you...</p>
                </div>
              </div>
              
              {/* Loading skeletons */}
              <div className="books-grid loading-grid">
                {[...Array(8)].map((_, i) => (
                  <BookSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No books found</h3>
              <p>We couldn't find any books in the {formatCategoryName(category)} category.</p>
              <button className="explore-button" onClick={() => navigate('/books')}>
                Explore All Books
              </button>
            </div>
          ) : (
            <>
              {/* Books Grid */}
              <div className="books-grid">
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className={`simple-book-card ${visibleBooks.includes(book.id) ? 'visible' : ''}`}
                    onClick={() => handleBookClick(book)}
                    style={{ 
                      '--animation-delay': `${index * 0.1}s`,
                      '--theme-color': categoryTheme.color 
                    }}
                  >
                    <div className="simple-book-cover">
                      <img
                        src={book.coverUrl || '/default-book-cover.svg'}
                        alt={book.title}
                        className="book-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          if (e.target.src !== '/default-book-cover.svg') {
                            e.target.src = '/default-book-cover.svg';
                          }
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                      />
                      
                      <div className="simple-hover-overlay">
                        <div className="hover-text">View Details</div>
                      </div>
                    </div>

                    <div className="simple-book-info">
                      <h3 className="simple-book-title">{book.title}</h3>
                      <p className="simple-book-author">Written by {book.author}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              <div className="load-more-section">
                <p className="results-info">
                  Showing {books.length} books in {formatCategoryName(category)}
                </p>
                <button className="load-more-button" style={{ '--theme-color': categoryTheme.color }}>
                  <span>Load More Books</span>
                  <span className="load-icon">⬇️</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>


    </div>
  );
};

export default CategoryBooks; 