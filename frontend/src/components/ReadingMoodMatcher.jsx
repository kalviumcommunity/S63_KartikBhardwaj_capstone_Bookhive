import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodBasedBooks } from '../utils/fallbackData';
import { backendAPI } from '../utils/axiosConfig';
import '../styles/ReadingMoodMatcher.css';

// BookCoverImage component with robust fallback system
const BookCoverImage = ({ book, selectedMoodObj, className }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Create comprehensive list of image URLs to try, prioritizing OpenLibrary covers
  const imageUrls = [
    // First try the provided cover URLs (likely from OpenLibrary)
    book.coverUrl,
    book.largeCoverUrl,
    // Then try all the cover options (OpenLibrary covers from detailed search)
    ...(book.coverOptions || []),
    // Additional OpenLibrary fallbacks if ISBN is available
    book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null,
    book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : null,
    // Only use non-OpenLibrary fallbacks if no real covers are available
    !book.hasOpenLibraryCover ? `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title.substring(0, 20))}&size=300&background=${selectedMoodObj?.color?.replace('#', '') || '667eea'}&color=fff&bold=true&format=png` : null,
    !book.hasOpenLibraryCover ? `https://via.placeholder.com/300x450/${selectedMoodObj?.color?.replace('#', '') || '4F46E5'}/ffffff?text=${encodeURIComponent(book.title.substring(0, 15).replace(/\s+/g, '+'))}` : null
  ].filter(Boolean); // Remove any null/undefined URLs
  
  const handleImageError = () => {
    console.log(`Image failed to load: ${imageUrls[currentImageIndex]}`);
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${imageUrls[currentImageIndex]}`);
    setImageLoaded(true);
    setImageError(false);
  };
  
  const currentImageUrl = imageUrls[currentImageIndex];
  
  if (imageError || !currentImageUrl) {
    // Final fallback: Custom styled div with book info
    return (
      <div className={`${className} book-cover-fallback`} style={{
        '--mood-gradient': selectedMoodObj?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)'
      }}>
        <div className="fallback-content">
          <div className="book-icon">📚</div>
          <div className="book-title-short">{book.title.substring(0, 30)}</div>
          <div className="book-author-short">{book.author}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="book-image-container" style={{ position: 'relative' }}>
      <img 
        src={currentImageUrl}
        alt={`Cover of ${book.title}`}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!imageLoaded && (
        <div className={`${className} book-cover-fallback`} style={{
          '--mood-gradient': selectedMoodObj?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
          position: 'absolute',
          top: 0,
          left: 0
        }}>
          <div className="fallback-content">
            <div className="book-icon">📚</div>
            <div className="book-title-short">{book.title.substring(0, 30)}</div>
            <div className="book-author-short">{book.author}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReadingMoodMatcher = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial');
  const moodContainerRef = useRef(null);
  
  // Define moods with corresponding book genres/subjects and colors
  const moods = [
    { 
      id: 'happy', 
      label: 'Happy & Uplifting', 
      emoji: '😊', 
      genres: ['humor', 'comedy', 'inspirational', 'self_help'],
      color: '#FFD166',
      gradient: 'linear-gradient(135deg, #FFD166, #FF9A3C)',
      description: 'Feel-good books that lift your spirits'
    },
    { 
      id: 'relaxed', 
      label: 'Calm & Relaxed', 
      emoji: '😌', 
      genres: ['poetry', 'nature', 'mindfulness', 'meditation'],
      color: '#06D6A0',
      gradient: 'linear-gradient(135deg, #06D6A0, #1B9AAA)',
      description: 'Peaceful reads for quiet moments'
    },
    { 
      id: 'adventurous', 
      label: 'Adventurous', 
      emoji: '🤠', 
      genres: ['adventure', 'action', 'travel', 'exploration'],
      color: '#EF476F',
      gradient: 'linear-gradient(135deg, #EF476F, #F78C6B)',
      description: 'Thrilling journeys and exciting quests'
    },
    { 
      id: 'romantic', 
      label: 'Romantic', 
      emoji: '❤️', 
      genres: ['romance', 'love_stories', 'contemporary_romance'],
      color: '#F25CAF',
      gradient: 'linear-gradient(135deg, #F25CAF, #B185DB)',
      description: 'Love stories that warm your heart'
    },
    { 
      id: 'mysterious', 
      label: 'Mysterious', 
      emoji: '🔍', 
      genres: ['mystery', 'thriller', 'detective', 'crime'],
      color: '#118AB2',
      gradient: 'linear-gradient(135deg, #118AB2, #073B4C)',
      description: 'Puzzles and secrets to unravel'
    },
    { 
      id: 'thoughtful', 
      label: 'Thoughtful', 
      emoji: '🤔', 
      genres: ['philosophy', 'psychology', 'science', 'non_fiction'],
      color: '#7678ED',
      gradient: 'linear-gradient(135deg, #7678ED, #3D348B)',
      description: 'Deep thinking and intellectual exploration'
    },
    { 
      id: 'fantasy', 
      label: 'Escape Reality', 
      emoji: '🧙‍♂️', 
      genres: ['fantasy', 'science_fiction', 'magic', 'supernatural'],
      color: '#9C6ADE',
      gradient: 'linear-gradient(135deg, #9C6ADE, #6247AA)',
      description: 'Magical worlds and otherworldly adventures'
    },
    { 
      id: 'motivated', 
      label: 'Motivated', 
      emoji: '💪', 
      genres: ['self_help', 'business', 'productivity', 'success'],
      color: '#F79824',
      gradient: 'linear-gradient(135deg, #F79824, #F15A29)',
      description: 'Inspiring reads to fuel your ambition'
    },
  ];

  // Function to fetch books based on selected mood
  const fetchBooksByMood = async (mood) => {
    console.log('fetchBooksByMood called with mood:', mood);
    setLoading(true);
    try {
      // Find the selected mood object
      const selectedMoodObj = moods.find(m => m.id === mood);
      if (!selectedMoodObj) {
        throw new Error('Invalid mood selected');
      }

      // First try to get AI-powered recommendations
      try {
        console.log(`Getting AI recommendations for mood: ${selectedMoodObj.label}`);
        const aiResponse = await backendAPI.post('/api/ai/mood-recommendations', {
          mood: selectedMoodObj.label
        });
        
        // If AI recommendations are successful, use them
        if (aiResponse.data && aiResponse.data.recommendations) {
          console.log('AI recommendations received:', aiResponse.data.recommendations);
          
          // Convert AI recommendations to the format expected by the component
          const aiBooks = await Promise.all(aiResponse.data.recommendations.map(async (book, index) => {
            console.log(`Processing AI book ${index + 1}: ${book.title} by ${book.author}`);
            
            // Try to find actual OpenLibrary covers for AI recommendations
            const coverOptions = [];
            
            // Search OpenLibrary for this book to get real covers
            try {
              const searchQuery = encodeURIComponent(`${book.title} ${book.author}`);
              const searchResponse = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}&limit=3`);
              
              if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                
                if (searchData.docs && searchData.docs.length > 0) {
                  // Find the best match (first result is usually most relevant)
                  const bestMatch = searchData.docs[0];
                  
                  // Add covers from search results
                  if (bestMatch.cover_i) {
                    coverOptions.push(`https://covers.openlibrary.org/b/id/${bestMatch.cover_i}-L.jpg`);
                    coverOptions.push(`https://covers.openlibrary.org/b/id/${bestMatch.cover_i}-M.jpg`);
                    console.log(`Found OpenLibrary cover for AI book ${book.title}: ${bestMatch.cover_i}`);
                  }
                  
                  // Add ISBN-based covers
                  if (bestMatch.isbn && bestMatch.isbn.length > 0) {
                    bestMatch.isbn.slice(0, 2).forEach(isbn => {
                      coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
                      coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
                    });
                    console.log(`Found ISBNs for AI book ${book.title}:`, bestMatch.isbn.slice(0, 2));
                  }
                  
                  // Update the book key to use the actual OpenLibrary work ID
                  if (bestMatch.key) {
                    book.openLibraryKey = bestMatch.key;
                  }
                }
              }
            } catch (searchError) {
              console.log(`Could not search OpenLibrary for AI book ${book.title}:`, searchError.message);
            }
            
            // Add original AI cover if provided
            if (book.coverUrl) {
              coverOptions.unshift(book.coverUrl);
            }
            
            // Remove duplicates and filter OpenLibrary covers
            const uniqueOpenLibraryCovers = [...new Set(coverOptions)].filter(url => url && url.includes('covers.openlibrary.org'));
            
            // Only add fallbacks if no real covers found
            if (uniqueOpenLibraryCovers.length === 0) {
              console.log(`No OpenLibrary covers found for AI book ${book.title}, using fallbacks`);
              const titleEncoded = encodeURIComponent(book.title.substring(0, 20));
              const colorHex = selectedMoodObj?.color?.replace('#', '') || '667eea';
              
              uniqueOpenLibraryCovers.push(
                `https://ui-avatars.com/api/?name=${titleEncoded}&size=300&background=${colorHex}&color=fff&bold=true&format=png`,
                `https://via.placeholder.com/300x450/${colorHex}/ffffff?text=${titleEncoded}`
              );
            }
            
            const finalCoverOptions = book.coverUrl ? [book.coverUrl, ...uniqueOpenLibraryCovers] : uniqueOpenLibraryCovers;
            
            return {
              title: book.title,
              author: book.author,
              key: book.openLibraryKey || `/works/ai-book-${index}`,
              coverUrl: finalCoverOptions[0],
              largeCoverUrl: finalCoverOptions[0],
              coverOptions: finalCoverOptions,
              description: book.description,
              reason: book.reason,
              genre: book.genre,
              isFallback: aiResponse.data.isFallback,
              rating: book.rating || '4.0',
              publishYear: book.publishYear || '2023',
              firstPublishYear: book.publishYear || '2023',
              mood: selectedMoodObj.label,
              // Add metadata
              hasOpenLibraryCover: uniqueOpenLibraryCovers.some(url => url.includes('covers.openlibrary.org')),
              totalCoverOptions: finalCoverOptions.length
            };
          }));
          
          if (aiBooks && aiBooks.length > 0) {
            setRecommendedBooks(aiBooks);
            setLoading(false);
            return;
          }
        }
      } catch (aiError) {
        console.error('AI recommendations failed, falling back to API:', aiError);
      }

      // Fallback to the original Open Library API method
      console.log('Falling back to Open Library API');
      const randomGenre = selectedMoodObj.genres[Math.floor(Math.random() * selectedMoodObj.genres.length)];
      
      const response = await fetch(
        `https://openlibrary.org/subjects/${randomGenre}.json?limit=12`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.works || !Array.isArray(data.works) || data.works.length === 0) {
        throw new Error('No books found for this mood');
      }

      // Process the response data with robust OpenLibrary cover URL handling
      const books = await Promise.all(data.works.map(async (book, index) => {
        console.log(`Processing book ${index + 1}: ${book.title}`);
        
        // Create a comprehensive list of OpenLibrary cover URL options
        const coverOptions = [];
        
        // Method 1: Use cover_id from the book data (most reliable)
        if (book.cover_id) {
          coverOptions.push(`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`);
          coverOptions.push(`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`);
          console.log(`Found cover_id for ${book.title}: ${book.cover_id}`);
        }
        
        // Method 2: Use ISBN if available (very reliable)
        if (book.isbn && book.isbn.length > 0) {
          book.isbn.slice(0, 3).forEach(isbn => {
            coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
            coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
          });
          console.log(`Found ISBNs for ${book.title}:`, book.isbn.slice(0, 3));
        }
        
        // Method 3: Use OCLC if available
        if (book.oclc && book.oclc.length > 0) {
          coverOptions.push(`https://covers.openlibrary.org/b/oclc/${book.oclc[0]}-L.jpg`);
          coverOptions.push(`https://covers.openlibrary.org/b/oclc/${book.oclc[0]}-M.jpg`);
          console.log(`Found OCLC for ${book.title}: ${book.oclc[0]}`);
        }
        
        // Method 4: Try to get cover from work key (OpenLibrary ID)
        if (book.key) {
          const workId = book.key.replace('/works/', '');
          coverOptions.push(`https://covers.openlibrary.org/b/olid/${workId}-L.jpg`);
          coverOptions.push(`https://covers.openlibrary.org/b/olid/${workId}-M.jpg`);
          console.log(`Using work ID for ${book.title}: ${workId}`);
        }
        
        // Method 5: Try to fetch additional book details for more cover options
        try {
          const bookDetailsResponse = await fetch(`https://openlibrary.org${book.key}.json`);
          if (bookDetailsResponse.ok) {
            const bookDetails = await bookDetailsResponse.json();
            
            // Check for covers array in book details
            if (bookDetails.covers && bookDetails.covers.length > 0) {
              bookDetails.covers.forEach(coverId => {
                coverOptions.unshift(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
                coverOptions.unshift(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`);
              });
              console.log(`Found additional covers for ${book.title}:`, bookDetails.covers);
            }
          }
        } catch (detailsError) {
          console.log(`Could not fetch additional details for ${book.title}:`, detailsError.message);
        }
        
        // Method 6: Search for editions to get more ISBN/cover options
        try {
          const editionsResponse = await fetch(`https://openlibrary.org${book.key}/editions.json?limit=5`);
          if (editionsResponse.ok) {
            const editionsData = await editionsResponse.json();
            
            if (editionsData.entries && editionsData.entries.length > 0) {
              editionsData.entries.forEach(edition => {
                // Add covers from editions
                if (edition.covers && edition.covers.length > 0) {
                  edition.covers.forEach(coverId => {
                    coverOptions.unshift(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
                    coverOptions.unshift(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`);
                  });
                }
                
                // Add ISBN covers from editions
                if (edition.isbn_13 && edition.isbn_13.length > 0) {
                  edition.isbn_13.slice(0, 2).forEach(isbn => {
                    coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
                    coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
                  });
                }
                
                if (edition.isbn_10 && edition.isbn_10.length > 0) {
                  edition.isbn_10.slice(0, 2).forEach(isbn => {
                    coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
                    coverOptions.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
                  });
                }
              });
              console.log(`Found ${editionsData.entries.length} editions for ${book.title}`);
            }
          }
        } catch (editionsError) {
          console.log(`Could not fetch editions for ${book.title}:`, editionsError.message);
        }
        
        // Remove duplicates and filter out invalid URLs
        const uniqueCoverOptions = [...new Set(coverOptions)].filter(url => url && url.includes('covers.openlibrary.org'));
        
        // Only add fallbacks if no OpenLibrary covers found
        if (uniqueCoverOptions.length === 0) {
          console.log(`No OpenLibrary covers found for ${book.title}, using fallbacks`);
          const titleForAvatar = encodeURIComponent(book.title.substring(0, 20));
          const colorHex = selectedMoodObj?.color?.replace('#', '') || '4F46E5';
          uniqueCoverOptions.push(
            `https://ui-avatars.com/api/?name=${titleForAvatar}&size=300&background=${colorHex}&color=fff&bold=true&format=png`,
            `https://via.placeholder.com/300x450/${colorHex}/ffffff?text=${encodeURIComponent(book.title.substring(0, 20).replace(/\s+/g, '+'))}`
          );
        }
        
        // Use the first available option
        const primaryCover = uniqueCoverOptions[0];
        console.log(`Primary cover for ${book.title}: ${primaryCover}`);
        
        const bookData = {
          title: book.title,
          author: book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author',
          key: book.key,
          coverUrl: primaryCover,
          largeCoverUrl: primaryCover,
          coverOptions: uniqueCoverOptions, // Store all OpenLibrary options for fallback
          firstPublishYear: book.first_publish_year,
          rating: (Math.random() * 2 + 3).toFixed(1),
          genre: randomGenre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `A captivating ${randomGenre.replace('_', ' ')} book that will keep you engaged from start to finish.`,
          isbn: book.isbn?.[0] || null,
          oclc: book.oclc?.[0] || null,
          subjects: book.subject || [],
          mood: selectedMoodObj.label,
          // Add metadata for debugging
          totalCoverOptions: uniqueCoverOptions.length,
          hasOpenLibraryCover: uniqueCoverOptions.some(url => url.includes('covers.openlibrary.org'))
        };
        
        // Debug logging for image URLs
        console.log(`Book: ${bookData.title}`);
        console.log(`- Total cover options: ${uniqueCoverOptions.length}`);
        console.log(`- Has OpenLibrary covers: ${bookData.hasOpenLibraryCover}`);
        console.log(`- Primary cover: ${primaryCover}`);
        
        return bookData;
      }));

      if (books.length > 0) {
        setRecommendedBooks(books);
      } else {
        throw new Error('Could not process book data');
      }
    } catch (error) {
      console.error('Error fetching mood-based books:', error);
      // Use fallback data if API fails
      const fallbackBooks = getMoodBasedBooks(mood);
      setRecommendedBooks(fallbackBooks);
      console.log('Using fallback books:', fallbackBooks);
    } finally {
      console.log('fetchBooksByMood completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    console.log('Mood selected:', mood);
    
    // Validate mood selection
    const moodObj = moods.find(m => m.id === mood);
    if (!moodObj) {
      console.error('Invalid mood selected:', mood);
      return;
    }
    
    // Set the mood immediately
    setSelectedMood(mood);
    setAnimationPhase('transition');
    
    // Clear any previous results
    setRecommendedBooks([]);
    
    // Show results and start fetching books
    setTimeout(() => {
      setShowResults(true);
      setAnimationPhase('loading');
      fetchBooksByMood(mood);
    }, 800);
  };

  const handleBookClick = (book) => {
    try {
      // Extract the work ID from the key
      const workId = book.key.replace('/works/', '');
      
      // Navigate to the book details page with the book data and scroll to reviews
      navigate(`/book/${workId}`, { 
        state: { 
          book,
          scrollToReviews: true, // Flag to scroll to reviews section
          fromMoodMatcher: true // Flag to indicate source
        } 
      });
    } catch (error) {
      console.error('Error handling book click:', error);
      // Fallback navigation
      navigate('/books');
    }
  };

  const resetMatcher = () => {
    setAnimationPhase('resetting');
    
    setTimeout(() => {
      setSelectedMood('');
      setRecommendedBooks([]);
      setShowResults(false);
      setAnimationPhase('initial');
    }, 600);
  };

  // Get the selected mood object
  const selectedMoodObj = moods.find(m => m.id === selectedMood);
  
  // Helper function to get mood display name
  const getMoodDisplayName = () => {
    if (selectedMoodObj?.label) {
      return selectedMoodObj.label;
    }
    return 'Your Mood';
  };

  return (
    <div 
      className={`reading-mood-matcher ${animationPhase}`}
      style={selectedMoodObj ? {
        '--mood-color': selectedMoodObj.color,
        '--mood-gradient': selectedMoodObj.gradient
      } : {}}
    >
      {/* Header Section */}
      <div className="mood-matcher-header">
        <h1>📚 Mood-Based Book Recommendations</h1>
        <p>Discover your next favorite book based on how you're feeling right now!</p>
      </div>

      {!showResults ? (
        /* Mood Selection Grid */
        <div className={`mood-selection ${animationPhase === 'transition' ? 'fade-out' : ''}`}>
          <h2>How are you feeling today?</h2>
          <div className="mood-grid">
            {moods.map((mood, index) => (
              <div
                key={mood.id}
                className={`mood-card ${selectedMood === mood.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood.id)}
                style={{
                  '--mood-color': mood.color,
                  '--mood-gradient': mood.gradient,
                  '--animation-delay': `${index * 0.1}s`
                }}
              >
                <div className="mood-emoji">{mood.emoji}</div>
                <h3 className="mood-label">{mood.label}</h3>
                <p className="mood-description">{mood.description}</p>
                <div className="mood-card-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className={`mood-results ${animationPhase}`}>
          {/* Results Header */}
          <div className="results-header">
            <div className="selected-mood-display">
              <div className="mood-info">
                <span className="mood-emoji-large">{selectedMoodObj?.emoji}</span>
                <div className="mood-text">
                  <h2>Perfect Books for Your <span className="mood-name">{getMoodDisplayName()}</span> Mood</h2>
                  <p>{selectedMoodObj?.description}</p>
                </div>
              </div>
              <button className="back-button" onClick={resetMatcher}>
                <span>←</span> Choose Different Mood
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-section">
              <div className="loading-animation">
                <div className="book-loading">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="loading-book" style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="book-spine"></div>
                    </div>
                  ))}
                </div>
                <h3>Finding perfect books for you...</h3>
                <p>Curating the best {getMoodDisplayName().toLowerCase()} books</p>
              </div>
            </div>
          ) : (
            /* Books Grid */
            <div className="books-section">
              {recommendedBooks && recommendedBooks.length > 0 ? (
                <>
                  <div className="books-header">
                    <div className="books-category-info">
                      <div className="category-icon">{selectedMoodObj?.emoji}</div>
                      <div className="category-text">
                        <h3>{selectedMoodObj?.label} Books Collection</h3>
                        <p>{recommendedBooks.length} carefully curated books for your {getMoodDisplayName().toLowerCase()} mood</p>
                      </div>
                    </div>
                    <div className="books-stats">
                      <div className="stat-item">
                        <span className="stat-number">{recommendedBooks.length}</span>
                        <span className="stat-label">Books</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{selectedMoodObj?.genres?.length || 0}</span>
                        <span className="stat-label">Genres</span>
                      </div>
                    </div>
                  </div>
                  <div className="books-grid">
                    {recommendedBooks.map((book, index) => (
                      <div 
                        key={`${book.key}-${index}`}
                        className="book-card"
                        onClick={() => handleBookClick(book)}
                        style={{ '--animation-delay': `${index * 0.1}s` }}
                      >
                        <div className="book-cover-wrapper">
                          <BookCoverImage 
                            book={book}
                            selectedMoodObj={selectedMoodObj}
                            className="book-cover-image"
                          />
                          <div className="book-overlay">
                            <div className="book-actions">
                              <button className="view-book-btn">
                                ⭐ Read & Review
                              </button>
                            </div>
                          </div>
                          {/* Book category badge */}
                          <div className="book-category-badge">
                            {selectedMoodObj?.emoji} {selectedMoodObj?.label}
                          </div>
                          
                          {/* OpenLibrary cover indicator */}
                          {book.hasOpenLibraryCover && (
                            <div className="openlibrary-badge" title="Actual book cover from OpenLibrary">
                              📚 Real Cover
                            </div>
                          )}
                        </div>
                        
                        <div className="book-info">
                          <h4 className="book-title">{book.title}</h4>
                          <p className="book-author">by {book.author}</p>
                          
                          <div className="book-meta">
                            {book.rating && (
                              <div className="book-rating">
                                <span className="stars">⭐</span>
                                <span>{book.rating}</span>
                              </div>
                            )}
                            {(book.firstPublishYear || book.publishYear) && (
                              <div className="book-year">
                                📅 {book.firstPublishYear || book.publishYear}
                              </div>
                            )}
                          </div>

                          {book.genre && (
                            <div className="book-genre-tag">
                              {book.genre}
                            </div>
                          )}

                          {book.reason && (
                            <div className="book-reason">
                              <strong>Why it matches:</strong> {book.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-books-found">
                  <div className="no-books-icon">📚</div>
                  <h3>No books found</h3>
                  <p>Sorry, we couldn't find books for this mood. Please try a different mood.</p>
                  <button className="try-again-btn" onClick={resetMatcher}>
                    Try Another Mood
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingMoodMatcher;