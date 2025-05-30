import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/ReviewRequestBoard.css';

// Mock data for review requests (replace with API calls in production)
const initialRequests = [
  {
    id: 1,
    bookTitle: "The Midnight Library",
    bookAuthor: "Matt Haig",
    coverUrl: "/images/book-covers/midnight-library.jpg",
    requestedBy: "bookworm42",
    upvotes: 24,
    dateRequested: "2023-11-15",
    fulfilled: false,
    description: "I've heard mixed reviews about this one. Would love to hear thoughts on the philosophical aspects."
  },
  {
    id: 2,
    bookTitle: "Project Hail Mary",
    bookAuthor: "Andy Weir",
    coverUrl: "/images/book-covers/project-hail-mary.jpg",
    requestedBy: "scifi_lover",
    upvotes: 18,
    dateRequested: "2023-11-20",
    fulfilled: false,
    description: "Is it as good as The Martian? Worth the read for a sci-fi fan?"
  },
  {
    id: 3,
    bookTitle: "Klara and the Sun",
    bookAuthor: "Kazuo Ishiguro",
    coverUrl: "/images/book-covers/fiction-book.jpg",
    requestedBy: "literary_mind",
    upvotes: 15,
    dateRequested: "2023-11-18",
    fulfilled: true,
    description: "Considering this for my book club. Need opinions on themes and pacing."
  },
  {
    id: 4,
    bookTitle: "The Four Winds",
    bookAuthor: "Kristin Hannah",
    coverUrl: "/images/book-covers/fiction-book.jpg",
    requestedBy: "history_buff",
    upvotes: 12,
    dateRequested: "2023-11-22",
    fulfilled: false,
    description: "How historically accurate is this? Is it emotionally heavy throughout?"
  }
];

