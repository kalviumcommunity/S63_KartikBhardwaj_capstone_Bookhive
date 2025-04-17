import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchBooks } from '../services/BookService';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const results = await searchBooks(query);
      setBooks(results);
      setLoading(false);
    };
    
    if (query) {
      fetchResults();
    }
  }, [query]);
  
  if (loading) {
    return (
      <div className="search-results">
        <h2>Search Results for: {query}</h2>
        <div className="loading">Searching for books...</div>
      </div>
    );
  }
  
  return (
    <div className="search-results">
      <h2>Search Results for: {query}</h2>
      {books.length === 0 ? (
        <div className="no-results">No books found for "{query}"</div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-cover">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} />
                ) : (
                  <div className="no-cover">No Cover</div>
                )}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <p className="year">Published: {book.publishYear}</p>
                <a href={`/book${book.id}`} className="view-button">View Details</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 