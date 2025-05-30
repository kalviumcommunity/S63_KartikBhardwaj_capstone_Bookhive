const BookOfTheMonth = ({ initialBook = null }) => {
  return (
    <section className="book-of-month-section">
      <h2 className="section-title">Book of the Month</h2>
      
      {initialBook ? (
        <div className="book-of-month-container">
          <div className="book-cover">
            {initialBook.coverUrl && <img src={initialBook.coverUrl} alt={initialBook.title} />}
          </div>
          <div className="book-details">
            <h3 className="book-title">{initialBook.title}</h3>
            <p className="book-author">by {initialBook.author}</p>
            <div className="book-rating">
              {/* Rating stars would go here */}
              <span>{initialBook.rating} ★</span>
            </div>
            <p className="book-description">{initialBook.description}</p>
            <button className="read-more-button">Read More</button>
          </div>
        </div>
      ) : (
        <p>Loading book of the month...</p>
      )}
    </section>
  );
};

export default BookOfTheMonth;