const ReviewRequestBoard = () => {
  const [reviewRequests, setReviewRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bookTitle: '',
    bookAuthor: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'fulfilled'
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get('http://localhost:5001/api/review-requests');
        // setReviewRequests(response.data);
        
        // For now, use mock data
        setReviewRequests(initialRequests);
      } catch (error) {
        console.error('Error fetching review requests:', error);
        toast.error('Failed to load review requests');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewRequests();
  }, []);

  const handleUpvote = (id) => {
    if (!isAuthenticated()) {
      // Show login prompt
      toast.info("Please log in to upvote review requests");
      navigate('/login', { 
        state: { 
          from: '/review-requests',
          message: 'Please log in to upvote review requests'
        } 
      });
      return;
    }

    // In a real app, this would be an API call
    // try {
    //   await axios.post(`http://localhost:5001/api/review-requests/${id}/upvote`, {}, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    //   });
    // } catch (error) {
    //   console.error('Error upvoting request:', error);
    //   toast.error('Failed to upvote request');
    //   return;
    // }

    // For now, just update the state
    setReviewRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id ? { ...request, upvotes: request.upvotes + 1 } : request
      )
    );
    
    toast.success('Upvoted successfully!');
  };

  const handleFulfill = (id) => {
    if (!isAuthenticated()) {
      toast.info("Please log in to fulfill review requests");
      navigate('/login', { 
        state: { 
          from: '/review-requests',
          message: 'Please log in to fulfill review requests'
        } 
      });
      return;
    }

    // Find the request
    const request = reviewRequests.find(req => req.id === id);
    
    if (request) {
      // Navigate to write review page with request ID
      navigate(`/write-review/request-${id}`);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.info("Please log in to submit review requests");
      navigate('/login', { 
        state: { 
          from: '/review-requests',
          message: 'Please log in to submit review requests'
        } 
      });
      return;
    }

    // Validate form
    if (!newRequest.bookTitle || !newRequest.bookAuthor) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // In a real app, this would be an API call
      // const response = await axios.post('http://localhost:5001/api/review-requests', {
      //   bookTitle: newRequest.bookTitle,
      //   bookAuthor: newRequest.bookAuthor,
      //   description: newRequest.description
      // }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // const newRequestData = response.data;
      
      // For now, create a mock request
      const request = {
        id: reviewRequests.length + 1,
        bookTitle: newRequest.bookTitle,
        bookAuthor: newRequest.bookAuthor,
        description: newRequest.description,
        requestedBy: user ? user.username : "current_user",
        upvotes: 0,
        dateRequested: new Date().toISOString().split('T')[0],
        fulfilled: false,
        coverUrl: "/images/book-covers/default-book.jpg" // Default cover
      };

      // Add to list
      setReviewRequests([request, ...reviewRequests]);
      
      // Reset form
      setNewRequest({
        bookTitle: '',
        bookAuthor: '',
        description: ''
      });
      
      // Hide form
      setShowRequestForm(false);
      
      toast.success('Review request submitted successfully!');
    } catch (error) {
      console.error('Error submitting review request:', error);
      toast.error('Failed to submit review request');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter and search requests
  const filteredRequests = reviewRequests.filter(request => {
    // Apply search filter
    const matchesSearch = 
      request.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    if (filter === 'pending') return matchesSearch && !request.fulfilled;
    if (filter === 'fulfilled') return matchesSearch && request.fulfilled;
    return matchesSearch; // 'all' filter
  });

  // Sort by upvotes (highest first)
  const sortedRequests = [...filteredRequests].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <section className="review-request-board">
      <div className="request-board-header">
        <h2>Review Request Board</h2>
        <p>Help the community by reviewing books others are curious about</p>
      </div>

      <div className="request-board-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-container">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending Reviews</option>
              <option value="fulfilled">Fulfilled Reviews</option>
            </select>
          </div>
        </div>

        <button 
          className="request-review-btn"
          onClick={() => {
            if (!isAuthenticated()) {
              toast.info("Please log in to request reviews");
              navigate('/login', { 
                state: { 
                  from: '/review-requests',
                  message: 'Please log in to request reviews'
                } 
              });
              return;
            }
            setShowRequestForm(!showRequestForm);
          }}
        >
          {showRequestForm ? 'Cancel' : 'Request a Review'}
        </button>
      </div>

      {showRequestForm && (
        <div className="request-form-container">
          <form onSubmit={handleRequestSubmit} className="request-form">
            <h3>Request a Book Review</h3>
            
            <div className="form-group">
              <label htmlFor="bookTitle">Book Title *</label>
              <input
                type="text"
                id="bookTitle"
                name="bookTitle"
                value={newRequest.bookTitle}
                onChange={handleInputChange}
                required
                placeholder="Enter book title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bookAuthor">Author *</label>
              <input
                type="text"
                id="bookAuthor"
                name="bookAuthor"
                value={newRequest.bookAuthor}
                onChange={handleInputChange}
                required
                placeholder="Enter author name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Why do you want this reviewed?</label>
              <textarea
                id="description"
                name="description"
                value={newRequest.description}
                onChange={handleInputChange}
                placeholder="Tell the community why you're interested in reviews for this book"
                rows="3"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-request-btn">Submit Request</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowRequestForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="request-board-stats">
        <div className="stat-item">
          <span className="stat-number">{reviewRequests.length}</span>
          <span className="stat-label">Total Requests</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {reviewRequests.filter(req => req.fulfilled).length}
          </span>
          <span className="stat-label">Fulfilled</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {reviewRequests.filter(req => !req.fulfilled).length}
          </span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="request-cards-container">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request, index) => (
            <div 
              key={request.id} 
              className={`request-card ${request.fulfilled ? 'fulfilled' : 'pending'}`}
              style={{"--card-index": index}}
            >
              <div className="request-card-cover">
                <img 
                  src={request.coverUrl} 
                  alt={request.bookTitle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book-cover.jpg';
                  }}
                />
                {request.fulfilled && (
                  <div className="fulfilled-badge">
                    <span>✓ Reviewed</span>
                  </div>
                )}
              </div>
              
              <div className="request-card-content">
                <h3 className="request-book-title">{request.bookTitle}</h3>
                <p className="request-book-author">by {request.bookAuthor}</p>
                
                <div className="request-meta">
                  <span className="requested-by">Requested by: {request.requestedBy}</span>
                  <span className="request-date">on {request.dateRequested}</span>
                </div>
                
                {request.description && (
                  <p className="request-description">{request.description}</p>
                )}
                
                <div className="request-actions">
                  <button 
                    className="upvote-btn"
                    onClick={() => handleUpvote(request.id)}
                    disabled={request.fulfilled}
                  >
                    <span className="upvote-icon">▲</span>
                    <span className="upvote-count">{request.upvotes}</span>
                  </button>
                  
                  {!request.fulfilled ? (
                    <button 
                      className="fulfill-btn"
                      onClick={() => handleFulfill(request.id)}
                    >
                      Write Review
                    </button>
                  ) : (
                    <Link to={`/my-reviews`} className="view-review-btn">
                      View Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-requests">
            <div className="no-results-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p>No review requests match your criteria</p>
            {filter !== 'all' || searchQuery ? (
              <button 
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => setShowRequestForm(true)}
                className="be-first-btn"
              >
                Be the first to request a review!
              </button>
            )}
          </div>
        )}
      </div>


    </section>
  );
};

export default ReviewRequestBoard;