import React, { useState, useEffect } from 'react';
import { getFeaturedBooks } from '../services/BookService';
import '../styles/FeaturedBooks.css';

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const fetchedBooks = await getFeaturedBooks();
      setBooks(fetchedBooks);
      setLoading(false);
    };
    
    fetchBooks();
  }, []);
  
  if (loading) {
    return (
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="loading">Loading featured books...</div>
      </section>
    );
  }
  
  return (
    <section className="featured-books">
      <h2>Featured Books</h2>
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
              <div className="rating">★★★★☆</div>
              <a href={`/book${book.id}`} className="view-button">View Details</a>
            </div>
          </div>
        ))}
      </div>
      <a href="/books" className="see-all-btn">See All Books</a>
    </section>
  );
};

export default FeaturedBooks; 