import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookCarousel from './BookCarousel';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-modern">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Left Column - Text Content */}
          <div className="hero-content">
            {/* Logo and Tagline */}
            <div className="hero-title-section">
              <h1 className="hero-logo">
                BookHive
              </h1>
              <p className="hero-tagline">
                Your Literary Community
              </p>
            </div>

            {/* Main Heading */}
            <h2 className="hero-main-heading">
              Discover Your Next Favorite Read Today!
            </h2>

            {/* Description */}
            <p className="hero-description">
              Dive into a world of books with honest reviews from fellow readers.
              <br />
              Start your journey to find the perfect book that resonates with you!
            </p>

            {/* Buttons */}
            <div className="hero-buttons-container">
              <button 
                className="hero-btn hero-btn-explore"
                onClick={() => navigate('/books')}
              >
                Explore Books
              </button>
              <button 
                className="hero-btn hero-btn-mood"
                onClick={() => navigate('/mood-matcher')}
              >
                Find Books by Mood
              </button>
            </div>
          </div>

          {/* Right Column - Circular Book Carousel */}
          <div className="hero-carousel-section">
            <BookCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 