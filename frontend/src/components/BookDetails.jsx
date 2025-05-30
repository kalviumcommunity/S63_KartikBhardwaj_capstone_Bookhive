import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getFallbackWorks } from '../utils/fallbackData';
import { generateAmazonLink } from '../utils/affiliateLinks';
import LoadingAvatar from './LoadingAvatar';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  // Check if book data was passed via location state
  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        // Add a minimum delay to ensure loading avatar is visible
        const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
        
        // If we have book data in location state, use it
        if (location.state && location.state.book) {
          // Wait for minimum delay to ensure loading avatar is visible
          await minDelay;
          
          setBook(location.state.book);
          // Fetch additional details if needed
          await fetchAdditionalDetails(location.state.book);
        } else if (workId) {
          // Otherwise fetch from API
          const [_, response] = await Promise.all([
            minDelay, // Wait for minimum delay
            fetch(`https://openlibrary.org/works/${workId}.json`)
          ]);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch book details: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Get author information
          let authorName = 'Unknown Author';
          if (data.authors && data.authors.length > 0) {
            const authorKey = data.authors[0].author.key;
            const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              authorName = authorData.name || 'Unknown Author';
            }
          }
          
          // Format book data
          const bookData = {
            key: `/works/${workId}`,
            title: data.title,
            author: authorName,
            coverUrl: data.covers && data.covers.length > 0 
              ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
              : '/default-book-cover.jpg',
            largeCoverUrl: data.covers && data.covers.length > 0 
              ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
              : '/default-book-cover.jpg',
            description: data.description?.value || data.description || 'No description available.',
            firstPublishYear: data.first_publish_date || 'Unknown',
            subjects: data.subjects || []
          };
          
          setBook(bookData);
          await fetchAdditionalDetails(bookData);
        } else {
          throw new Error('No book ID provided');
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [workId, location.state]);

  // Fetch additional book details like reviews and related books
  const fetchAdditionalDetails = async (bookData) => {
    try {
      // Simulate fetching reviews (would be a real API call in production)
      setReviews(generateMockReviews(bookData.title));
      
      // Fetch related books based on subjects or author
      if (bookData.subjects && bookData.subjects.length > 0) {
        const randomSubject = bookData.subjects[Math.floor(Math.random() * bookData.subjects.length)];
        try {
          const response = await fetch(`https://openlibrary.org/subjects/${randomSubject.toLowerCase().replace(/\\s+/g, '_')}.json?limit=4`);
          if (response.ok) {
            const data = await response.json();
            const relatedBooksData = data.works.map(book => ({
              title: book.title,
              author: book.authors?.[0]?.name || 'Unknown Author',
              key: book.key,
              coverUrl: book.cover_id 
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` 
                : '/default-book-cover.jpg',
              firstPublishYear: book.first_publish_year
            }));
            setRelatedBooks(relatedBooksData);
          } else {
            throw new Error('Failed to fetch related books');
          }
        } catch (error) {
          console.error('Error fetching related books:', error);
          // Use fallback related books
          setRelatedBooks(getFallbackWorks(bookData.author).slice(0, 3));
        }
      } else {
        // Use fallback related books
        setRelatedBooks(getFallbackWorks(bookData.author).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching additional details:', error);
    }
  };

  // Generate mock reviews for demonstration
  const generateMockReviews = (bookTitle) => {
    return [
      {
        id: 1,
        user: 'BookLover42',
        rating: 4.5,
        date: '2023-10-15',
        content: `I thoroughly enjoyed ${bookTitle}. The character development was exceptional, and the plot kept me engaged from start to finish. Highly recommended for anyone who enjoys this genre.`
      },
      {
        id: 2,
        user: 'LiteraryExplorer',
        rating: 5,
        date: '2023-09-22',
        content: `${bookTitle} is a masterpiece! The author's writing style is captivating, and the themes explored are both timely and timeless. This book will stay with you long after you've finished reading.`
      },
      {
        id: 3,
        user: 'CriticalReader',
        rating: 3.5,
        date: '2023-11-03',
        content: `While ${bookTitle} has its moments of brilliance, I found some parts to be slow-paced. The ending was satisfying, though, and overall it's worth reading if you're a fan of the author.`
      }
    ];
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full-star">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half-star">★</span>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
    }
    
    return stars;
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle related book click
  const handleRelatedBookClick = (relatedBook) => {
    const workId = relatedBook.key.replace('/works/', '');
    navigate(`/book/${workId}`, { state: { book: relatedBook } });
  };

  if (loading) {
    return (
      <LoadingAvatar 
        progress={50} 
        message="Loading book details..."
      />
    );
  }

  if (error) {
    return (
      <div className="simple-error-container">
        <div className="simple-error-icon">!</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button className="simple-error-btn" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="simple-error-container">
        <div className="simple-error-icon">?</div>
        <h2>Book Not Found</h2>
        <p>We couldn't find the book you're looking for.</p>
        <button className="simple-error-btn" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <button className="back-button" onClick={handleBack}>
        <span className="back-arrow">←</span> Back to Search
      </button>
      
      <div className="simple-book-layout">
        <div className="book-image-container">
          <img className="book-image" src={book.largeCoverUrl || book.coverUrl} alt={book.title} />
          
          <div className="book-quick-info">
            {book.firstPublishYear && (
              <div className="quick-info-item">
                <span className="quick-info-label">Published:</span> {book.firstPublishYear}
              </div>
            )}
            {reviews.length > 0 && (
              <div className="quick-info-item">
                <span className="quick-info-label">Rating:</span> {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}/5
              </div>
            )}
          </div>
        </div>
        
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>
          
          <div className="book-actions">
            <button className="action-btn primary">Add to Reading List</button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate(`/write-review/${workId}`)}
            >
              Write a Review
            </button>
            <a 
              href={generateAmazonLink(book.title, book.author)}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn amazon"
            >
              <span className="amazon-icon">🛒</span>
              Buy on Amazon
            </a>
          </div>
        </div>
      </div>
      
      <div className="book-tabs">
        <button 
          className={`book-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => handleTabChange('details')}
        >
          Details
        </button>
        <button 
          className={`book-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => handleTabChange('reviews')}
        >
          Reviews
        </button>
        <button 
          className={`book-tab ${activeTab === 'related' ? 'active' : ''}`}
          onClick={() => handleTabChange('related')}
        >
          Similar Books
        </button>
      </div>
      
      <div className="book-tab-content">
        {activeTab === 'details' && (
          <div className="details-section">
            {book.subjects && book.subjects.length > 0 && (
              <div className="book-subjects-container">
                <h3>Genres</h3>
                <div className="book-subjects">
                  {book.subjects.slice(0, 6).map((subject, index) => (
                    <span key={index} className="subject-tag">{subject}</span>
                  ))}
                </div>
              </div>
            )}
            
            {book.description && (
              <div className="book-description">
                <h3>About this Book</h3>
                <p>{book.description}</p>
              </div>
            )}
            
            <div className="author-section">
              <h3>About the Author</h3>
              <div className="author-info">
                <div className="author-avatar">
                  <span>{book.author.charAt(0)}</span>
                </div>
                <div className="author-details">
                  <h4>{book.author}</h4>
                  <button 
                    className="view-author-btn"
                    onClick={() => navigate(`/author/${encodeURIComponent(book.author)}`)}
                  >
                    View More Books
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.user}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating">
                        {renderStarRating(review.rating)}
                      </div>
                    </div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this book!</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'related' && (
          <div className="related-section">
            {relatedBooks.length > 0 ? (
              <div className="related-books-simple">
                {relatedBooks.slice(0, 4).map((relatedBook, index) => (
                  <div 
                    key={index} 
                    className="related-book-simple"
                    onClick={() => handleRelatedBookClick(relatedBook)}
                  >
                    <div className="related-book-cover-simple">
                      <img src={relatedBook.coverUrl} alt={relatedBook.title} />
                    </div>
                    <div className="related-book-info-simple">
                      <h4 className="related-book-title-simple">{relatedBook.title}</h4>
                      <p className="related-book-author-simple">{relatedBook.author}</p>
                      <a 
                        href={generateAmazonLink(relatedBook.title, relatedBook.author)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="related-book-amazon-link"
                        onClick={(e) => e.stopPropagation()} // Prevent triggering the parent onClick
                      >
                        <span>🛒</span> Buy on Amazon
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-related">
                <p>No similar books found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;