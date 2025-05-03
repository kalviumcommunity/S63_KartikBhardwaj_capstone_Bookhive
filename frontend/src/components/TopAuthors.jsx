import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopAuthors.css';

const authors = [
  {
    name: 'J.K. Rowling',
    photo: 'https://covers.openlibrary.org/a/olid/OL23919A-M.jpg',
    books: [
      { title: 'Harry Potter 1', cover: 'https://covers.openlibrary.org/b/id/7984916-M.jpg' },
      { title: 'Harry Potter 2', cover: 'https://covers.openlibrary.org/b/id/8231856-M.jpg' },
      { title: 'Harry Potter 3', cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
    ],
  },
  {
    name: 'Agatha Christie',
    photo: 'https://covers.openlibrary.org/a/olid/OL26320A-M.jpg',
    books: [
      { title: 'Murder on the Orient Express', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'And Then There Were None', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'The ABC Murders', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    name: 'George Orwell',
    photo: 'https://covers.openlibrary.org/a/olid/OL38298A-M.jpg',
    books: [
      { title: '1984', cover: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
      { title: 'Animal Farm', cover: 'https://covers.openlibrary.org/b/id/8775116-M.jpg' },
      { title: 'Homage to Catalonia', cover: 'https://covers.openlibrary.org/b/id/11153223-M.jpg' },
    ],
  },
];

const TopAuthors = () => {
  const navigate = useNavigate();

  const handleAuthorClick = (authorName) => {
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  console.log('TopAuthors rendered, authors:', authors);
  return (
    <section className="top-authors-section">
      <h2 className="top-authors-title">Top Authors</h2>
      <div className="top-authors-grid">
        {authors.map((author, idx) => (
          <div
            key={idx}
            className="author-card"
            onClick={() => handleAuthorClick(author.name)}
          >
            <img src={author.photo} alt={author.name} className="author-photo" />
            <div className="author-name">{author.name}</div>
            <div className="author-books">
              {author.books.map((book, bidx) => (
                <img
                  key={bidx}
                  src={book.cover}
                  alt={book.title}
                  className="author-book-cover"
                  title={book.title}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopAuthors; 