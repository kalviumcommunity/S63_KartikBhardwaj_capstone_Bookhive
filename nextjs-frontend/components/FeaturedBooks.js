const FeaturedBooks = ({ initialBooks = [] }) => {
  return (
    <section className="featured-books-section">
      <h2 className="section-title">Featured Books</h2>
      <div className="books-grid">
        {initialBooks.length > 0 ? (
          initialBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-rating">
                  {/* Rating stars would go here */}
                  <span>{book.rating} ★</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading featured books...</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;