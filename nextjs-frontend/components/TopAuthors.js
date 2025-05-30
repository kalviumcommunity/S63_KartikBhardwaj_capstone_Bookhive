const TopAuthors = ({ initialAuthors = [] }) => {
  return (
    <section className="top-authors-section">
      <h2 className="section-title">Top Authors</h2>
      
      <div className="authors-grid">
        {initialAuthors.length > 0 ? (
          initialAuthors.map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-avatar">
                {author.photoUrl && <img src={author.photoUrl} alt={author.name} />}
              </div>
              <div className="author-info">
                <h3 className="author-name">{author.name}</h3>
                <p className="author-books-count">{author.booksCount} books</p>
                <p className="author-genre">{author.genre}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading top authors...</p>
        )}
      </div>
    </section>
  );
};

export default TopAuthors;