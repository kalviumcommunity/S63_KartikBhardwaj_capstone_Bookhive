import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();
  
  // Load bookmarks from localStorage when component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.uid}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    }
  }, [user]);

  // Save bookmarks to localStorage whenever they change (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, user]);

  // Add a book to bookmarks
  const addBookmark = (book) => {
    if (!user) return false;
    
    // Check if book is already bookmarked
    const isBookmarked = bookmarks.some(bookmark => bookmark.key === book.key);
    
    if (!isBookmarked) {
      const newBookmarks = [...bookmarks, {
        ...book,
        bookmarkedAt: new Date().toISOString()
      }];
      setBookmarks(newBookmarks);
      return true;
    }
    return false;
  };

  // Remove a book from bookmarks
  const removeBookmark = (bookKey) => {
    if (!user) return false;
    
    const newBookmarks = bookmarks.filter(bookmark => bookmark.key !== bookKey);
    setBookmarks(newBookmarks);
    return true;
  };

  // Check if a book is bookmarked
  const isBookmarked = (bookKey) => {
    return bookmarks.some(bookmark => bookmark.key === bookKey);
  };

  // Get all bookmarks
  const getAllBookmarks = () => {
    return bookmarks;
  };

  const value = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getAllBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContext;