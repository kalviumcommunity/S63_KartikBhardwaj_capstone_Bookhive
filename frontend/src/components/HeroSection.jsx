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
    const featuredBooks = [
      {
        id: 1,
        title: "The Secret",
        author: "Rhonda Byrne",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586566916i/52529964.jpg",
        alternativeCoverUrl: "https://m.media-amazon.com/images/I/51fVPhnxB1L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg"
      },
      {
        id: 2,
        title: "Girlsophy: A Soul Survival Kit",
        author: "Anthea Paul",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388439854i/212251.jpg",
        alternativeCoverUrl: "https://m.media-amazon.com/images/I/51G6NJG7D1L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg"
      },
      {
        id: 3,
        title: "How to Pass Exams",
        author: "Dominic O'Brien",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1387703134i/850031.jpg",
        alternativeCoverUrl: "https://m.media-amazon.com/images/I/51ZXQH5NKML._SY291_BO1,204,203,200_QL40_FMwebp_.jpg"
      },
      {
        id: 4,
        title: "Wuthering Heights",
        author: "Emily Brontë",
        imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388212715i/6185.jpg",
        alternativeCoverUrl: "https://m.media-amazon.com/images/I/41jNofZ6e8L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg"
      }
    ];

    setBooks(featuredBooks);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="hero-section">
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
                    book.imageUrl = 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Book/SVG/ic_fluent_book_24_regular.svg';
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