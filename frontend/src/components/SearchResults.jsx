import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { searchBooks } from '../services/BookService';
import '../styles/SearchResults.css';
import Navbar from './Navbar';

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [activeTab, setActiveTab] = useState('books');
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [isBookDetailsVisible, setIsBookDetailsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const bookDetailsRef = useRef(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch books
        const bookResults = await searchBooks(query);
        setBooks(bookResults);
        
        // Extract unique authors from the book results
        const uniqueAuthors = [];
        const authorSet = new Set();
        
        bookResults.forEach(book => {
          if (book.author && !authorSet.has(book.author)) {
            authorSet.add(book.author);
            uniqueAuthors.push({
              name: book.author,
              books: [book]
            });
          } else if (book.author) {
            // Add book to existing author
            const authorIndex = uniqueAuthors.findIndex(a => a.name === book.author);
            if (authorIndex !== -1) {
              uniqueAuthors[authorIndex].books.push(book);
            }
          }
        });
        
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchResults();
    }
  }, [query]);

  // Close book details when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookDetailsRef.current && !bookDetailsRef.current.contains(event.target)) {
        setIsBookDetailsVisible(false);
      }
    };

    if (isBookDetailsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBookDetailsVisible]);

  const handleBookClick = async (book) => {
    // Extract the works ID from the key
    const workId = book.id.replace('/works/', '');
    
    setSelectedBook(book);
    setIsBookDetailsVisible(true);
    
    try {
      // Fetch additional book details
      const response = await fetch(`http://localhost:5001/api/books/external-details?title=${encodeURIComponent(book.title)}`);
      const details = await response.json();
      setBookDetails(details);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setBookDetails({
        description: 'No description available.',
        subjects: [],
        firstPublishYear: book.publishYear || 'Unknown',
        language: 'Unknown',
        publishers: 'Unknown',
        numberOfPages: 'Unknown',
        publishDate: 'Unknown',
        isbn: 'Unknown'
      });
    }
  };

  const handleViewFullDetails = (book) => {
    const workId = book.id.replace('/works/', '');
    navigate(`/book/${workId}`);
  };

  const handleAuthorClick = (authorName) => {
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };
  
  if (loading) {
    return (
      <div className="search-page">
        <Navbar />
        <div className="search-results-container">
          <div className="search-header">
            <h1>Searching for: <span className="search-query">"{query}"</span></h1>
            <div className="search-loading">
              <div className="book-loader">
                <div className="book-page"></div>
                <div className="book-page"></div>
                <div className="book-page"></div>
              </div>
              <p>Searching through our library...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="search-page">
      <Navbar />
      <div className="search-results-container">
        <div className="search-header">
          <h1>Search Results for: <span className="search-query">"{query}"</span></h1>
          
          <div className="search-tabs">
            <button 
              className={`search-tab ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <span className="tab-icon">📚</span>
              <span className="tab-label">Books ({books.length})</span>
            </button>
            <button 
              className={`search-tab ${activeTab === 'authors' ? 'active' : ''}`}
              onClick={() => setActiveTab('authors')}
            >
              <span className="tab-icon">✍️</span>
              <span className="tab-label">Authors ({authors.length})</span>
            </button>
          </div>
        </div>
        
        {activeTab === 'books' && (
          <div className="books-results">
            {books.length === 0 ? (
              <div className="no-results">
                <div className="empty-bookshelf">
                  <div className="shelf"></div>
                  <div className="dust"></div>
                </div>
                <h3>No books found for "{query}"</h3>
                <p>Try searching with different keywords or browse our categories.</p>
                <Link to="/books" className="browse-button">Browse All Books</Link>
              </div>
            ) : (
              <div className="book-grid">
                {books.map((book) => (
                  <div 
                    className="book-card" 
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="book-cover-wrapper">
                      <div className="book-cover">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} loading="lazy" />
                        ) : (
                          <div className="no-cover">
                            <span className="no-cover-title">{book.title}</span>
                          </div>
                        )}
                        <div className="book-shine"></div>
                      </div>
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author" onClick={(e) => {
                        e.stopPropagation();
                        handleAuthorClick(book.author);
                      }}>{book.author}</p>
                      {book.publishYear !== 'Unknown' && (
                        <p className="book-year">Published: {book.publishYear}</p>
                      )}
                      <button className="view-details-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'authors' && (
          <div className="authors-results">
            {authors.length === 0 ? (
              <div className="no-results">
                <h3>No authors found for "{query}"</h3>
                <p>Try searching with different keywords.</p>
              </div>
            ) : (
              <div className="authors-grid">
                {authors.map((author, index) => (
                  <div 
                    className="author-card" 
                    key={index}
                    onClick={() => handleAuthorClick(author.name)}
                  >
                    <div className="author-info">
                      <h3 className="author-name">{author.name}</h3>
                      <p className="author-books-count">{author.books.length} book{author.books.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="author-books-preview">
                      {author.books.slice(0, 3).map((book, bookIndex) => (
                        <div className="author-book-cover" key={bookIndex} style={{
                          zIndex: 3 - bookIndex,
                          transform: `translateX(${bookIndex * -15}px)`
                        }}>
                          {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} loading="lazy" />
                          ) : (
                            <div className="mini-no-cover"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="view-author-button">View Author</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Book Details Popup */}
        {isBookDetailsVisible && selectedBook && (
          <div className="book-details-overlay">
            <div className="book-details-popup" ref={bookDetailsRef}>
              <button 
                className="close-details-button"
                onClick={() => setIsBookDetailsVisible(false)}
              >
                ×
              </button>
              
              <div className="book-details-content">
                <div className="book-details-header">
                  <div className="book-details-cover">
                    {selectedBook.coverUrl ? (
                      <img src={selectedBook.coverUrl.replace('-M.jpg', '-L.jpg')} alt={selectedBook.title} />
                    ) : (
                      <div className="details-no-cover">
                        <span>{selectedBook.title}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="book-details-info">
                    <h2 className="book-details-title">{selectedBook.title}</h2>
                    <p className="book-details-author" onClick={() => {
                      handleAuthorClick(selectedBook.author);
                      setIsBookDetailsVisible(false);
                    }}>by {selectedBook.author}</p>
                    
                    <div className="book-details-meta">
                      {selectedBook.publishYear !== 'Unknown' && (
                        <div className="meta-item">
                          <span className="meta-label">Published:</span>
                          <span className="meta-value">{selectedBook.publishYear}</span>
                        </div>
                      )}
                      
                      {bookDetails && bookDetails.language && bookDetails.language !== 'Unknown' && (
                        <div className="meta-item">
                          <span className="meta-label">Language:</span>
                          <span className="meta-value">{bookDetails.language}</span>
                        </div>
                      )}
                      
                      {bookDetails && bookDetails.numberOfPages && bookDetails.numberOfPages !== 'Unknown' && (
                        <div className="meta-item">
                          <span className="meta-label">Pages:</span>
                          <span className="meta-value">{bookDetails.numberOfPages}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="book-details-actions">
                      <button 
                        className="full-details-button"
                        onClick={() => handleViewFullDetails(selectedBook)}
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="book-details-description">
                  <h3>About this Book</h3>
                  <p>{bookDetails ? bookDetails.description : 'Loading description...'}</p>
                </div>
                
                <div className="book-details-author-section">
                  <h3>About the Author</h3>
                  <div className="author-preview">
                    <div className="author-avatar">
                      <span>{selectedBook.author.charAt(0)}</span>
                    </div>
                    <div className="author-preview-info">
                      <h4>{selectedBook.author}</h4>
                      <p>Author of {authors.find(a => a.name === selectedBook.author)?.books.length || 1} book{authors.find(a => a.name === selectedBook.author)?.books.length !== 1 ? 's' : ''}</p>
                      <button 
                        className="view-author-profile"
                        onClick={() => {
                          handleAuthorClick(selectedBook.author);
                          setIsBookDetailsVisible(false);
                        }}
                      >
                        View Author Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 