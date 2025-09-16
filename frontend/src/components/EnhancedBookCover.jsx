import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EnhancedImageLoader, createSkeletonProps } from '../utils/enhancedImageUtils';
import '../styles/EnhancedBookCover.css';

const EnhancedBookCover = ({
  book,
  size = 'medium',
  lazy = true,
  showOverlay = true,
  className = '',
  onClick = null,
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [hasIntersected, setHasIntersected] = useState(!lazy || priority);
  
  const imgRef = useRef(null);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority, hasIntersected]);

  // Image loading logic
  useEffect(() => {
    if (!hasIntersected || !imgRef.current) return;

    const img = imgRef.current;
    setIsLoading(true);
    setIsError(false);

    // Create enhanced image loader
    loaderRef.current = new EnhancedImageLoader(
      img,
      book,
      (url, urlIndex) => {
        setCurrentImageUrl(url);
        setIsLoading(false);
        setIsError(false);
        console.log(`Successfully loaded image for "${book.title}" from URL ${urlIndex + 1}`);
      },
      () => {
        setIsLoading(false);
        setIsError(true);
        console.warn(`Failed to load any image for "${book.title}"`);
      }
    );

    // Start loading
    loaderRef.current.load();

    return () => {
      if (loaderRef.current) {
        loaderRef.current = null;
      }
    };
  }, [hasIntersected, book]);

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'book-cover-small';
      case 'large': return 'book-cover-large';
      case 'xlarge': return 'book-cover-xlarge';
      default: return 'book-cover-medium';
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleImageError = () => {
    // The EnhancedImageLoader handles this
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(book);
    }
  };

  return (
    <motion.div
      className={`enhanced-book-cover ${getSizeClass()} ${className} ${isLoading ? 'loading' : ''} ${isError ? 'error' : ''}`}
      onClick={handleClick}
      whileHover={onClick ? { scale: 1.05, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Skeleton Loader */}
      {isLoading && (
        <div className="book-cover-skeleton" {...createSkeletonProps()}>
          <div className="skeleton-shimmer"></div>
        </div>
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={hasIntersected ? undefined : ''}
        alt={`Cover of ${book.title} by ${book.author}`}
        className={`book-cover-image ${isLoading ? 'loading' : 'loaded'}`}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* Overlay Information */}
      {showOverlay && !isLoading && (
        <motion.div
          className="book-cover-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlay-content">
            <h4 className="book-title">{book.title}</h4>
            <p className="book-author">by {book.author}</p>
            {book.rating && (
              <div className="book-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(book.rating))}
                  {'☆'.repeat(5 - Math.floor(book.rating))}
                </span>
                <span className="rating-value">{book.rating}</span>
              </div>
            )}
            {book.genre && (
              <span className="book-genre">{book.genre}</span>
            )}
          </div>
          
          {onClick && (
            <div className="overlay-action">
              <span className="view-details">View Details</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Loading Error State */}
      {isError && (
        <div className="book-cover-error">
          <div className="error-icon">📚</div>
          <p className="error-text">Cover not available</p>
        </div>
      )}

      {/* Book Info Badge (for small sizes) */}
      {size === 'small' && book.rating && (
        <div className="rating-badge">
          <span>★ {book.rating}</span>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedBookCover;