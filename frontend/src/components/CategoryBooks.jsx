import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookDetailsModal from './BookDetailsModal';
import Navbar from './Navbar';
import '../styles/Books.css';

const CATEGORY_MAP = {
  'fiction': 'fiction',
  'science': 'science',
  'non-fiction': 'nonfiction',
  'nonfiction': 'nonfiction',
  'science & technology': 'science',
};

const CategoryBooks = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const subject = CATEGORY_MAP[category?.toLowerCase()] || category;
      try {
        const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=20`);
        const data = await response.json();
        const booksData = data.works.map(book => ({
          title: book.title,
          author: book.authors?.[0]?.name || 'Unknown Author',
          coverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null,
          largeCoverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : null,
          key: book.key,
        }));
        setBooks(booksData);
      } catch (error) {
        setBooks([]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [category]);

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
    try {
      const response = await fetch(`http://localhost:5001/api/books/external-details?title=${encodeURIComponent(book.title)}`);
      const details = await response.json();
      setBookDetails(details);
    } catch (error) {
      setBookDetails({ description: 'No description available.' });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setBookDetails(null);
  };

  return (
    <div className="books-page">
      <Navbar />
      <div className="books-container">
        <h1>{category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Books</h1>
        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="loading">No books found for this category.</div>
        ) : (
          <div className="books-grid">
            {books.map((book, idx) => (
              <div key={idx} className="book-card" onClick={() => handleBookClick(book)}>
                <div className="book-image-wrapper">
                  <img
                    src={book.coverUrl || '/default-book-cover.jpg'}
                    alt={book.title}
                    className="book-cover"
                    loading="lazy"
                    onError={e => {
                      e.target.onerror = null;
                      if (e.target.src !== '/default-book-cover.jpg') {
                        e.target.src = '/default-book-cover.jpg';
                      }
                    }}
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && selectedBook && (
        <BookDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          book={selectedBook}
          additionalDetails={bookDetails}
        />
      )}
    </div>
  );
};

export default CategoryBooks; 