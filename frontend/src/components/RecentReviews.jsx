import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/RecentReviews.css';

const RecentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Simulated reviews data - replace with actual API call
        const mockReviews = [
          {
            id: 1,
            bookTitle: "The Midnight Library",
            author: "Matt Haig",
            rating: 5,
            review: "A beautiful exploration of life's infinite possibilities. This book made me reflect on my own choices and the paths not taken.",
            reviewer: "Sarah Johnson",
            date: "2024-03-15",
            bookCover: "https://covers.openlibrary.org/b/id/12749801-M.jpg"
          },
          {
            id: 2,
            bookTitle: "Project Hail Mary",
            author: "Andy Weir",
            rating: 4,
            review: "An incredible journey through space with a unique friendship at its core. The scientific elements are fascinating!",
            reviewer: "Michael Chen",
            date: "2024-03-14",
            bookCover: "https://covers.openlibrary.org/b/id/12749802-M.jpg"
          },
          {
            id: 3,
            bookTitle: "Klara and the Sun",
            author: "Kazuo Ishiguro",
            rating: 5,
            review: "A touching story about artificial intelligence and what it means to be human. Ishiguro's writing is simply beautiful.",
            reviewer: "Emma Thompson",
            date: "2024-03-13",
            bookCover: "https://covers.openlibrary.org/b/id/12749803-M.jpg"
          }
        ];
        
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };
      
  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  
  return (
    <section className="recent-reviews">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Recent Reviews
      </motion.h2>

      <div className="reviews-carousel">
      {loading ? (
          <div className="loading">Loading reviews...</div>
      ) : (
          <>
            <button className="carousel-nav prev" onClick={prevReview}>
              ←
          </button>
          
            <div className="carousel-container">
              <AnimatePresence mode="wait">
            <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="review-card"
                >
                  <div className="review-book">
                    <img src={reviews[currentIndex].bookCover} alt={reviews[currentIndex].bookTitle} />
                  </div>
                  <div className="review-content">
                    <h3>{reviews[currentIndex].bookTitle}</h3>
                    <p className="author">by {reviews[currentIndex].author}</p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < reviews[currentIndex].rating ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                        </div>
                    <p className="review-text">{reviews[currentIndex].review}</p>
                        <div className="reviewer-info">
                      <span className="reviewer-name">{reviews[currentIndex].reviewer}</span>
                      <span className="review-date">{reviews[currentIndex].date}</span>
                    </div>
                  </div>
            </motion.div>
              </AnimatePresence>
          </div>
          
            <button className="carousel-nav next" onClick={nextReview}>
              →
          </button>
          
            <div className="carousel-dots">
            {reviews.map((_, index) => (
              <button 
                key={index} 
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          </>
        )}
        </div>
    </section>
  );
};

export default RecentReviews;