import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { handleImageError } from '../utils/imageUtils';
import '../styles/BookOfTheMonth.css';

gsap.registerPlugin(ScrollTrigger);

// Featured books data with real cover images from Open Library API
const featuredBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "https://covers.openlibrary.org/b/id/10427395-L.jpg",
    olid: "OL27351893M", // Open Library ID
    rating: 4.5,
    description: "Between life and death there is a library. When Nora finds herself in the Midnight Library, she has a chance to make things right. Up until now, her life has been full of misery and regret. She feels she has let everyone down, including herself.",
    genres: ["Fiction", "Fantasy", "Contemporary"],
    pages: 304,
    year: 2020,
    quotes: [
      "The only way to learn is to live.",
      "Every book is a potential escape."
    ]
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "https://covers.openlibrary.org/b/id/10809216-L.jpg",
    olid: "OL29486472M", // Open Library ID
    rating: 4.7,
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
    genres: ["Science Fiction", "Space", "Adventure"],
    pages: 496,
    year: 2021,
    quotes: [
      "I penetrated the outer cell membrane with a nanosyringe.",
      "Let's science the heck out of this!"
    ]
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    olid: "OL7360034M", // Open Library ID
    rating: 4.6,
    description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work 'her own darling child' and its vivacious heroine, Elizabeth Bennet, 'as delightful a creature as ever appeared in print.'",
    genres: ["Classic", "Romance", "Fiction"],
    pages: 432,
    year: 1813,
    quotes: [
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      "I could easily forgive his pride, if he had not mortified mine."
    ]
  },
  {
    id: 4,
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
    olid: "OL35876761M", // Open Library ID
    rating: 4.8,
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
    genres: ["Science Fiction", "Fantasy", "Classic"],
    pages: 658,
    year: 1965,
    quotes: [
      "Fear is the mind-killer.",
      "The mystery of life isn't a problem to solve, but a reality to experience."
    ]
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "https://covers.openlibrary.org/b/id/8432047-L.jpg",
    olid: "OL24347578M", // Open Library ID
    rating: 4.3,
    description: "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.",
    genres: ["Classic", "Fiction", "Literary Fiction"],
    pages: 180,
    year: 1925,
    quotes: [
      "So we beat on, boats against the current, borne back ceaselessly into the past.",
      "I hope she'll be a fool — that's the best thing a girl can be in this world, a beautiful little fool."
    ]
  }
];

