import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import BookDetailsModal from './BookDetailsModal';
import '../styles/Books.css';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState({
    fiction: [],
    scifi: [],
    mystery: [],
    romance: [],
    motivation: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const navigate = useNavigate();

  // Create refs for each category's scroll container
  const scrollContainers = {
    fiction: useRef(null),
    scifi: useRef(null),
    mystery: useRef(null),
    romance: useRef(null),
    motivation: useRef(null)
  };

  const fetchBooks = async (subject, limit = 6) => {
    try {
      const actualSubject = subject === 'motivation' ? 'self_help' : subject;
      const response = await fetch(
        `https://openlibrary.org/subjects/${actualSubject}.json?limit=${limit}`
      );
      const data = await response.json();
      return data.works.map(book => ({
        title: book.title,
        author_name: book.authors?.[0]?.name || 'Unknown Author',
        cover_i: book.cover_id,
        key: book.key,
        subject: [actualSubject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())],
        first_publish_year: book.first_publish_year,
        language: book.language ? [book.language] : ['English'],
        coverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null,
        largeCoverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : null
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const [fictionBooks, scifiBooks, mysteryBooks, romanceBooks, motivationBooks] = await Promise.all([
        fetchBooks('fiction'),
        fetchBooks('science_fiction'),
        fetchBooks('mystery'),
        fetchBooks('romance'),
        fetchBooks('motivation')
      ]);

      setBooks({
        fiction: fictionBooks,
        scifi: scifiBooks,
        mystery: mysteryBooks,
        romance: romanceBooks,
        motivation: motivationBooks
      });
      setLoading(false);
    };

    loadBooks();
  }, []);

  const handleBookClick = async (book) => {
    console.log('Book clicked:', book);
    
    // Extract the works ID from the key
    const worksId = book.key.replace('/works/', '');
    
    // Create a book object with the necessary structure
    const bookData = {
      key: worksId,
      title: book.title,
      author: book.author_name,
      coverUrl: book.coverUrl,
      largeCoverUrl: book.largeCoverUrl
    };
    
    setSelectedBook(bookData);
    setIsModalOpen(true);
    
    try {
      // Fetch additional book details
      const response = await fetch(`http://localhost:5001/api/books/external-details?title=${encodeURIComponent(book.title)}`);
      const details = await response.json();
      setBookDetails(details);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setBookDetails({
        description: 'No description available.',
        subjects: [],
        firstPublishYear: book.first_publish_year || 'Unknown',
        language: book.language?.[0] || 'Unknown',
        publishers: 'Unknown',
        numberOfPages: 'Unknown',
        publishDate: 'Unknown',
        isbn: 'Unknown'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setBookDetails(null);
  };

  const scroll = (direction, category) => {
    const container = scrollContainers[category].current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="books-page">
        <Navbar />
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  const categories = [
    { id: 'motivation', title: "Motivational", books: books.motivation },
    { id: 'fiction', title: "Fiction", books: books.fiction },
    { id: 'scifi', title: "Science Fiction", books: books.scifi },
    { id: 'mystery', title: "Mystery", books: books.mystery },
    { id: 'romance', title: "Romance", books: books.romance }
  ];

  return (
    <div className="books-page">
      <Navbar />
      <div className="books-container">
        <h1>Explore Books</h1>
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <h2>{category.title}</h2>
            <div className="books-grid-container">
              <button 
                className="scroll-button scroll-left" 
                onClick={() => scroll('left', category.id)}
                aria-label="Scroll left"
              >
                ←
              </button>
              <button 
                className="scroll-button scroll-right" 
                onClick={() => scroll('right', category.id)}
                aria-label="Scroll right"
              >
                →
              </button>
              <div className="books-grid" ref={scrollContainers[category.id]}>
                {category.books.map((book, bookIndex) => (
                  <div 
                    key={bookIndex} 
                    className="book-card"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="book-image-wrapper">
                      <img 
                        src={book.coverUrl || '/default-book-cover.jpg'} 
                        alt={book.title}
                        className="book-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          if (e.target.src !== '/default-book-cover.jpg') {
                            e.target.src = '/default-book-cover.jpg';
                          }
                        }}
                      />
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author_name?.[0] || 'Unknown Author'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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

export default Books; 