import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Static placeholder images
const PLACEHOLDER_IMAGES = {
  default: 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Book/SVG/ic_fluent_book_24_regular.svg',
  error: 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Book/SVG/ic_fluent_book_error_24_regular.svg'
};

const BookCover = ({ 
  book, 
  size = 'medium',
  className = '',
  onLoad = () => {},
  onError = () => {} 
}) => {
  const [currentSource, setCurrentSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Configure image sources in order of preference
  const getSources = () => {
    const sources = [];

    // Primary source - direct image URL
    if (book.imageUrl) {
      sources.push({
        type: 'direct',
        url: book.imageUrl
      });
    }

    // Alternative source
    if (book.alternativeCoverUrl) {
      sources.push({
        type: 'alternative',
        url: book.alternativeCoverUrl
      });
    }

    // Default placeholder
    sources.push({
      type: 'placeholder',
      url: PLACEHOLDER_IMAGES.default
    });

    return sources;
  };

  // Preload the next image before showing it
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 3000);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(url);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Image load failed'));
      };

      img.src = url;
    });
  };

  // Try loading the next available source
  const tryNextSource = async (sources, currentIndex = 0) => {
    if (currentIndex >= sources.length) {
      setCurrentSource({ type: 'error', url: PLACEHOLDER_IMAGES.error });
      setHasError(true);
      setIsLoading(false);
      onError();
      return;
    }

    try {
      const source = sources[currentIndex];
      await preloadImage(source.url);
      setCurrentSource(source);
      setIsLoading(false);
      setHasError(false);
      onLoad();
    } catch (error) {
      console.warn(`Failed to load image from ${sources[currentIndex].type}:`, error);
      tryNextSource(sources, currentIndex + 1);
    }
  };

  useEffect(() => {
    const sources = getSources();
    let isMounted = true;

    const loadImage = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setHasError(false);
      await tryNextSource(sources);
    };

    loadImage();

    return () => {
      isMounted = false;
      setCurrentSource(null);
      setIsLoading(false);
      setHasError(false);
    };
  }, [book.imageUrl, book.alternativeCoverUrl]);

  // Size classes for different display contexts
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-48 h-72',
    large: 'w-64 h-96'
  };

  return (
    <div 
      className={`book-cover-wrapper ${sizeClasses[size]} ${className}`}
      data-testid="book-cover"
    >
      {isLoading && (
        <div className="loading-placeholder">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded" />
        </div>
      )}
      
      {currentSource && (
        <img
          src={currentSource.url}
          alt={`Cover of ${book.title}`}
          className={`book-cover ${hasError ? 'error' : ''}`}
          loading="lazy"
          onError={() => {
            const sources = getSources();
            const currentIndex = sources.findIndex(s => s.url === currentSource.url);
            if (currentIndex !== -1) {
              tryNextSource(sources, currentIndex + 1);
            }
          }}
        />
      )}

      {hasError && (
        <div className="cover-error-overlay">
          <h3>{book.title}</h3>
          <p>By {book.author}</p>
        </div>
      )}
    </div>
  );
};

BookCover.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    alternativeCoverUrl: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default BookCover; 