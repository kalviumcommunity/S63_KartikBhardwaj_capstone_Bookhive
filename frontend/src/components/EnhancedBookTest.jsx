import React from 'react';
import EnhancedBookCover from './EnhancedBookCover';
import { 
  validateAndFilterBooks, 
  removeDuplicateBooks, 
  generateCoverUrls 
} from '../utils/enhancedImageUtils';

// Test component to verify enhanced book functionality
const EnhancedBookTest = () => {
  // Sample book data for testing
  const testBooks = [
    {
      id: 'OL82563W',
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      rating: 4.8,
      cover_i: '123456',
      isbn: ['9780439708180'],
      description: 'A young wizard discovers his magical heritage on his eleventh birthday.'
    },
    {
      id: 'OL27448W',
      title: 'The Shining',
      author: 'Stephen King',
      genre: 'Horror',
      rating: 4.2,
      isbn: ['9780307743657'],
      description: 'A writer takes a job as winter caretaker at an isolated hotel.'
    },
    {
      key: '/works/OL45804W',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      rating: 4.6,
      description: 'A gripping tale of racial injustice and childhood innocence.'
    },
    // Duplicate test
    {
      id: 'OL82563W',
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      rating: 4.8,
      description: 'A young wizard discovers his magical heritage.'
    }
  ];

  // Test duplicate removal
  const uniqueBooks = removeDuplicateBooks(testBooks);
  console.log('Original books:', testBooks.length);
  console.log('After duplicate removal:', uniqueBooks.length);

  // Test URL generation
  uniqueBooks.forEach(book => {
    const urls = generateCoverUrls(book);
    console.log(`URLs for "${book.title}":`, urls.slice(0, 3));
  });

  const handleBookClick = (book) => {
    console.log('Book clicked:', book.title);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enhanced Book Cover Test</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {uniqueBooks.map((book, index) => (
          <div key={book.id || book.key || index} style={{ textAlign: 'center' }}>
            <EnhancedBookCover
              book={book}
              size="medium"
              lazy={index > 2}
              priority={index === 0}
              showOverlay={true}
              onClick={handleBookClick}
            />
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              {book.title}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Test Results</h3>
        <ul>
          <li>Original books: {testBooks.length}</li>
          <li>After deduplication: {uniqueBooks.length}</li>
          <li>Duplicates removed: {testBooks.length - uniqueBooks.length}</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedBookTest;