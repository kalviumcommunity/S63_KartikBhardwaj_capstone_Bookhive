import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PopularCategories.css';

const categories = [
  { id: 'fiction', name: 'Fiction', icon: '📚' },
  { id: 'mystery', name: 'Mystery', icon: '🔍' },
  { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'romance', name: 'Romance', icon: '❤️' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨' }
];

// Local data for each category to avoid API calls
const categoryBooks = {
  fiction: [
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverUrl: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
      year: '1960'
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://m.media-amazon.com/images/I/71FWl4nsx-L._AC_UF1000,1000_QL80_.jpg',
      year: '1925'
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverUrl: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
      year: '1813'
    },
    {
      title: '1984',
      author: 'George Orwell',
      coverUrl: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg',
      year: '1949'
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      coverUrl: 'https://m.media-amazon.com/images/I/91HPG31dTwL._AC_UF1000,1000_QL80_.jpg',
      year: '1951'
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      coverUrl: 'https://m.media-amazon.com/images/I/81zE42gT3xL._AC_UF1000,1000_QL80_.jpg',
      year: '1932'
    }
  ],
  mystery: [
    {
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      coverUrl: 'https://m.media-amazon.com/images/I/819tZUov6FL._AC_UF1000,1000_QL80_.jpg',
      year: '1939'
    },
    {
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      coverUrl: 'https://m.media-amazon.com/images/I/91lslnZ-btL._AC_UF1000,1000_QL80_.jpg',
      year: '2019'
    },
    {
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      coverUrl: 'https://m.media-amazon.com/images/I/71FZx3CEcuL._AC_UF1000,1000_QL80_.jpg',
      year: '2012'
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      coverUrl: 'https://m.media-amazon.com/images/I/91pheKRvTzL._AC_UF1000,1000_QL80_.jpg',
      year: '2005'
    },
    {
      title: 'The Da Vinci Code',
      author: 'Dan Brown',
      coverUrl: 'https://m.media-amazon.com/images/I/91Q5dCjc2KL._AC_UF1000,1000_QL80_.jpg',
      year: '2003'
    },
    {
      title: 'Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      coverUrl: 'https://m.media-amazon.com/images/I/71+yg+JI+LL._AC_UF1000,1000_QL80_.jpg',
      year: '1887'
    }
  ],
  scifi: [
    {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg',
      year: '1965'
    },
    {
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      author: 'Douglas Adams',
      coverUrl: 'https://m.media-amazon.com/images/I/81XSN3hA5gL._AC_UF1000,1000_QL80_.jpg',
      year: '1979'
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      coverUrl: 'https://m.media-amazon.com/images/I/71s0GJ4N5jL._AC_UF1000,1000_QL80_.jpg',
      year: '1984'
    },
    {
      title: 'Foundation',
      author: 'Isaac Asimov',
      coverUrl: 'https://m.media-amazon.com/images/I/71s4smvHT1L._AC_UF1000,1000_QL80_.jpg',
      year: '1951'
    },
    {
      title: 'The Martian',
      author: 'Andy Weir',
      coverUrl: 'https://m.media-amazon.com/images/I/91yknhjHBpL._AC_UF1000,1000_QL80_.jpg',
      year: '2011'
    },
    {
      title: 'Ready Player One',
      author: 'Ernest Cline',
      coverUrl: 'https://m.media-amazon.com/images/I/919fw4fgXpL._AC_UF1000,1000_QL80_.jpg',
      year: '2011'
    }
  ],
  romance: [
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverUrl: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
      year: '1813'
    },
    {
      title: 'Outlander',
      author: 'Diana Gabaldon',
      coverUrl: 'https://m.media-amazon.com/images/I/71s6PscQSQL._AC_UF1000,1000_QL80_.jpg',
      year: '1991'
    },
    {
      title: 'The Notebook',
      author: 'Nicholas Sparks',
      coverUrl: 'https://m.media-amazon.com/images/I/81ZgdocN+CL._AC_UF1000,1000_QL80_.jpg',
      year: '1996'
    },
    {
      title: 'Me Before You',
      author: 'Jojo Moyes',
      coverUrl: 'https://m.media-amazon.com/images/I/81TE3xQR+cL._AC_UF1000,1000_QL80_.jpg',
      year: '2012'
    },
    {
      title: 'The Fault in Our Stars',
      author: 'John Green',
      coverUrl: 'https://m.media-amazon.com/images/I/817tHNcyAgL._AC_UF1000,1000_QL80_.jpg',
      year: '2012'
    },
    {
      title: 'It Ends with Us',
      author: 'Colleen Hoover',
      coverUrl: 'https://m.media-amazon.com/images/I/81s0B6NYXML._AC_UF1000,1000_QL80_.jpg',
      year: '2016'
    }
  ],
  fantasy: [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      coverUrl: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg',
      year: '1997'
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      coverUrl: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
      year: '1937'
    },
    {
      title: 'A Game of Thrones',
      author: 'George R.R. Martin',
      coverUrl: 'https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF1000,1000_QL80_.jpg',
      year: '1996'
    },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      coverUrl: 'https://m.media-amazon.com/images/I/91b8oNwaV1L._AC_UF1000,1000_QL80_.jpg',
      year: '2007'
    },
    {
      title: 'Mistborn',
      author: 'Brandon Sanderson',
      coverUrl: 'https://m.media-amazon.com/images/I/81NGfT4J9oL._AC_UF1000,1000_QL80_.jpg',
      year: '2006'
    },
    {
      title: 'The Lion, the Witch and the Wardrobe',
      author: 'C.S. Lewis',
      coverUrl: 'https://m.media-amazon.com/images/I/81QUw81WcoL._AC_UF1000,1000_QL80_.jpg',
      year: '1950'
    }
  ]
};

const PopularCategories = () => {
  const [activeCategory, setActiveCategory] = useState('fiction');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false since we use local data
  
  useEffect(() => {
    // Simulate loading for a smoother experience
    setLoading(true);
    
    // Use setTimeout to simulate network request and avoid UI jank
    const timer = setTimeout(() => {
      setBooks(categoryBooks[activeCategory] || []);
        setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeCategory]);
  
  return (
    <section className="popular-categories">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Popular Categories
      </motion.h2>

      <div className="categories-tabs">
        {categories.map((category) => (
          <motion.button
              key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="category-icon">{category.icon}</span>
              {category.name}
          </motion.button>
          ))}
        </div>
        
      <div className="books-grid">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading"
            >
              Loading books...
            </motion.div>
          ) : (
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="books-container"
            >
              {books.map((book, index) => (
                <motion.div 
                  key={book.title}
                  className="book-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <div className="book-cover">
                    <img src={book.coverUrl} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">{book.author}</p>
                    <p className="year">{book.year}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PopularCategories;