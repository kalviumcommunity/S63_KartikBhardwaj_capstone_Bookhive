import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BookCover from './BookCover';
import './HeroSection.css';

// Fallback cover images (stored locally)
const fallbackCovers = {
  'the-hobbit': '/book-covers/hobbit.jpg',
  'to-kill-a-mockingbird': '/book-covers/mockingbird.jpg',
  '1984': '/book-covers/1984.jpg',
  'pride-and-prejudice': '/book-covers/pride.jpg',
  'the-great-gatsby': '/book-covers/gatsby.jpg'
};

const HeroSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using local images
    const featuredBooks = [
      {
        id: 1,
        title: "The Secret",
        author: "Rhonda Byrne",
        imageUrl: "/images/book-covers/the-secret.jpg",
        alternativeCoverUrl: "/images/book-covers/default-book.jpg"
      },
      {
        id: 2,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        imageUrl: "/images/book-covers/harry-potter.jpg",
        alternativeCoverUrl: "/images/book-covers/fantasy-book.jpg"
      },
      {
        id: 3,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        imageUrl: "/images/book-covers/the-hobbit.jpg",
        alternativeCoverUrl: "/images/book-covers/fantasy-book.jpg"
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        imageUrl: "/images/book-covers/pride-and-prejudice.jpg",
        alternativeCoverUrl: "/images/book-covers/fiction-book.jpg"
      }
    ];

    // Set books immediately - no loading state needed
    setBooks(featuredBooks);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="hero-section" id="herosection">
        <div className="hero-content">
          <h1>Featured Books</h1>
          <div className="loading-placeholder">
            <div className="animate-pulse bg-gray-200 w-64 h-96 rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hero-section">
        <div className="hero-content">
          <h1>Featured Books</h1>
          <div className="error-message">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Featured Books</h1>
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
          onError={(e) => setError("Failed to load carousel: " + e.message)}
        >
          {books.map((book) => (
            <div key={book.id} className="carousel-slide">
              <Link to={`/book/${book.id}`}>
                <BookCover 
                  book={book}
                  size="large"
                  onError={() => {
                    console.warn(`Failed to load cover for ${book.title}`);
                    // If both primary and alternative URLs fail, use the default SVG icon
                    book.imageUrl = '/images/book-covers/default-book.jpg';
                  }}
                />
              </Link>
            </div>
          ))}
        </Carousel>
        <Link to="/books" className="see-all-btn">
          See All Books
        </Link>
      </div>
    </section>
  );
};

export default HeroSection; 