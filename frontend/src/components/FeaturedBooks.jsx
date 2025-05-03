import React, { useState, useEffect } from 'react';
import { getFeaturedBooks } from '../services/BookService';
import BookCarousel from './BookCarousel';
import { useNavigate } from 'react-router-dom';
import '../styles/FeaturedBooks.css';

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const fetchedBooks = await getFeaturedBooks();
      setBooks(fetchedBooks);
      setLoading(false);
    };
    
    fetchBooks();
  }, []);
  
  const handleBookClick = (bookId) => {
    // Check authentication before handling book click
    // if (handleAuthRequired(navigate)) {
    //   ...
    // }
    console.log('Featured book clicked:', bookId);
  };
  
  return (
    <section className="featured-books">
      <h2>Featured Books</h2>
      
      {loading ? (
        <div className="loading">Loading featured books...</div>
      ) : (
        <div className="carousel-container">
          <BookCarousel books={books} autoPlay={true} interval={5000} />
        </div>
      )}
      
      <a href="/books" className="see-all-btn">See All Books</a>
    </section>
  );
};

export default FeaturedBooks; 