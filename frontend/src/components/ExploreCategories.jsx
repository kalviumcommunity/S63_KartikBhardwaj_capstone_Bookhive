import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExploreCategories.css';

// Category configuration with emojis and OpenLibrary subjects
const CATEGORIES_CONFIG = [
  {
    id: 'fiction',
    subject: 'fiction',
    emoji: '📚',
    gradient: 'from-blue-500 to-blue-700',
    fallbackTitle: 'Fiction',
    fallbackCount: '2.5M+'
  },
  {
    id: 'romance',
    subject: 'romance',
    emoji: '💕',
    gradient: 'from-pink-400 to-pink-600',
    fallbackTitle: 'Romance',
    fallbackCount: '850K+'
  },
  {
    id: 'mystery',
    subject: 'mystery',
    emoji: '🔍',
    gradient: 'from-purple-500 to-purple-700',
    fallbackTitle: 'Mystery',
    fallbackCount: '420K+'
  },
  {
    id: 'science_fiction',
    subject: 'science_fiction',
    emoji: '🚀',
    gradient: 'from-cyan-400 to-blue-600',
    fallbackTitle: 'Science Fiction',
    fallbackCount: '380K+'
  },
  {
    id: 'self_help',
    subject: 'self_help',
    emoji: '💪',
    gradient: 'from-green-500 to-green-700',
    fallbackTitle: 'Self Help',
    fallbackCount: '290K+'
  },
  {
    id: 'biography',
    subject: 'biography',
    emoji: '👤',
    gradient: 'from-orange-500 to-red-500',
    fallbackTitle: 'Biography',
    fallbackCount: '650K+'
  },
  {
    id: 'history',
    subject: 'history',
    emoji: '🏛️',
    gradient: 'from-yellow-500 to-orange-600',
    fallbackTitle: 'History',
    fallbackCount: '720K+'
  },
  {
    id: 'fantasy',
    subject: 'fantasy',
    emoji: '🧙',
    gradient: 'from-indigo-500 to-purple-600',
    fallbackTitle: 'Fantasy',
    fallbackCount: '340K+'
  }
];

const CategoryCard = ({ category, isLoading, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Staggered animation entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M+ books`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K+ books`;
    }
    return `${count}+ books`;
  };

  return (
    <div
      className={`category-card ${category.gradient} ${isLoading ? 'loading' : ''} ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isLoading && onClick(category)}
      title={`Explore ${category.title || category.fallbackTitle} books`}
      style={{
        animationDelay: `${index * 0.1}s`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div className="category-card-content">
        <div className={`category-emoji ${isHovered ? 'animate-float' : ''}`}>
          {category.emoji}
        </div>
        <h3 className="category-title">
          {category.title || category.fallbackTitle}
        </h3>
        <p className="category-count">
          {isLoading ? (
            <span className="loading-dots">Loading</span>
          ) : (
            formatCount(category.work_count || parseInt(category.fallbackCount.replace(/[^\d]/g, '')) * 1000)
          )}
        </p>
        <div className="category-hover-effect">
          <span>Discover</span>
          <span className="arrow">→</span>
        </div>
      </div>
      {isHovered && !isLoading && (
        <div className="category-tooltip">
          Discover {category.title || category.fallbackTitle} collection
        </div>
      )}
    </div>
  );
};

const ExploreCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(CATEGORIES_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch data for all categories in parallel
        const promises = CATEGORIES_CONFIG.map(async (config) => {
          try {
            const response = await fetch(
              `https://openlibrary.org/subjects/${config.subject}.json?limit=1`,
              {
                headers: {
                  'Accept': 'application/json',
                },
                // Add timeout
                signal: AbortSignal.timeout(5000)
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            return {
              ...config,
              title: data.name || config.fallbackTitle,
              work_count: data.work_count || parseInt(config.fallbackCount.replace(/[^\d]/g, '')) * 1000,
              subject_info: data.subject || config.subject
            };
          } catch (error) {
            console.warn(`Failed to fetch data for ${config.subject}:`, error);
            // Return fallback data
            return {
              ...config,
              title: config.fallbackTitle,
              work_count: parseInt(config.fallbackCount.replace(/[^\d]/g, '')) * 1000
            };
          }
        });

        const results = await Promise.all(promises);
        setCategories(results);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Failed to load categories. Using fallback data.');
        // Use fallback data
        setCategories(CATEGORIES_CONFIG.map(config => ({
          ...config,
          title: config.fallbackTitle,
          work_count: parseInt(config.fallbackCount.replace(/[^\d]/g, '')) * 1000
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to category page using React Router
    navigate(`/category/${category.id}`);
  };

  const handleBrowseAllClick = () => {
    // Navigate to all categories page or books page
    navigate('/books');
  };

  return (
    <section className="explore-categories-section">
      <div className="explore-categories-container">
        {/* Header */}
        <div className="explore-header">
          <h2 className="explore-title">Explore Categories</h2>
          <p className="explore-subtitle">
            Discover your next literary adventure through our thoughtfully curated collections
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              isLoading={isLoading}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="explore-cta">
          <button 
            className="browse-all-btn"
            onClick={handleBrowseAllClick}
          >
            <span>Discover All Collections</span>
            <span className="btn-icon">📚</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;