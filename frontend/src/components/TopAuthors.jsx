import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ArrowRightIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { fetchTopAuthors } from '../services/AuthorService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import '../styles/TopAuthors.css';

const TopAuthors = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedAuthors, setFollowedAuthors] = useState(new Set());

  // Preload critical images
  const preloadImages = (authors) => {
    authors.slice(0, 3).forEach(author => {
      const img = new Image();
      img.src = author.photoUrl;
    });
  };

  useEffect(() => {
    const loadTopAuthors = async () => {
      try {
        setLoading(true);
        const authorsData = await fetchTopAuthors(8); // Fetch 8 authors for faster loading
        setAuthors(authorsData);
        preloadImages(authorsData); // Preload first 3 images
      } catch (error) {
        console.error('Error loading top authors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopAuthors();
  }, []);

  const handleFollowToggle = (authorId, authorName) => {
    const newFollowedAuthors = new Set(followedAuthors);
    
    if (followedAuthors.has(authorId)) {
      newFollowedAuthors.delete(authorId);
    } else {
      newFollowedAuthors.add(authorId);
      // Navigate to author detail page after a brief delay to show animation
      setTimeout(() => {
        navigate(`/author/${authorId}`);
      }, 800);
    }
    
    setFollowedAuthors(newFollowedAuthors);
  };

  const handleDiscoverMore = () => {
    navigate('/authors');
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/author/${authorId}`);
  };

  const formatFollowersCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <section className="top-authors-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Top Authors
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover the voices that shape literature
            </motion.p>
          </div>
          
          <div className="authors-carousel-container">
            <div className="carousel-loading">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="author-card-skeleton">
                  <div className="author-photo-skeleton"></div>
                  <div className="author-info-skeleton">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line subtitle"></div>
                    <div className="skeleton-line description"></div>
                    <div className="skeleton-stats">
                      <div className="skeleton-line stat"></div>
                      <div className="skeleton-line stat"></div>
                    </div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="top-authors-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Top Authors</h2>
          <p className="section-subtitle">
            Discover the voices that shape literature
          </p>
        </motion.div>

        <motion.div 
          className="authors-carousel-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
            }}
            speed={800}
            effect="coverflow"
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 35,
              },
            }}
            className="authors-swiper"
          >
            {authors.map((author, index) => (
              <SwiperSlide key={author.id}>
                <div
                  className="author-card-carousel"
                  onClick={() => handleAuthorClick(author.id)}
                >
                  {/* Author Photo */}
                  <div className="author-photo-container-carousel">
                    <img
                      src={author.photoUrl}
                      alt={author.name}
                      className="author-photo-carousel"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=120&background=667eea&color=ffffff&bold=true`;
                      }}
                    />
                    <div className="photo-overlay-carousel"></div>
                  </div>

                  {/* Author Info */}
                  <div className="author-info-carousel">
                    <h3 className="author-name-carousel">{author.name}</h3>
                    <p className="author-country-carousel">{author.country}</p>
                    <p className="author-description-carousel">
                      {author.description}
                    </p>

                    {/* Stats */}
                    <div className="author-stats-carousel">
                      <div className="stat-item-carousel">
                        <BookOpenIcon className="stat-icon-carousel" />
                        <span className="stat-value-carousel">{author.booksCount}</span>
                        <span className="stat-label-carousel">Books</span>
                      </div>
                      <div className="stat-item-carousel">
                        <UserGroupIcon className="stat-icon-carousel" />
                        <span className="stat-value-carousel">{formatFollowersCount(author.followersCount)}</span>
                        <span className="stat-label-carousel">Followers</span>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <motion.button
                      className={`follow-btn-carousel ${followedAuthors.has(author.id) ? 'following' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(author.id, author.name);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="btn-content-carousel">
                        {followedAuthors.has(author.id) ? (
                          <>
                            <CheckIcon className="btn-icon-carousel" />
                            Following
                          </>
                        ) : (
                          <>
                            <PlusIcon className="btn-icon-carousel" />
                            Follow
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Discover More Button */}
        <motion.div 
          className="discover-more-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="discover-more-btn"
            onClick={handleDiscoverMore}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Discover More Authors</span>
            <ArrowRightIcon className="btn-arrow" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TopAuthors;