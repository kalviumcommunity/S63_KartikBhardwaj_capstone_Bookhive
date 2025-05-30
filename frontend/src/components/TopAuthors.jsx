import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { handleImageError, PLACEHOLDER_IMAGES } from '../utils/imageUtils';
import '../styles/TopAuthors.css';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/AuthorSwiper.css';
// Import required modules
import { Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/effect-coverflow';

// Fallback author data in case the API fails
export const fallbackAuthors = [
  {
    id: 'OL23919A',
    name: 'J.K. Rowling',
    bio: 'British author best known for the Harry Potter series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg',
    birthDate: '1965',
    worksCount: 28,
    topWorks: 'Harry Potter and the Sorcerer\'s Stone',
    books: [
      { title: 'Harry Potter 1', cover: 'https://covers.openlibrary.org/b/id/7984916-M.jpg' },
      { title: 'Harry Potter 2', cover: 'https://covers.openlibrary.org/b/id/8231856-M.jpg' },
      { title: 'Harry Potter 3', cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
    ],
  },
  {
    id: 'OL2162284A',
    name: 'Stephen King',
    bio: 'American author of horror, supernatural fiction, suspense, and fantasy novels. His books have sold more than 350 million copies, and many have been adapted into films, television series, and comic books.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Stephen_King%2C_Comicon.jpg',
    birthDate: '1947',
    worksCount: 243,
    topWorks: 'The Shining',
    books: [
      { title: 'The Shining', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'It', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'The Stand', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL234664A',
    name: 'Agatha Christie',
    bio: 'English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png',
    birthDate: '1890',
    worksCount: 120,
    topWorks: 'Murder on the Orient Express',
    books: [
      { title: 'Murder on the Orient Express', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'And Then There Were None', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'The ABC Murders', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL31574A',
    name: 'George R.R. Martin',
    bio: 'American novelist and short story writer, screenwriter, and television producer. He is the author of the series of epic fantasy novels A Song of Ice and Fire, which was adapted into the Emmy Award-winning HBO series Game of Thrones.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/George_R._R._Martin_2023.jpg/440px-George_R._R._Martin_2023.jpg',
    birthDate: '1948',
    worksCount: 56,
    topWorks: 'A Game of Thrones',
    books: [
      { title: 'A Game of Thrones', cover: 'https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF1000,1000_QL80_.jpg' },
      { title: 'A Clash of Kings', cover: 'https://m.media-amazon.com/images/I/91Nl4RUsGpL._AC_UF1000,1000_QL80_.jpg' },
      { title: 'A Storm of Swords', cover: 'https://m.media-amazon.com/images/I/91d6bhxWVzL._AC_UF1000,1000_QL80_.jpg' },
    ],
  },
  {
    id: 'OL38298A',
    name: 'George Orwell',
    bio: 'English novelist, essayist, journalist and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg',
    birthDate: '1903',
    worksCount: 40,
    topWorks: '1984',
    books: [
      { title: '1984', cover: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
      { title: 'Animal Farm', cover: 'https://covers.openlibrary.org/b/id/8775116-M.jpg' },
      { title: 'Homage to Catalonia', cover: 'https://covers.openlibrary.org/b/id/11153223-M.jpg' },
    ],
  },
  {
    id: 'OL25712A',
    name: 'Neil Gaiman',
    bio: 'English author of short fiction, novels, comic books, graphic novels, and films. His works include the comic book series The Sandman and novels Stardust, American Gods, Coraline, and The Graveyard Book.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kyle-cassidy-neil-gaiman-April-2013.jpg/440px-Kyle-cassidy-neil-gaiman-April-2013.jpg',
    birthDate: '1960',
    worksCount: 74,
    topWorks: 'American Gods',
    books: [
      { title: 'American Gods', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Coraline', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'The Sandman', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL30694A',
    name: 'J.R.R. Tolkien',
    bio: 'English writer, poet, philologist, and academic, best known as the author of the classic high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/J._R._R._Tolkien%2C_1940s.jpg/440px-J._R._R._Tolkien%2C_1940s.jpg',
    birthDate: '1892',
    worksCount: 95,
    topWorks: 'The Lord of the Rings',
    books: [
      { title: 'The Hobbit', cover: 'https://covers.openlibrary.org/b/id/12003830-M.jpg' },
      { title: 'The Lord of the Rings', cover: 'https://covers.openlibrary.org/b/id/12003836-M.jpg' },
      { title: 'The Silmarillion', cover: 'https://covers.openlibrary.org/b/id/8323742-M.jpg' },
    ],
  },
  {
    id: 'OL7944824A',
    name: 'Haruki Murakami',
    bio: 'Japanese writer whose books and stories have been bestsellers in Japan and internationally, with his work translated into 50 languages and selling millions of copies.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Murakami_Haruki_%282009%29.jpg/440px-Murakami_Haruki_%282009%29.jpg',
    birthDate: '1949',
    worksCount: 60,
    topWorks: 'Norwegian Wood',
    books: [
      { title: 'Norwegian Wood', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Kafka on the Shore', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: '1Q84', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL272947A',
    name: 'Gabriel García Márquez',
    bio: 'Colombian novelist, short-story writer, screenwriter, and journalist, known affectionately as Gabo or Gabito throughout Latin America. Considered one of the most significant authors of the 20th century, particularly in the Spanish language.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Gabriel_Garcia_Marquez.jpg/440px-Gabriel_Garcia_Marquez.jpg',
    birthDate: '1927',
    worksCount: 48,
    topWorks: 'One Hundred Years of Solitude',
    books: [
      { title: 'One Hundred Years of Solitude', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Love in the Time of Cholera', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'Chronicle of a Death Foretold', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL118077A',
    name: 'Charles Dickens',
    bio: 'English writer and social critic who created some of the world\'s best-known fictional characters and is regarded by many as the greatest novelist of the Victorian era.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dickens_Gurney_head.jpg/440px-Dickens_Gurney_head.jpg',
    birthDate: '1812',
    worksCount: 135,
    topWorks: 'A Tale of Two Cities',
    books: [
      { title: 'A Tale of Two Cities', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Great Expectations', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'Oliver Twist', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL27728A',
    name: 'Mark Twain',
    bio: 'American writer, humorist, entrepreneur, publisher, and lecturer. Among his novels are The Adventures of Tom Sawyer and its sequel, the Adventures of Huckleberry Finn, the latter often called "The Great American Novel".',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg',
    birthDate: '1835',
    worksCount: 98,
    topWorks: 'Adventures of Huckleberry Finn',
    books: [
      { title: 'Adventures of Huckleberry Finn', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'The Adventures of Tom Sawyer', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'A Connecticut Yankee in King Arthur\'s Court', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL2630733A',
    name: 'Brandon Sanderson',
    bio: 'American author of epic fantasy and science fiction. He is best known for the Cosmere fictional universe, in which most of his fantasy novels, including the Mistborn series and The Stormlight Archive, are set.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg/440px-Brandon_Sanderson_-_Lucca_Comics_%26_Games_2016.jpg',
    birthDate: '1975',
    worksCount: 78,
    topWorks: 'The Way of Kings',
    books: [
      { title: 'The Way of Kings', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Mistborn: The Final Empire', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'The Hero of Ages', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL34184A',
    name: 'Jane Austen',
    bio: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/440px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg',
    birthDate: '1775',
    worksCount: 23,
    topWorks: 'Pride and Prejudice',
    books: [
      { title: 'Pride and Prejudice', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'Sense and Sensibility', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'Emma', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
  {
    id: 'OL24638A',
    name: 'Virginia Woolf',
    bio: 'English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg',
    birthDate: '1882',
    worksCount: 42,
    topWorks: 'Mrs Dalloway',
    books: [
      { title: 'Mrs Dalloway', cover: 'https://covers.openlibrary.org/b/id/8231996-M.jpg' },
      { title: 'To the Lighthouse', cover: 'https://covers.openlibrary.org/b/id/8232001-M.jpg' },
      { title: 'Orlando', cover: 'https://covers.openlibrary.org/b/id/8232002-M.jpg' },
    ],
  },
];

// List of popular author IDs from Open Library
export const popularAuthorIds = [
  'OL23919A',  // J.K. Rowling
  'OL2162284A', // Stephen King
  'OL234664A',  // Agatha Christie
  'OL31574A',   // George R.R. Martin
  'OL38298A',   // George Orwell
  'OL25712A',   // Neil Gaiman
  'OL2630733A', // Brandon Sanderson
  'OL7944824A', // Haruki Murakami
  'OL27728A',   // Mark Twain
  'OL118077A',  // Charles Dickens
  'OL30694A',   // J.R.R. Tolkien
  'OL272947A'   // Gabriel García Márquez
];

const TopAuthors = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [authorBooks, setAuthorBooks] = useState({});
  const carouselRef = useRef(null);
  const authorGridRef = useRef(null);
  
  // Use local data immediately and fetch in background
  useEffect(() => {
    // Immediately set fallback authors to show content right away
    setAuthors(fallbackAuthors);
    setLoading(false);
    
    // Then try to fetch updated data in the background
    const fetchAuthorsInBackground = async () => {
      try {
        // Import our expanded fallback data first
        try {
          const { popularAuthors } = await import('../utils/fallbackData');
          if (popularAuthors) {
            // Convert to array format
            const authorsArray = Object.values(popularAuthors).map(author => ({
              id: author.id,
              name: author.name,
              bio: author.bio,
              photoUrl: author.photoUrl,
              birthDate: author.birthDate,
              worksCount: author.worksCount || 20,
              topWorks: author.topWork,
              topWorksData: []
            }));
            
            if (authorsArray.length >= 5) {
              console.log('Using expanded fallback author data');
              setAuthors(authorsArray);
              return; // Skip API calls if we have good local data
            }
          }
        } catch (importError) {
          console.warn('Error importing fallback data:', importError);
        }
        
        // Only try API calls if we're online and as a background task
        if (navigator.onLine) {
          const authorsData = [];
          
          // Set a timeout to ensure we don't wait too long
          const timeoutPromise = new Promise(resolve => {
            setTimeout(() => resolve([]), 3000); // 3 second timeout
          });
          
          // Race between API calls and timeout
          const fetchPromise = (async () => {
            // Fetch data for each author with a short timeout
            for (const authorId of popularAuthorIds.slice(0, 6)) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                
                const response = await axios.get(
                  `https://openlibrary.org/authors/${authorId}.json`,
                  { signal: controller.signal }
                );
                clearTimeout(timeoutId);
                
                const authorData = response.data;
                
                // Process author data
                authorsData.push({
                  id: authorId,
                  name: authorData.name,
                  bio: authorData.bio ? 
                    (typeof authorData.bio === 'object' ? authorData.bio.value : authorData.bio) : 
                    'No biography available',
                  photoUrl: `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg?default=false`,
                  birthDate: authorData.birth_date || 'Unknown',
                  worksCount: 20, // Default value to avoid additional API call
                  topWorks: authorData.top_work || 'Various works',
                  topWorksData: []
                });
                
                // If we have enough authors, stop fetching
                if (authorsData.length >= 6) {
                  break;
                }
              } catch (error) {
                console.warn(`Error fetching author ${authorId}:`, error);
              }
            }
            return authorsData;
          })();
          
          // Use whichever finishes first
          const result = await Promise.race([fetchPromise, timeoutPromise]);
          
          // Only update if we got enough authors
          if (result.length >= 3) {
            setAuthors(result);
          }
        }
      } catch (error) {
        console.warn('Error in background fetch:', error);
        // We already have fallback data, so no need to update
      }
    };
    
    // Start background fetch after a short delay
    setTimeout(fetchAuthorsInBackground, 100);
  }, []);
  
  // Use local data for books instead of API calls
  useEffect(() => {
    if (!loading && authors.length > 0) {
      const getAuthorBooks = async () => {
        const currentAuthor = authors[activeIndex];
        
        // Skip if we already have this author's books
        if (authorBooks[currentAuthor.id]) return;
        
        // First try to get books from our fallback data
        try {
          const { getFallbackWorks } = await import('../utils/fallbackData');
          const fallbackWorks = getFallbackWorks(currentAuthor.name);
          
          if (fallbackWorks && fallbackWorks.length > 0) {
            console.log(`Using fallback works for ${currentAuthor.name}`);
            
            // Convert to the expected format
            const formattedWorks = fallbackWorks.map(work => ({
              key: work.key,
              title: work.title,
              coverUrl: work.coverUrl
            }));
            
            setAuthorBooks(prev => ({
              ...prev,
              [currentAuthor.id]: formattedWorks
            }));
            
            return; // Skip API call if we have fallback data
          }
        } catch (importError) {
          console.warn('Error importing fallback works:', importError);
        }
        
        // If no fallback data, use the built-in fallback books
        if (fallbackAuthors.some(a => a.id === currentAuthor.id)) {
          const fallbackAuthor = fallbackAuthors.find(a => a.id === currentAuthor.id);
          if (fallbackAuthor && fallbackAuthor.books) {
            setAuthorBooks(prev => ({
              ...prev,
              [currentAuthor.id]: fallbackAuthor.books.map(book => ({
                key: book.title,
                title: book.title,
                coverUrl: book.cover
              }))
            }));
            return;
          }
        }
        
        // Use default book covers if we don't have specific ones
        const defaultBooks = [
          {
            key: 'work1',
            title: `${currentAuthor.name}'s Work 1`,
            coverUrl: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg'
          },
          {
            key: 'work2',
            title: `${currentAuthor.name}'s Work 2`,
            coverUrl: 'https://m.media-amazon.com/images/I/91ocU8970hL._AC_UF1000,1000_QL80_.jpg'
          },
          {
            key: 'work3',
            title: `${currentAuthor.name}'s Work 3`,
            coverUrl: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg'
          }
        ];
        
        setAuthorBooks(prev => ({
          ...prev,
          [currentAuthor.id]: defaultBooks
        }));
        
        // Try API call in the background only if we're online
        if (navigator.onLine) {
          try {
            // Set a timeout to abort if it takes too long
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            const response = await axios.get(
              `https://openlibrary.org/authors/${currentAuthor.id}/works.json?limit=3`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            
            const works = response.data.entries || [];
            
            // Use simple approach - just get the first cover ID without additional API calls
            const booksWithCovers = works.map(work => {
              const coverId = work.covers?.[0];
              return {
                key: work.key,
                title: work.title,
                coverUrl: coverId 
                  ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                  : 'https://via.placeholder.com/150x225?text=No+Cover'
              };
            });
            
            // Only update if we got actual data
            if (booksWithCovers.length > 0) {
              setAuthorBooks(prev => ({
                ...prev,
                [currentAuthor.id]: booksWithCovers
              }));
            }
          } catch (error) {
            console.warn(`Background fetch for ${currentAuthor.id} books failed:`, error);
            // We already have fallback data, so no need to handle error
          }
        }
      };
      
      getAuthorBooks();
    }
  }, [loading, authors, activeIndex, authorBooks]);
  
  // Auto-rotate featured author
  useEffect(() => {
    if (!loading && authors.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % authors.length);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [loading, authors]);
  
  const handleAuthorClick = (authorName) => {
    // Navigate to author details page
    navigate(`/author/${encodeURIComponent(authorName)}`);
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Truncate text
  const truncateBio = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    },
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const currentAuthor = authors[activeIndex] || {};
  const currentAuthorBooks = authorBooks[currentAuthor.id] || [];
  
  return (
    <section className="celebrated-authors-section">
      <div className="section-header">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Celebrated Authors
        </motion.h2>
        <motion.div 
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover literary legends from Open Library
        </motion.div>
      </div>
      
      {/* Always show content, never show loading state */}
      {(
        <motion.div 
          className="authors-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Featured Author Carousel */}
          <div className="featured-author-carousel" ref={carouselRef}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentAuthor.id}
                className="featured-author-card"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="featured-author-image-container">
                  <motion.img 
                    src={currentAuthor.photoUrl} 
                    alt={currentAuthor.name}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    onError={(e) => handleImageError(e, 'author')}
                    loading="eager"
                  />
                </div>
                
                <div className="featured-author-details">
                  <motion.h3 
                    className="featured-author-name"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {currentAuthor.name}
                  </motion.h3>
                  
                  <motion.div 
                    className="featured-author-meta"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {currentAuthor.birthDate && (
                      <span className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Born: {currentAuthor.birthDate}</span>
                      </span>
                    )}
                    
                    {currentAuthor.worksCount > 0 && (
                      <span className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>{currentAuthor.worksCount} Works</span>
                      </span>
                    )}
                  </motion.div>
                  
                  <motion.p 
                    className="featured-author-bio"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {truncateBio(currentAuthor.bio, 200)}
                  </motion.p>
                  
                  <motion.div 
                    className="featured-author-notable"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h4>Notable Work</h4>
                    <p>{currentAuthor.topWorks}</p>
                  </motion.div>
                  
                  {currentAuthorBooks.length > 0 && (
                    <motion.div 
                      className="featured-author-books"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <h4>Popular Books</h4>
                      <div className="books-showcase">
                        {currentAuthorBooks.map((book, idx) => (
                          <motion.div 
                            key={book.key} 
                            className="book-item"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + (idx * 0.1), duration: 0.5 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                          >
                            <img 
                              src={book.coverUrl} 
                              alt={book.title}
                              onError={(e) => handleImageError(e, 'book')}
                              loading="eager"
                            />
                            <span className="book-title">{book.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.button 
                    className="explore-button"
                    onClick={() => handleAuthorClick(currentAuthor.name)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Author
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Navigation */}
            <div className="carousel-navigation">
              <div className="carousel-indicators">
                {authors.map((_, index) => (
                  <button 
                    key={index} 
                    className={`indicator ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View author ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="carousel-controls">
                <motion.button 
                  className="carousel-button prev"
                  onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + authors.length) % authors.length)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous author"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </motion.button>
                <motion.button 
                  className="carousel-button next"
                  onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % authors.length)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next author"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="wave-divider">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          
          {/* Explore More Authors Section */}
          <motion.div 
            className="explore-authors-section"
            ref={authorGridRef}
            variants={containerVariants}
          >
            <div className="explore-authors-header">
              <h3 className="explore-title">Explore More Authors</h3>
              <p className="explore-subtitle">Discover talented writers across various genres and time periods</p>
            </div>
            
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={"auto"}
              speed={1000} // Slower transition speed for smoother movement
              coverflowEffect={{
                rotate: 5, // Slight rotation for more 3D effect
                stretch: 0,
                depth: 150, // Increased depth for more pronounced 3D effect
                modifier: 2,
                slideShadows: true, // Enable slide shadows for more depth
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              pagination={{ 
                clickable: true,
                dynamicBullets: true, // Dynamic bullets for better visual feedback
              }}
              navigation={false} // Remove navigation arrows
              autoplay={{
                delay: 3500, // Slightly faster autoplay (3.5 seconds between slides)
                disableOnInteraction: false,
                pauseOnMouseEnter: true, // Pause on mouse hover
              }}
              className="authors-swiper circular-swiper"
            >
              {authors.map((author, index) => (
                <SwiperSlide key={author.id}>
                  <motion.div 
                    className="author-card"
                    variants={cardVariants}
                    whileHover="hover"
                    custom={index}
                    onClick={() => handleAuthorClick(author.name)}
                  >
                    <div className="author-card-inner">
                      <div className="author-image">
                        <img 
                          src={author.photoUrl} 
                          alt={author.name}
                          onError={(e) => handleImageError(e, 'author')}
                          loading="eager"
                        />
                        <div className="author-overlay">
                          <span className="view-text">View Profile</span>
                        </div>
                      </div>
                      <div className="author-info">
                        <h4>{author.name}</h4>
                        <div className="author-meta">
                          <span className="birth-year">{author.birthDate}</span>
                          <span className="works-count">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                            {author.worksCount} Works
                          </span>
                        </div>
                        <p className="author-bio">{truncateBio(author.bio, 80)}</p>
                        <motion.button 
                          className="view-profile-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAuthorClick(author.name);
                          }}
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="explore-more-button-container">
              <motion.button 
                className="explore-all-authors-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/authors')}
                aria-label="Browse all authors"
              >
                Browse All Authors
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default TopAuthors;