import { useState } from 'react';
import { useRouter } from 'next/router';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Discover Your Next Favorite Book</h1>
        <p className="hero-subtitle">
          Join thousands of readers who find, review, and share their literary adventures
        </p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Books</span>
          </div>
          <div className="stat">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat">
            <span className="stat-number">2K+</span>
            <span className="stat-label">Authors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;