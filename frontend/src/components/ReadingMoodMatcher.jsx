import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodBasedBooks } from '../utils/fallbackData';
import '../styles/ReadingMoodMatcher.css';

const ReadingMoodMatcher = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial');
  const moodContainerRef = useRef(null);
  
  // Add a class to the body when showing results
  useEffect(() => {
    if (showResults) {
      document.body.classList.add('showing-mood-results');
    } else {
      document.body.classList.remove('showing-mood-results');
    }
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('showing-mood-results');
    };
  }, [showResults]);

  // Define moods with corresponding book genres/subjects and colors
  const moods = [
    { 
      id: 'happy', 
      label: 'Happy & Uplifting', 
      emoji: '😊', 
      genres: ['humor', 'comedy', 'inspirational'],
      color: '#FFD166',
      gradient: 'linear-gradient(135deg, #FFD166, #FF9A3C)'
    },
    { 
      id: 'relaxed', 
      label: 'Calm & Relaxed', 
      emoji: '😌', 
      genres: ['poetry', 'nature', 'mindfulness'],
      color: '#06D6A0',
      gradient: 'linear-gradient(135deg, #06D6A0, #1B9AAA)'
    },
    { 
      id: 'adventurous', 
      label: 'Adventurous', 
      emoji: '🤠', 
      genres: ['adventure', 'action', 'travel'],
      color: '#EF476F',
      gradient: 'linear-gradient(135deg, #EF476F, #F78C6B)'
    },
    { 
      id: 'romantic', 
      label: 'Romantic', 
      emoji: '❤️', 
      genres: ['romance', 'love_stories'],
      color: '#F25CAF',
      gradient: 'linear-gradient(135deg, #F25CAF, #B185DB)'
    },
    { 
      id: 'mysterious', 
      label: 'Mysterious', 
      emoji: '🔍', 
      genres: ['mystery', 'thriller', 'detective'],
      color: '#118AB2',
      gradient: 'linear-gradient(135deg, #118AB2, #073B4C)'
    },
    { 
      id: 'thoughtful', 
      label: 'Thoughtful', 
      emoji: '🤔', 
      genres: ['philosophy', 'psychology', 'science'],
      color: '#7678ED',
      gradient: 'linear-gradient(135deg, #7678ED, #3D348B)'
    },
    { 
      id: 'fantasy', 
      label: 'Escape Reality', 
      emoji: '🧙‍♂️', 
      genres: ['fantasy', 'science_fiction', 'magic'],
      color: '#9C6ADE',
      gradient: 'linear-gradient(135deg, #9C6ADE, #6247AA)'
    },
    { 
      id: 'motivated', 
      label: 'Motivated', 
      emoji: '💪', 
      genres: ['self_help', 'business', 'productivity'],
      color: '#F79824',
      gradient: 'linear-gradient(135deg, #F79824, #F15A29)'
    },
  ];

  // Function to fetch books based on selected mood
  const fetchBooksByMood = async (mood) => {
    setLoading(true);
    try {
      // Find the selected mood object
      const selectedMoodObj = moods.find(m => m.id === mood);
      if (!selectedMoodObj) {
        throw new Error('Invalid mood selected');
      }

      // Randomly select one genre from the mood's genres
      const randomGenre = selectedMoodObj.genres[Math.floor(Math.random() * selectedMoodObj.genres.length)];
      
      // Use fetch instead of axios to avoid potential CORS issues
      const response = await fetch(
        `https://openlibrary.org/subjects/${randomGenre}.json?limit=8`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.works || !Array.isArray(data.works) || data.works.length === 0) {
        throw new Error('No books found for this mood');
      }

      // Process the response data
      const books = data.works.map(book => ({
        title: book.title,
        author: book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author',
        key: book.key,
        coverUrl: book.cover_id 
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` 
          : '/default-book-cover.jpg',
        largeCoverUrl: book.cover_id 
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` 
          : '/default-book-cover.jpg',
        firstPublishYear: book.first_publish_year
      }));

      if (books.length > 0) {
        setRecommendedBooks(books);
        setAnimationPhase('results');
      } else {
        // Fallback if no books were processed correctly
        throw new Error('Could not process book data');
      }
    } catch (error) {
      console.error('Error fetching mood-based books:', error);
      // Use fallback data if API fails
      setRecommendedBooks(getMoodBasedBooks(mood));
      setAnimationPhase('results');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setAnimationPhase('transition');
    
    // Add a slight delay before showing results to allow for animation
    setTimeout(() => {
      setShowResults(true);
      fetchBooksByMood(mood);
    }, 1000);
  };

  const handleBookClick = (book) => {
    try {
      // Extract the work ID from the key
      const workId = book.key.replace('/works/', '');
      
      // Navigate to the book details page with the book data
      navigate(`/book/${workId}`, { state: { book } });
    } catch (error) {
      console.error('Error handling book click:', error);
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

  return (
    <div 
      className={`reading-mood-matcher ${animationPhase}`}
      style={selectedMoodObj ? {
        '--mood-color': selectedMoodObj.color,
        '--mood-gradient': selectedMoodObj.gradient
      } : {}}
    >
      <div className="mood-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="mood-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          ></div>
        ))}
      </div>

      <div className="mood-matcher-header">
        <h2>Find My Perfect Books</h2>
        <p>How are you feeling today? Let us recommend the perfect books that match your current mood!</p>
        <div className="mood-matcher-decoration">
          <span className="decoration-dot"></span>
          <span className="decoration-dot"></span>
          <span className="decoration-dot"></span>
        </div>
      </div>

      {!showResults ? (
        <div className={`mood-selection ${animationPhase === 'transition' ? 'fade-out' : ''}`} ref={moodContainerRef}>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className={`mood-card ${selectedMood === mood.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood.id)}
                style={{
                  '--mood-color': mood.color,
                  '--mood-gradient': mood.gradient
                }}
              >
                <div className="mood-emoji">{mood.emoji}</div>
                <div className="mood-label">{mood.label}</div>
                <div className="mood-card-glow"></div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`mood-results ${animationPhase}`}>
          <div className="results-header">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
              Perfect Books for Your <span className="mood-highlight">{moods.find(m => m.id === selectedMood)?.label}</span> Mood
            </h3>
            <button className="reset-button" onClick={resetMatcher}>
              <span className="reset-icon">↺</span>
              <span>Try Another Mood</span>
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner">
                <div className="spinner-inner"></div>
              </div>
              <p>Finding the perfect books for your <span className="mood-highlight">{moods.find(m => m.id === selectedMood)?.label}</span> mood...</p>
              <div className="loading-books-animation">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="loading-book" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="recommended-books">
              {recommendedBooks.map((book, index) => (
                <div 
                  key={index} 
                  className="recommended-book-card"
                  onClick={() => handleBookClick(book)}
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="book-cover-container">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="book-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-book-cover.jpg';
                      }}
                      loading="lazy"
                    />
                    <div className="book-hover-info">
                      <span className="view-details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="book-info">
                    <div>
                      <h4 className="book-title">{book.title}</h4>
                      <p className="book-author">by {book.author}</p>
                    </div>
                    <div>
                      {book.firstPublishYear && (
                        <p className="book-year">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                          </svg>
                          {book.firstPublishYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingMoodMatcher;