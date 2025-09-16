import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PLACEHOLDER_IMAGES } from '../utils/imageUtils';

const SimpleBookCover = ({ 
  book, 
  size = 'medium', 
  showOverlay = true, 
  onClick = null,
  className = ''
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate multiple cover URL options
  const getCoverUrls = (book) => {
    const urls = [];
    const { id, key, cover_i, isbn, title, author } = book;
    
    // Extract work ID
    let workId = id;
    if (!workId && key) {
      workId = key.replace('/works/', '');
    }

    // Primary: OpenLibrary cover_i
    if (cover_i) {
      urls.push(`https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`);
      urls.push(`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`);
    }

    // Secondary: Work ID based URLs
    if (workId) {
      urls.push(`https://covers.openlibrary.org/b/olid/${workId}-L.jpg`);
      urls.push(`https://covers.openlibrary.org/b/olid/${workId}-M.jpg`);
    }

    // Tertiary: ISBN based
    if (isbn && isbn.length > 0) {
      const primaryIsbn = Array.isArray(isbn) ? isbn[0] : isbn;
      urls.push(`https://covers.openlibrary.org/b/isbn/${primaryIsbn}-L.jpg`);
    }

    // Quaternary: Generated placeholder
    if (title) {
      const titleEncoded = encodeURIComponent(title.substring(0, 20));
      urls.push(`https://ui-avatars.com/api/?name=${titleEncoded}&size=300&background=667eea&color=fff&bold=true&format=png`);
    }

    // Final fallback
    urls.push('/NoCoverAvailable.svg');
    urls.push(PLACEHOLDER_IMAGES.GENERIC_BOOK);
    
    return urls;
  };

  const tryLoadImage = async (urls, index = 0) => {
    if (index >= urls.length) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setCurrentImageUrl(urls[index]);
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      // Try next URL
      tryLoadImage(urls, index + 1);
    };

    img.src = urls[index];
  };

  useEffect(() => {
    const urls = getCoverUrls(book);
    tryLoadImage(urls);
  }, [book]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-24 h-36';
      case 'large': return 'w-48 h-72';
      case 'xlarge': return 'w-56 h-84';
      default: return 'w-40 h-60';
    }
  };

  const handleClick = () => {
    if (onClick) onClick(book);
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${getSizeClasses()} ${className}`}
      whileHover={onClick ? { scale: 1.05, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={handleClick}
      style={{ zIndex: 5 }} // Keep book covers below navbar
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Main Image */}
      {!isLoading && !hasError && currentImageUrl && (
        <img
          src={currentImageUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex flex-col items-center justify-center text-white p-4">
          <div className="text-2xl mb-2">📚</div>
          <div className="text-xs text-center font-medium">
            {book.title?.substring(0, 20) || 'Book Cover'}
          </div>
          <div className="text-xs text-center opacity-75 mt-1">
            by {book.author?.substring(0, 15) || 'Unknown'}
          </div>
        </div>
      )}

      {/* Overlay */}
      {showOverlay && !isLoading && onClick && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ zIndex: 6 }}
        >
          <div className="text-center p-2">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs opacity-90 mb-2">
              by {book.author || 'Unknown'}
            </p>
            {book.rating && (
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-xs">{book.rating}</span>
              </div>
            )}
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              View Details
            </div>
          </div>
        </motion.div>
      )}

      {/* Rating Badge for small size */}
      {size === 'small' && book.rating && (
        <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded flex items-center" style={{ zIndex: 7 }}>
          <span className="text-yellow-400 mr-0.5">★</span>
          {book.rating}
        </div>
      )}
    </motion.div>
  );
};

export default SimpleBookCover;