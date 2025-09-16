import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getFeaturedBooks } from '../services/BookService';
import { handleImageError, PLACEHOLDER_IMAGES } from '../utils/imageUtils';
import SimpleBookCover from './SimpleBookCover';
import '../styles/FeaturedBooks.css';
import '../styles/EnhancedBooks.css';

const FeaturedBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback featured books
  const fallbackFeaturedBooks = [
    {
      id: 'OL82563W',
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      authorName: 'J.K. Rowling',
      genre: 'Fantasy',
      rating: 4.8,
      cover_i: '8739161',
      isbn: ['9780439708180'],
      description: 'A young wizard discovers his magical heritage on his eleventh birthday and embarks on an incredible journey.',
      reviews: 2543
    },
    {
      id: 'OL45804W',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      authorName: 'Harper Lee',
      genre: 'Fiction',
      rating: 4.6,
      cover_i: '372119',
      isbn: ['9780061120084'],
      description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
      reviews: 2234
    },
    {
      id: 'OL25352W',
      title: '1984',
      author: 'George Orwell',
      authorName: 'George Orwell',
      genre: 'Dystopian',
      rating: 4.7,
      cover_i: '295575',
      description: 'A dystopian masterpiece about totalitarian control and the power of truth.',
      reviews: 2876
    },
    {
      id: 'OL476835W',
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      authorName: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      rating: 4.9,
      cover_i: '425030',
      description: 'An epic fantasy adventure in the magical world of Middle-earth.',
      reviews: 3456
    },
    {
      id: 'OL20525W',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      authorName: 'Jane Austen',
      genre: 'Romance',
      rating: 4.5,
      cover_i: '1003592',
      isbn: ['9780141439518'],
      description: 'A witty and romantic tale of love, first impressions, and social expectations.',
      reviews: 1965
    },
    {
      id: 'OL24364228W',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      authorName: 'Paulo Coelho',
      genre: 'Philosophy',
      rating: 4.3,
      cover_i: '172182',
      description: 'A philosophical tale about following your dreams and listening to your heart.',
      reviews: 2123
    }
  ];

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        let featuredBooks = await getFeaturedBooks();
        
        // Use fallback books if API fails or returns empty
        if (!featuredBooks || featuredBooks.length === 0) {
          featuredBooks = fallbackFeaturedBooks;
          console.log('Using fallback featured books');
        } else {
          // Limit to 6 books for featured section
          featuredBooks = featuredBooks.slice(0, 6);
        }
        
        setBooks(featuredBooks);
      } catch (err) {
        setError('Failed to load featured books');
        setBooks(fallbackFeaturedBooks); // Use fallback on error
        console.error('Error loading featured books, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  const handleQuickView = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Enhanced image error handling with multiple fallbacks
  const handleBookImageError = (event, book) => {
    const img = event.target;
    
    // Store the current src to avoid infinite loops
    const currentSrc = img.src;
    img.onerror = null; // Prevent infinite loop
    
    console.log(`Image failed to load: ${currentSrc} for book: ${book.title}`);
    
    // Try alternative cover URL if available and not already tried
    if (book.alternativeCoverUrl && currentSrc !== book.alternativeCoverUrl) {
      console.log(`Trying alternative cover: ${book.alternativeCoverUrl}`);
      img.src = book.alternativeCoverUrl;
      img.onerror = (e) => handleBookImageError(e, book);
      return;
    }
    
    // Try different OpenLibrary formats
    const formats = [
      `https://covers.openlibrary.org/b/olid/${book.id}-L.jpg`,
      `https://covers.openlibrary.org/b/olid/${book.id}-M.jpg`,
      `https://covers.openlibrary.org/b/id/${book.id.replace('OL', '').replace('W', '')}-L.jpg`,
      `https://covers.openlibrary.org/w/id/${book.id}-L.jpg`,
      `https://covers.openlibrary.org/b/key/works/${book.id}-L.jpg`
    ];
    
    // Find the next format to try
    const currentIndex = formats.findIndex(format => format === currentSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < formats.length) {
      console.log(`Trying format ${nextIndex + 1}: ${formats[nextIndex]}`);
      img.src = formats[nextIndex];
      img.onerror = (e) => handleBookImageError(e, book);
      return;
    }
    
    // Final fallback to placeholder
    console.log(`Using placeholder for: ${book.title}`);
    img.src = PLACEHOLDER_IMAGES.GENERIC_BOOK;
    img.onerror = null; // Stop trying
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="star-icon filled" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="star-icon half-filled">
          <StarIcon className="star-base" />
          <StarIcon className="star-fill" />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="star-icon empty" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <section className="featured-books-section">
        <div className="featured-books-loading">
          <div className="loading-spinner"></div>
          <p>Discovering amazing books for you...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-books-section">
        <div className="featured-books-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-books-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="featured-books-header"
      >
        <h2 className="featured-books-title">Featured Books</h2>
        <p className="featured-books-subtitle">
          Handpicked selections from our community of readers and literary experts
        </p>
      </motion.div>

      <div className="featured-books-grid enhanced-featured-grid">
        <AnimatePresence>
          {books.map((book, index) => (
            <motion.div
              key={`featured-${book.id || book.key || book.title}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }}
              className="featured-book-card enhanced-featured-card"
            >
              {/* Featured Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ Featured
                </span>
              </div>

              {/* Book Cover Section */}
              <div className="p-6 flex justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <SimpleBookCover
                  book={book}
                  size="large"
                  showOverlay={true}
                  onClick={() => handleQuickView(book.id)}
                  className="drop-shadow-lg"
                />
              </div>

              {/* Enhanced Book Information */}
              <motion.div 
                className="featured-book-info enhanced-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.3 }}
              >
                <h3 className="featured-book-title">
                  {book.title && book.title.length > 35 ? 
                    `${book.title.substring(0, 35)}...` : 
                    book.title || 'Featured Book'
                  }
                </h3>
                
                <p className="featured-book-author">
                  by {book.authorName || book.author || 'Unknown Author'}
                </p>
                
                {/* Enhanced Rating Display */}
                {book.rating && (
                  <div className="featured-book-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i}
                          className={`star ${i < Math.floor(parseFloat(book.rating)) ? 'filled' : 'empty'}`}
                        />
                      ))}
                    </div>
                    <span className="rating-value">
                      {typeof book.rating === 'string' ? book.rating : book.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                
                {/* Genre and Reviews */}
                <div className="featured-book-meta">
                  {book.genre && (
                    <motion.span 
                      className="featured-book-genre"
                      whileHover={{ scale: 1.05 }}
                    >
                      {book.genre}
                    </motion.span>
                  )}
                  
                  {book.reviews && (
                    <span className="featured-book-reviews">
                      {book.reviews} reviews
                    </span>
                  )}
                </div>
                
                {/* Enhanced Description */}
                <p className="featured-book-desc">
                  {book.description && book.description.length > 80 
                    ? `${book.description.substring(0, 80).replace(/\s+\S*$/, '')}...` 
                    : book.description || 'Discover this amazing featured book and dive into its captivating story.'
                  }
                </p>
                
                {/* Call to Action */}
                <motion.button
                  className="featured-book-cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickView(book.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeIcon className="cta-icon" />
                  Read More
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedBooks;