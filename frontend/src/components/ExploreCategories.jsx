import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ExploreCategories.css';

// Import icons from react-icons
import { IoBookOutline } from 'react-icons/io5';
import { IoSchoolOutline } from 'react-icons/io5';
import { IoFlaskOutline } from 'react-icons/io5';

const CategoryCard = ({ icon: Icon, title, description, link, isActive }) => {
  return (
    <Link 
      to={link} 
      className={`category-card ${isActive ? 'active' : ''}`}
    >
      <div className="card-content">
        <div className="icon-wrapper">
          <Icon className="category-icon" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="browse-link">
          Browse <span className="arrow">→</span>
        </div>
      </div>
    </Link>
  );
};

const ExploreCategories = () => {
  const categories = [
    {
      icon: IoFlaskOutline,
      title: "Science & Technology",
      description: "Scientific discoveries and tech innovations",
      link: "/category/science",
    },
    {
      icon: IoBookOutline,
      title: "Fiction",
      description: "Explore novels, short stories, and literary fiction",
      link: "/category/fiction",
      isActive: true,
    },
    {
      icon: IoSchoolOutline,
      title: "Non-Fiction",
      description: "Biography, history, and educational books",
      link: "/category/non-fiction",
    },
  ];

  return (
    <div className="explore-section">
      <h1>Explore Categories</h1>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            icon={category.icon}
            title={category.title}
            description={category.description}
            link={category.link}
            isActive={category.isActive}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreCategories; 