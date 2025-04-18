import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ExploreCategories from './ExploreCategories';
import FeaturedBooks from './FeaturedBooks';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <div className="main-content">
        <ExploreCategories />
        <FeaturedBooks />
      </div>
    </div>
  );
};

export default Home; 