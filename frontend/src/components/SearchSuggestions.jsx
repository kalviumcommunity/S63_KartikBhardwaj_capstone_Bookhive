import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchSuggestions.css';

const SearchSuggestions = ({ query, onSelect, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({
    books: [],
    authors: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions({ books: [], authors: [] });
        return;
      }

      setLoading(true);
      try {
        // Fetch book suggestions from Open Library
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        
        // Process books
        const bookSuggestions = data.docs
          .filter(book => book.title)
          .slice(0, 3)
          .map(book => ({
            id: book.key,
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Unknown Author',
            coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
            year: book.first_publish_year || 'Unknown'
          }));
        
        // Process authors
        const authorSet = new Set();
        const authorSuggestions = data.docs
          .filter(book => book.author_name && book.author_name[0])
          .reduce((acc, book) => {
            const authorName = book.author_name[0];
            if (!authorSet.has(authorName) && acc.length < 3) {
              authorSet.add(authorName);
              acc.push({
                name: authorName,
                bookCount: data.docs.filter(b => 
                  b.author_name && b.author_name.includes(authorName)
                ).length,
                sampleBook: {
                  title: book.title,
                  coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg` : null
                }
              });
            }
            return acc;
          }, []);
        
        setSuggestions({
          books: bookSuggestions,
          authors: authorSuggestions
        });
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleBookClick = (book) => {
    const workId = book.id.replace('/works/', '');
    navigate(`/book/${workId}`);
    if (onClose) onClose();
  };

  const handleAuthorClick = (author) => {
    navigate(`/author/${encodeURIComponent(author.name)}`);
    if (onClose) onClose();
  };

  const handleViewAllResults = () => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
    if (onClose) onClose();
  };

  if (!query || (suggestions.books.length === 0 && suggestions.authors.length === 0 && !loading)) {
    return null;
  }

  return (
    <div className="search-suggestions">
      {loading ? (
        <div className="suggestions-loading">
          <div className="suggestion-loader"></div>
          <p>Finding matches...</p>
        </div>
      ) : (
        <>
          {suggestions.books.length > 0 && (
            <div className="suggestion-section">
              <h3 className="suggestion-heading">Books</h3>
              <ul className="suggestion-list">
                {suggestions.books.map((book, index) => (
                  <li 
                    key={`book-${index}`} 
                    className="suggestion-item book-suggestion"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="suggestion-image">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} loading="lazy" />
                      ) : (
                        <div className="suggestion-no-cover">
                          <span>📚</span>
                        </div>
                      )}
                    </div>
                    <div className="suggestion-info">
                      <p className="suggestion-title">{book.title}</p>
                      <p className="suggestion-author">by {book.author}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.authors.length > 0 && (
            <div className="suggestion-section">
              <h3 className="suggestion-heading">Authors</h3>
              <ul className="suggestion-list">
                {suggestions.authors.map((author, index) => (
                  <li 
                    key={`author-${index}`} 
                    className="suggestion-item author-suggestion"
                    onClick={() => handleAuthorClick(author)}
                  >
                    <div className="suggestion-image author-image">
                      {author.sampleBook.coverUrl ? (
                        <img src={author.sampleBook.coverUrl} alt={author.name} loading="lazy" />
                      ) : (
                        <div className="suggestion-no-cover">
                          <span>✍️</span>
                        </div>
                      )}
                    </div>
                    <div className="suggestion-info">
                      <p className="suggestion-title">{author.name}</p>
                      <p className="suggestion-detail">{author.bookCount} book{author.bookCount !== 1 ? 's' : ''}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="suggestion-footer">
            <button 
              className="view-all-results" 
              onClick={handleViewAllResults}
            >
              View all results for "{query}"
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;