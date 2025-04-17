import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Discover Your Next Favorite Read Today!</h1>
        <p>
          Dive into a world of books with honest reviews from fellow readers.
          <br />
          Start your journey to find the perfect book that resonates with you!
        </p>
        <button className="explore-btn">Explore</button>
      </div>
      
      <div className="hero-image">
        <div className="book orange-book">
          <div className="book-label">
            <span>BOOK</span>
            <span>MOCK</span>
          </div>
        </div>
        
        <div className="book blue-book">
          <div className="book-label">
            <span>BOOK</span>
            <span>MOCKUP</span>
          </div>
        </div>
        
        <div className="book white-book">
          <div className="book-label">
            <span>DOWNLOAD</span>
            <span>FREE BOOK</span>
            <span>MOCKUP</span>
            <span>FROM</span>
            <span>IS.GRAPHICS</span>
          </div>
        </div>
        
        <div className="book yellow-book">
          <div className="book-label">
            <span className="vertical-text">POCKET BOOK</span>
          </div>
        </div>
        
        <div className="platform"></div>
      </div>
    </section>
  );
};

export default Hero; 