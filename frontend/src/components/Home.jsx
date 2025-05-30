import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ExploreCategories from './ExploreCategories';
import FeaturedBooks from './FeaturedBooks';
import TopAuthors from './TopAuthors';
import BookOfTheMonth from './BookOfTheMonth';
import PopularCategories from './PopularCategories';
import RecentReviews from './RecentReviews';
import ReadingStats from './ReadingStats';

import CommunityCTA from './CommunityCTA';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <div className="main-content">
        <ExploreCategories />
        <BookOfTheMonth />
        <PopularCategories />
        <TopAuthors />
        <RecentReviews />
        <ReadingStats />
        <CommunityCTA />
      </div>
    </div>
  );
};

export default Home; 