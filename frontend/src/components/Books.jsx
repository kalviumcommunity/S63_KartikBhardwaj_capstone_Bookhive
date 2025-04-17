import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import BookModal from './BookModal';
import '../styles/Books.css';

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

  // Create refs for each category's scroll container
  const scrollContainers = {
    fiction: useRef(null),
    scifi: useRef(null),
    mystery: useRef(null),
    romance: useRef(null),
    motivation: useRef(null)
  };

  const fetchBookDetails = async (key) => {
    try {
      console.log('Fetching details for key:', key);
      const response = await fetch(`https://openlibrary.org${key}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Fetch description if available
      let description = '';
      if (data.description) {
        description = typeof data.description === 'object' 
          ? data.description.value 
          : data.description;
      }

      // Generate a more realistic random rating between 3.5 and 5
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1);

      const details = {
        description,
        publishYear: data.first_publish_date || data.publish_date,
        pages: data.number_of_pages,
        rating: rating,
        // Add ISBN if available
        isbn: data.isbn_13 ? data.isbn_13[0] : (data.isbn_10 ? data.isbn_10[0] : null),
        // Add language if available
        language: data.languages ? data.languages[0]?.key.split('/').pop() : 'English'
      };

      console.log('Processed book details:', details);
      return details;
    } catch (error) {
      console.error('Error fetching book details:', error);
      // Return default values if fetch fails
      return {
        description: 'Description temporarily unavailable.',
        publishYear: 'Unknown',
        pages: null,
        rating: '4.0',
        isbn: null,
        language: 'English'
      };
    }
  };

  const handleBookClick = async (book) => {
    console.log('Book clicked:', book);
    try {
      const details = await fetchBookDetails(book.key);
      console.log('Fetched book details:', details);
      
      const bookWithDetails = {
        ...book,
        ...details,
        coverUrl: getCoverImage(book.coverId)
      };
      console.log('Complete book data:', bookWithDetails);
      
      setSelectedBook(bookWithDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error in handleBookClick:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleAddToReadingList = (book) => {
    // TODO: Implement reading list functionality
    console.log('Adding to reading list:', book.title);
    // You can add your reading list logic here
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
        author: book.authors?.[0]?.name || 'Unknown Author',
        coverId: book.cover_id,
        key: book.key,
        genre: actualSubject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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

  const getCoverImage = (coverId) => {
    return coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : 'https://via.placeholder.com/300x450?text=No+Cover+Available';
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
                        src={getCoverImage(book.coverId)} 
                        alt={book.title}
                        className="book-cover"
                      />
                    </div>
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={handleCloseModal}
          onAddToReadingList={handleAddToReadingList}
        />
      )}
    </div>
  );
};

export default Books; 