const BookOfTheMonth = () => {
  const [activeBook, setActiveBook] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const bookRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const bookSceneRef = useRef(null);

  // Auto-rotate featured books
  useEffect(() => {
    if (!isExpanded && !isHovering && !isFlipped) {
      const interval = setInterval(() => {
        setActiveBook((prev) => (prev + 1) % featuredBooks.length);
        setImageLoaded(false); // Reset image loaded state when changing books
      }, 12000); // Change book every 12 seconds (increased to give more time to view each book)
      
      return () => clearInterval(interval);
    }
  }, [isExpanded, isHovering, isFlipped]);
  
  // Reset image loaded state when active book changes
  useEffect(() => {
    setImageLoaded(false);
  }, [activeBook]);
  
  // Preload book cover images
  useEffect(() => {
    // Preload all book cover images
    featuredBooks.forEach(book => {
      const img = new Image();
      img.src = book.coverUrl;
    });
  }, []);

  // Initialize book scene animations
  useEffect(() => {
    if (!bookSceneRef.current) return;
    
    // Initial animation for the book scene
    gsap.fromTo(
      '.book-scene',
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bookSceneRef.current,
          start: 'top 80%',
        }
      }
    );
    
    // Animate book elements
    gsap.fromTo(
      '.book-spotlight',
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3,
        scrollTrigger: {
          trigger: bookSceneRef.current,
          start: 'top 80%',
        }
      }
    );
    
    // Animate floating particles
    gsap.fromTo(
      '.particle',
      { 
        y: () => Math.random() * 100 - 50,
        opacity: 0 
      },
      { 
        y: 0,
        opacity: 0.8, 
        duration: 1.5, 
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bookSceneRef.current,
          start: 'top 80%',
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Enhanced 3D book effect with page flip animation
  useEffect(() => {
    if (!bookRef.current) return;
    
    const book = bookRef.current;
    
    // 3D rotation animation on hover
    const handleMouseMove = (e) => {
      if (isFlipped) return;
      
      setIsHovering(true);
      const { left, top, width, height } = book.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(book, {
        rotationY: x * 25,
        rotationX: -y * 15,
        translateZ: '50px',
        boxShadow: `
          ${-x * 30}px ${-y * 20}px 30px rgba(0, 0, 0, 0.2),
          ${x * 10}px ${y * 10}px 30px rgba(0, 0, 0, 0.1)
        `,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Animate the page corner fold
      gsap.to('.book-page-corner', {
        rotation: -5,
        x: -5,
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Animate the book shine
      gsap.to('.book-cover-shine', {
        opacity: 0.7 + x * 0.3,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      if (isFlipped) return;
      
      setIsHovering(false);
      gsap.to(book, {
        rotationY: 0,
        rotationX: 0,
        translateZ: '0px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Reset page corner
      gsap.to('.book-page-corner', {
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Reset book shine
      gsap.to('.book-cover-shine', {
        opacity: 0.4,
        duration: 0.5
      });
    };

    book.addEventListener('mousemove', handleMouseMove);
    book.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      book.removeEventListener('mousemove', handleMouseMove);
      book.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeBook, isFlipped]);

  // Enhanced scroll animations with parallax effect
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Parallax effect for the background
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      }
    });
    
    parallaxTl.fromTo('.parallax-bg', 
      { y: '-20%' },
      { y: '20%', ease: 'none' }
    );
    
    // Animate book details on scroll
    gsap.fromTo(
      '.book-details-content',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.book-details',
          start: 'top 80%',
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeBook]);

  const currentBook = featuredBooks[activeBook];
  
  // Handle book flip animation
  const handleBookFlip = () => {
    if (isFlipped) {
      // Flip back to cover
      gsap.to(bookRef.current, {
        rotationY: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setIsFlipped(false)
      });
    } else {
      // Flip to show back
      gsap.to(bookRef.current, {
        rotationY: 180,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setIsFlipped(true)
      });
    }
  };
  
  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    
    return stars;
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const bookCoverVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5 
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  // Generate particles for the book scene
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      
      particles.push(
        <div 
          key={i}
          className="particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    return particles;
  };

  return (
    <section className="book-of-month-section" ref={sectionRef}>
      <div className="parallax-bg"></div>
      <div className="floating-particles">
        {renderParticles()}
      </div>
      
      <div className="book-of-month-container" ref={containerRef}>
        <motion.h2 
          className="section-title"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="highlight">Book of the Month</span>
        </motion.h2>
        
        <div className="book-scene" ref={bookSceneRef}>
          <div className="book-spotlight"></div>
          
          <motion.div 
            className="book-of-month"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={`cover-${currentBook.id}`}
                className="book-cover-container"
                variants={bookCoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div 
                  className={`book-wrapper ${isFlipped ? 'flipped' : ''}`} 
                  onClick={handleBookFlip}
                >
                  <div className="book-3d" ref={bookRef}>
                    {/* Front Cover */}
                    <div className="book-front">
                      <div className="book-cover-loading" style={{ opacity: imageLoaded ? 0 : 1 }}>
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Loading cover...</div>
                      </div>
                      <img 
                        src={currentBook.coverUrl} 
                        alt={currentBook.title}
                        onError={(e) => handleImageError(e, 'book', currentBook.genres[0])}
                        onLoad={() => setImageLoaded(true)}
                        loading="eager"
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                        className="book-cover-image"
                      />
                      <div className="book-cover-shine"></div>
                      <div className="book-page-corner"></div>
                      <div className="book-spine"></div>
                      <div className="book-ribbon"></div>
                      <div className="tap-indicator">
                        <span>Tap to flip</span>
                      </div>
                    </div>
                    
                    {/* Back Cover */}
                    <div className="book-back">
                      <div className="book-back-content">
                        <h4>About this book</h4>
                        <p className="book-back-description">{currentBook.description.substring(0, 120)}...</p>
                        <div className="book-back-meta">
                          <div className="back-meta-item">
                            <span className="meta-label">Pages:</span>
                            <span className="meta-value">{currentBook.pages}</span>
                          </div>
                          <div className="back-meta-item">
                            <span className="meta-label">Year:</span>
                            <span className="meta-value">{currentBook.year}</span>
                          </div>
                          <div className="back-meta-item">
                            <span className="meta-label">Rating:</span>
                            <span className="meta-value">{currentBook.rating}/5</span>
                          </div>
                        </div>
                        <div className="book-back-footer">
                          <span>Tap to return</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="book-shadow"></div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={`content-${currentBook.id}`}
                className="book-details"
                ref={contentRef}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div className="book-header book-details-content" variants={itemVariants}>
                  <h3 className="book-title">{currentBook.title}</h3>
                  <p className="book-author">by {currentBook.author}</p>
                </motion.div>
                
                <motion.div className="book-meta book-details-content" variants={itemVariants}>
                  <div className="book-rating">
                    <div className="stars">
                      {renderStars(currentBook.rating)}
                    </div>
                    <span className="rating-value">{currentBook.rating}</span>
                    <span className="review-count">({Math.floor(Math.random() * 3000 + 1000)} reviews)</span>
                  </div>
                  
                  <div className="book-year">
                    <span className="year-label">Published:</span>
                    <span className="year-value">{currentBook.year}</span>
                  </div>
                </motion.div>
                
                <motion.div className="book-genres book-details-content" variants={itemVariants}>
                  {currentBook.genres.map((genre, index) => (
                    <motion.span 
                      key={index} 
                      className="genre-tag"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "#e0e4e9",
                        y: -5,
                        transition: { type: "spring", stiffness: 400, damping: 10 }
                      }}
                    >
                      {genre}
                    </motion.span>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="book-description book-details-content" 
                  variants={itemVariants}
                  animate={{ 
                    height: isExpanded ? "auto" : "4.5em",
                    transition: { duration: 0.5, ease: "easeInOut" }
                  }}
                >
                  <p>{isExpanded ? currentBook.description : `${currentBook.description.substring(0, 150)}...`}</p>
                </motion.div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      className="book-quotes book-details-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: "auto",
                        transition: { duration: 0.5, ease: "easeInOut", delay: 0.1 }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { duration: 0.3, ease: "easeInOut" }
                      }}
                    >
                      <h4>Notable Quotes</h4>
                      {currentBook.quotes.map((quote, index) => (
                        <motion.div 
                          key={index} 
                          className="book-quote"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: 0.2 + index * 0.1 }
                          }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                          </svg>
                          <p>{quote}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div className="book-actions book-details-content" variants={itemVariants}>
                  <motion.button 
                    className="action-button primary"
                    onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(currentBook.title + ' ' + currentBook.author)}`, '_blank')}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 10px 25px rgba(255, 107, 107, 0.5)",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    Read Now
                  </motion.button>
                  
                  <motion.button 
                    className="action-button secondary"
                    onClick={() => window.open(`https://openlibrary.org/books/${currentBook.olid}`, '_blank')}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    View on Open Library
                  </motion.button>
                  
                  <motion.button 
                    className="action-button secondary"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Enhanced book navigation dots */}
          <div className="book-navigation">
            {featuredBooks.map((book, index) => (
              <motion.button
                key={index}
                className={`nav-dot ${activeBook === index ? 'active' : ''}`}
                onClick={() => setActiveBook(index)}
                aria-label={`View ${book.title}`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={activeBook === index ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.5 }
                } : {}}
              >
                <span className="nav-dot-tooltip">{book.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOfTheMonth;