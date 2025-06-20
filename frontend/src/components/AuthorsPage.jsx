import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleImageError } from '../utils/imageUtils';
import '../styles/AuthorsPage.css';

// Import the fallback authors from utility file
import { fallbackAuthors, popularAuthorIds } from '../utils/authorData';

// Additional authors data to provide more options when filtering
const additionalAuthors = [
  {
    id: 'additional_1',
    name: 'Jane Austen',
    bio: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg',
    birthDate: '1775',
    worksCount: 7,
    topWorks: 'Pride and Prejudice',
    genres: ['Romance', 'Historical Fiction']
  },
  {
    id: 'additional_2',
    name: 'Ernest Hemingway',
    bio: 'American novelist, short-story writer, and journalist. His economical and understated style—which he termed the iceberg theory—had a strong influence on 20th-century fiction.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg',
    birthDate: '1899',
    worksCount: 25,
    topWorks: 'The Old Man and the Sea',
    genres: ['Fiction', 'Adventure']
  },
  {
    id: 'additional_3',
    name: 'Virginia Woolf',
    bio: 'English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg',
    birthDate: '1882',
    worksCount: 18,
    topWorks: 'Mrs Dalloway',
    genres: ['Fiction', 'Modernism']
  },
  {
    id: 'additional_4',
    name: 'F. Scott Fitzgerald',
    bio: 'American novelist, essayist, and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/F_Scott_Fitzgerald_1921.jpg/440px-F_Scott_Fitzgerald_1921.jpg',
    birthDate: '1896',
    worksCount: 12,
    topWorks: 'The Great Gatsby',
    genres: ['Fiction', 'Modernism']
  },
  {
    id: 'additional_5',
    name: 'Toni Morrison',
    bio: 'American novelist, essayist, book editor, and college professor. Her first novel, The Bluest Eye, was published in 1970. She was awarded the Nobel Prize in Literature in 1993.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Toni_Morrison.jpg/440px-Toni_Morrison.jpg',
    birthDate: '1931',
    worksCount: 11,
    topWorks: 'Beloved',
    genres: ['Fiction', 'Historical Fiction']
  },
  {
    id: 'additional_6',
    name: 'Gabriel García Márquez',
    bio: 'Colombian novelist, short-story writer, screenwriter, and journalist, known affectionately as Gabo or Gabito throughout Latin America.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Gabriel_Garcia_Marquez.jpg/440px-Gabriel_Garcia_Marquez.jpg',
    birthDate: '1927',
    worksCount: 26,
    topWorks: 'One Hundred Years of Solitude',
    genres: ['Fiction', 'Magical Realism']
  },
  {
    id: 'additional_7',
    name: 'Ursula K. Le Guin',
    bio: 'American author best known for her works of speculative fiction, including science fiction works set in her Hainish universe, and the Earthsea fantasy series.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Ursula_K._Le_Guin.jpg/440px-Ursula_K._Le_Guin.jpg',
    birthDate: '1929',
    worksCount: 22,
    topWorks: 'A Wizard of Earthsea',
    genres: ['Fantasy', 'Science Fiction']
  },
  {
    id: 'additional_8',
    name: 'Haruki Murakami',
    bio: 'Japanese writer. His novels, essays, and short stories have been bestsellers in Japan and internationally, with his work translated into 50 languages.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Murakami_Haruki_%282009%29.jpg/440px-Murakami_Haruki_%282009%29.jpg',
    birthDate: '1949',
    worksCount: 14,
    topWorks: 'Norwegian Wood',
    genres: ['Fiction', 'Magical Realism']
  },
  {
    id: 'additional_9',
    name: 'Chimamanda Ngozi Adichie',
    bio: 'Nigerian writer whose works range from novels to short stories to nonfiction. She is known for her feminism and her advocacy for gender equality.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Chimamanda_Ngozi_Adichie_2015.jpg/440px-Chimamanda_Ngozi_Adichie_2015.jpg',
    birthDate: '1977',
    worksCount: 6,
    topWorks: 'Half of a Yellow Sun',
    genres: ['Fiction', 'Historical Fiction']
  },
  {
    id: 'additional_10',
    name: 'Margaret Atwood',
    bio: 'Canadian poet, novelist, literary critic, essayist, teacher, environmental activist, and inventor. Her works encompass themes of gender and identity, religion and myth, climate change, and power politics.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Margaret_Atwood_2015.jpg/440px-Margaret_Atwood_2015.jpg',
    birthDate: '1939',
    worksCount: 18,
    topWorks: 'The Handmaid\'s Tale',
    genres: ['Fiction', 'Science Fiction', 'Dystopian']
  },
  {
    id: 'additional_11',
    name: 'Kazuo Ishiguro',
    bio: 'British novelist, screenwriter, musician, and short-story writer. He was born in Nagasaki, Japan, and moved to Britain in 1960 when he was five.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kazuo_Ishiguro_in_2017.jpg/440px-Kazuo_Ishiguro_in_2017.jpg',
    birthDate: '1954',
    worksCount: 8,
    topWorks: 'Never Let Me Go',
    genres: ['Fiction', 'Science Fiction']
  },
  {
    id: 'additional_12',
    name: 'Isabel Allende',
    bio: 'Chilean writer, whose works sometimes contain aspects of the genre magical realism, is known for novels such as The House of the Spirits and City of the Beasts.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Isabel_Allende_-_001.jpg/440px-Isabel_Allende_-_001.jpg',
    birthDate: '1942',
    worksCount: 24,
    topWorks: 'The House of the Spirits',
    genres: ['Fiction', 'Magical Realism']
  },
  {
    id: 'additional_13',
    name: 'Salman Rushdie',
    bio: 'Indian-born British-American novelist and essayist whose work often combines magical realism with historical fiction and primarily deals with connections, disruptions, and migrations between Eastern and Western civilizations.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Salman_Rushdie_%282018%29.jpg/440px-Salman_Rushdie_%282018%29.jpg',
    birthDate: '1947',
    worksCount: 14,
    topWorks: 'Midnight\'s Children',
    genres: ['Fiction', 'Magical Realism']
  },
  {
    id: 'additional_14',
    name: 'Alice Walker',
    bio: 'American novelist, short story writer, poet, and social activist. In 1982, she published the novel The Color Purple, for which she won the National Book Award for hardcover fiction, and the Pulitzer Prize for Fiction.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Alice_Walker_%281989%29.jpg/440px-Alice_Walker_%281989%29.jpg',
    birthDate: '1944',
    worksCount: 30,
    topWorks: 'The Color Purple',
    genres: ['Fiction', 'Poetry']
  },
  {
    id: 'additional_15',
    name: 'Octavia E. Butler',
    bio: 'American science fiction author. A multiple recipient of both the Hugo and Nebula awards, she became in 1995 the first science-fiction writer to receive a MacArthur Fellowship.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Octavia_E_Butler.jpg/440px-Octavia_E_Butler.jpg',
    birthDate: '1947',
    worksCount: 15,
    topWorks: 'Kindred',
    genres: ['Science Fiction', 'Fantasy']
  }
];

const AuthorsPage = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // List of genres for filtering
  const genres = [
    'All',
    'Fiction',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Horror',
    'Historical Fiction',
    'Non-fiction',
    'Biography',
    'Poetry',
    'Magical Realism',
    'Dystopian',
    'Adventure',
    'Modernism',
    'Classics',
    'Young Adult',
    'Thriller',
    'Contemporary'
  ];

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      
      try {
        // First try to import expanded fallback data
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
              genres: author.genres || ['Fiction']
            }));
            
            if (authorsArray.length >= 10) {
              console.log('Using expanded fallback author data');
              setAuthors(authorsArray);
              setLoading(false);
              return;
            }
          }
        } catch (importError) {
          console.warn('Error importing fallback data:', importError);
        }
        
        // If no expanded data, use the built-in fallback authors and our additional authors
        // Add some random genres to each fallback author for filtering demo
        const genresList = genres.filter(g => g !== 'All');
        const authorsWithGenres = fallbackAuthors.map(author => ({
          ...author,
          genres: [
            genresList[Math.floor(Math.random() * (genresList.length - 1))],
            genresList[Math.floor(Math.random() * (genresList.length - 1))]
          ]
        }));
        
        // Combine fallback authors with our additional authors
        const combinedAuthors = [...authorsWithGenres, ...additionalAuthors];
        
        // Try to fetch even more authors from the API
        if (navigator.onLine) {
          try {
            const apiAuthors = [];
            
            // Fetch a few more authors beyond the ones we already have
            for (const authorId of popularAuthorIds.slice(6, 12)) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                
                const response = await axios.get(
                  `https://openlibrary.org/authors/${authorId}.json`,
                  { signal: controller.signal }
                );
                clearTimeout(timeoutId);
                
                const authorData = response.data;
                
                // Add random genres for demo purposes
                apiAuthors.push({
                  id: authorId,
                  name: authorData.name,
                  bio: authorData.bio ? 
                    (typeof authorData.bio === 'object' ? authorData.bio.value : authorData.bio) : 
                    'No biography available',
                  photoUrl: `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg?default=false`,
                  birthDate: authorData.birth_date || 'Unknown',
                  worksCount: authorData.work_count || 20,
                  topWorks: authorData.top_work || 'Various works',
                  genres: [
                    genresList[Math.floor(Math.random() * (genresList.length - 1))],
                    genresList[Math.floor(Math.random() * (genresList.length - 1))]
                  ]
                });
              } catch (error) {
                console.warn(`Error fetching author ${authorId}:`, error);
              }
            }
            
            // Combine all authors
            if (apiAuthors.length > 0) {
              setAuthors([...combinedAuthors, ...apiAuthors]);
            } else {
              setAuthors(combinedAuthors);
            }
          } catch (error) {
            console.warn('Error fetching additional authors:', error);
            setAuthors(combinedAuthors);
          }
        } else {
          // Offline mode - use combined local authors
          setAuthors(combinedAuthors);
        }
      } catch (error) {
        console.error('Error in authors fetch:', error);
        // Use basic fallback as last resort
        setAuthors(fallbackAuthors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthors();
  }, []);

  // Filter authors based on search term and selected genre
  const filteredAuthors = authors.filter(author => {
    const matchesSearch = author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = selectedGenre === 'All' || 
                         (author.genres && author.genres.includes(selectedGenre));
    
    return matchesSearch && matchesGenre;
  });

  const handleAuthorClick = (authorName) => {
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  // Function to truncate bio text
  const truncateBio = (bio, maxLength) => {
    if (!bio) return 'No biography available';
    return bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio;
  };

  return (
    <div className="authors-page">
      <div className="authors-page-header">
        <h1 className="authors-page-title">Explore Authors</h1>
        <p className="authors-page-subtitle">
          Discover talented writers across various genres and time periods
        </p>
      </div>
      
      <div className="authors-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search authors by name or biography..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="author-search-input"
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <div className="genre-filter">
          <label htmlFor="genre-select">Filter by genre:</label>
          <select 
            id="genre-select" 
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="genre-select"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="authors-stats">
        <div className="authors-count">
          <span className="count-number">{authors.length}</span> Authors in Collection
          {filteredAuthors.length !== authors.length && (
            <span className="filtered-count"> • Showing {filteredAuthors.length} results</span>
          )}
        </div>
        
        {(searchTerm || selectedGenre !== 'All') && (
          <div className="active-filters">
            {searchTerm && (
              <div className="filter-tag">
                <span>Search: {searchTerm}</span>
                <button 
                  className="clear-filter" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              </div>
            )}
            
            {selectedGenre !== 'All' && (
              <div className="filter-tag">
                <span>Genre: {selectedGenre}</span>
                <button 
                  className="clear-filter" 
                  onClick={() => setSelectedGenre('All')}
                  aria-label="Clear genre filter"
                >
                  ×
                </button>
              </div>
            )}
            
            <button 
              className="clear-all-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="authors-loading">
          <div className="loading-spinner"></div>
          <p>Loading authors...</p>
        </div>
      ) : filteredAuthors.length > 0 ? (
        <div className="authors-grid">
          {filteredAuthors.map((author) => (
            <div 
              key={author.id}
              className="author-card"
              onClick={() => handleAuthorClick(author.name)}
            >
              <div className="author-card-inner">
                <div className="author-image">
                  <img 
                    src={author.photoUrl} 
                    alt={author.name}
                    onError={(e) => handleImageError(e, 'author')}
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
                  {author.genres && (
                    <div className="author-genres">
                      {author.genres.map((genre, index) => (
                        <span key={index} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-authors-found">
          <div className="no-results-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h2>No authors found</h2>
          <p>Try adjusting your search or filter criteria</p>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedGenre('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthorsPage;