import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import '../styles/UserProfile.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaIdBadge, 
  FaUserTag, 
  FaClock, 
  FaBook, 
  FaStar, 
  FaBookmark,
  FaEdit,
  FaChartLine,
  FaTrash
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user } = useAuth();
  const { getAllBookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [bookmarks, setBookmarks] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: user?.displayName || 'Hanuman ji',
    email: user?.email || 'hanuman@gmail.com',
    userId: user?.uid || 'Not set',
    accountType: user?.role || 'user',
    lastLogin: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A',
    profileImage: user?.photoURL || '/default-avatar.png',
    booksRead: 24,
    booksInProgress: 3,
    reviewsWritten: 12,
    favoriteGenre: 'Fantasy',
    memberSince: 'January 2023'
  });

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = (formData) => {
    setUserInfo(prev => ({
      ...prev,
      username: formData.username,
      email: formData.email,
      profileImage: formData.profileImage
    }));

    localStorage.setItem('userProfile', JSON.stringify({
      ...userInfo,
      username: formData.username,
      email: formData.email,
      profileImage: formData.profileImage
    }));
  };

  useEffect(() => {
    // Load user profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserInfo(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
    }
    
    // Check if there's an active tab stored in localStorage
    const storedActiveTab = localStorage.getItem('profileActiveTab');
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
      // Clear the stored tab after setting it
      localStorage.removeItem('profileActiveTab');
    }
  }, []);
  
  // Load bookmarks when the component mounts
  useEffect(() => {
    const userBookmarks = getAllBookmarks();
    setBookmarks(userBookmarks);
  }, [getAllBookmarks]);
  
  // Update bookmarks when the active tab changes to 'books'
  useEffect(() => {
    if (activeTab === 'books') {
      const userBookmarks = getAllBookmarks();
      setBookmarks(userBookmarks);
    }
  }, [activeTab, getAllBookmarks]);
  
  const handleRemoveBookmark = (bookKey, bookTitle) => {
    removeBookmark(bookKey);
    setBookmarks(prev => prev.filter(book => book.key !== bookKey));
    toast.success(`Removed "${bookTitle}" from bookmarks`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Mock data for reading stats
  const readingStats = [
    { month: 'Jan', books: 2 },
    { month: 'Feb', books: 3 },
    { month: 'Mar', books: 1 },
    { month: 'Apr', books: 4 },
    { month: 'May', books: 2 },
    { month: 'Jun', books: 3 },
    { month: 'Jul', books: 5 },
    { month: 'Aug', books: 2 },
    { month: 'Sep', books: 1 },
    { month: 'Oct', books: 0 },
    { month: 'Nov', books: 1 },
    { month: 'Dec', books: 0 },
  ];

  // Mock data for recent books
  const recentBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg' },
    { id: 3, title: '1984', author: 'George Orwell', cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg' },
  ];

  return (
    <motion.div 
      className="profile-page-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="profile-header">
        <motion.div 
          className="profile-header-content"
          variants={itemVariants}
        >
          <div className="profile-avatar-container">
            <motion.div 
              className="profile-avatar"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={userInfo.profileImage} 
                alt={userInfo.username} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <motion.div 
                className="edit-avatar-overlay"
                onClick={handleEditProfile}
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <FaEdit />
              </motion.div>
            </motion.div>
          </div>
          <div className="profile-header-info">
            <motion.h1 
              className="profile-name"
              variants={itemVariants}
            >
              {userInfo.username}
            </motion.h1>
            <motion.div 
              className="profile-meta"
              variants={itemVariants}
            >
              <span className="profile-meta-item">
                <FaBook /> {userInfo.booksRead} Books Read
              </span>
              <span className="profile-meta-item">
                <FaStar /> {userInfo.reviewsWritten} Reviews
              </span>
              <span className="profile-meta-item">
                <FaUserTag /> {userInfo.accountType}
              </span>
            </motion.div>
            <motion.button 
              className="edit-profile-button"
              onClick={handleEditProfile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="profile-tabs">
        <motion.button 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <FaUser /> Profile
        </motion.button>
        <motion.button 
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <FaChartLine /> Reading Stats
        </motion.button>
        <motion.button 
          className={`profile-tab ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <FaBookmark /> My Books
        </motion.button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <motion.div 
            className="profile-info-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="profile-card"
              variants={cardVariants}
            >
              <h2 className="card-title">Account Information</h2>
              <div className="profile-info-list">
                <motion.div className="profile-info-item" variants={itemVariants}>
                  <FaIdBadge className="info-icon" />
                  <span className="info-label">User ID</span>
                  <span className="info-value">{userInfo.userId}</span>
                </motion.div>
                <motion.div className="profile-info-item" variants={itemVariants}>
                  <FaEnvelope className="info-icon" />
                  <span className="info-label">Email</span>
                  <span className="info-value">{userInfo.email}</span>
                </motion.div>
                <motion.div className="profile-info-item" variants={itemVariants}>
                  <FaUserTag className="info-icon" />
                  <span className="info-label">Account Type</span>
                  <span className="info-value">{userInfo.accountType}</span>
                </motion.div>
                <motion.div className="profile-info-item" variants={itemVariants}>
                  <FaClock className="info-icon" />
                  <span className="info-label">Last Login</span>
                  <span className="info-value">{userInfo.lastLogin}</span>
                </motion.div>
                <motion.div className="profile-info-item" variants={itemVariants}>
                  <FaUser className="info-icon" />
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{userInfo.memberSince}</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="profile-card"
              variants={cardVariants}
            >
              <h2 className="card-title">Reading Preferences</h2>
              <div className="reading-preferences">
                <motion.div className="preference-item" variants={itemVariants}>
                  <div className="preference-label">Favorite Genre</div>
                  <div className="preference-value">{userInfo.favoriteGenre}</div>
                </motion.div>
                <motion.div className="preference-item" variants={itemVariants}>
                  <div className="preference-label">Reading Goal</div>
                  <div className="preference-value">30 books per year</div>
                </motion.div>
                <motion.div className="preference-item" variants={itemVariants}>
                  <div className="preference-label">Preferred Format</div>
                  <div className="preference-value">Paperback</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div 
            className="profile-stats-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="profile-card stats-card"
              variants={cardVariants}
            >
              <h2 className="card-title">Reading Activity</h2>
              <div className="stats-summary">
                <motion.div className="stat-item" variants={itemVariants}>
                  <div className="stat-value">{userInfo.booksRead}</div>
                  <div className="stat-label">Books Read</div>
                </motion.div>
                <motion.div className="stat-item" variants={itemVariants}>
                  <div className="stat-value">{userInfo.booksInProgress}</div>
                  <div className="stat-label">In Progress</div>
                </motion.div>
                <motion.div className="stat-item" variants={itemVariants}>
                  <div className="stat-value">{userInfo.reviewsWritten}</div>
                  <div className="stat-label">Reviews</div>
                </motion.div>
              </div>
              <div className="reading-chart">
                <h3>Books Read This Year</h3>
                <div className="chart-container">
                  {readingStats.map((month, index) => (
                    <motion.div 
                      key={month.month} 
                      className="chart-bar-container"
                      variants={itemVariants}
                      custom={index}
                    >
                      <div className="chart-label">{month.month}</div>
                      <motion.div 
                        className="chart-bar"
                        initial={{ height: 0 }}
                        animate={{ height: `${month.books * 20}px` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      ></motion.div>
                      <div className="chart-value">{month.books}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'books' && (
          <motion.div 
            className="profile-books-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="profile-card"
              variants={cardVariants}
            >
              <h2 className="card-title">
                <FaBookmark className="card-title-icon" /> My Bookmarked Books
              </h2>
              
              {bookmarks.length === 0 ? (
                <motion.div 
                  className="no-bookmarks-message"
                  variants={itemVariants}
                >
                  <FaBookmark className="no-bookmarks-icon" />
                  <h3>No bookmarked books yet</h3>
                  <p>Browse books and click the bookmark icon to save them here</p>
                  <motion.button 
                    className="browse-books-button"
                    onClick={() => navigate('/books')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Books
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="books-grid">
                    {bookmarks.map((book, index) => (
                      <motion.div 
                        key={book.key} 
                        className="book-item"
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                        }}
                      >
                        <div className="book-cover">
                          <img 
                            src={book.coverUrl || '/default-book-cover.jpg'} 
                            alt={book.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              if (e.target.src !== '/default-book-cover.jpg') {
                                e.target.src = '/default-book-cover.jpg';
                              }
                            }}
                          />
                          <motion.button 
                            className="remove-bookmark-button"
                            onClick={() => handleRemoveBookmark(book.key, book.title)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Remove bookmark"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                        <div className="book-info">
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">by {book.author}</p>
                          <p className="bookmark-date">
                            Bookmarked on {new Date(book.bookmarkedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button 
                    className="view-all-button"
                    onClick={() => navigate('/books')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                  >
                    Browse More Books
                  </motion.button>
                </>
              )}
            </motion.div>
            
            <motion.div 
              className="profile-card"
              variants={cardVariants}
            >
              <h2 className="card-title">Recently Read Books</h2>
              <div className="books-grid">
                {recentBooks.map((book, index) => (
                  <motion.div 
                    key={book.id} 
                    className="book-item"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="book-cover">
                      <img src={book.cover} alt={book.title} />
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button 
                className="view-all-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                View All Books
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={userInfo}
        onSave={handleSaveProfile}
      />
    </motion.div>
  );
};

export default UserProfile; 