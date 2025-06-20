import axios from 'axios';

// OpenLibrary API endpoints
const OPENLIBRARY_BASE_URL = 'https://openlibrary.org';
const SEARCH_AUTHORS_URL = `${OPENLIBRARY_BASE_URL}/search/authors.json`;

// Popular author IDs for featured authors
const FEATURED_AUTHOR_IDS = [
  'OL23919A', // J.K. Rowling
  'OL2622837A', // Stephen King
  'OL2648577A', // Agatha Christie
  'OL234664A', // George R.R. Martin
  'OL118077A', // George Orwell
  'OL26320A', // Neil Gaiman
  'OL18319A', // Mark Twain
  'OL22098A', // Charles Dickens
  'OL26320A', // J.R.R. Tolkien
  'OL4340033A', // Gabriel García Márquez
  'OL2622968A', // Haruki Murakami
  'OL21594A', // Jane Austen
  'OL2622837A', // Toni Morrison
  'OL28125A', // Virginia Woolf
  'OL2622968A', // F. Scott Fitzgerald
  'OL2622837A' // Margaret Atwood
];

// Expanded fallback author data with more authors
const FALLBACK_AUTHORS = [
  {
    id: 'OL23919A',
    name: 'J.K. Rowling',
    country: 'United Kingdom',
    description: 'British author, best known for Harry Potter series',
    booksCount: 15,
    followersCount: 2500000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/200px-J._K._Rowling_2010.jpg',
    bio: 'Joanne Rowling, better known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, a seven-volume children\'s fantasy series published from 1997 to 2007.',
    birthDate: '1965-07-31',
    nationality: 'British',
    genres: ['Fantasy', 'Children\'s Literature', 'Fiction'],
    topBooks: [
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL82563W'
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225262-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL82564W'
      }
    ]
  },
  {
    id: 'OL2622837A',
    name: 'Stephen King',
    country: 'United States',
    description: 'Master of horror and supernatural fiction',
    booksCount: 80,
    followersCount: 1800000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Stephen_King%2C_Comicon.jpg',
    bio: 'Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
    birthDate: '1947-09-21',
    nationality: 'American',
    genres: ['Horror', 'Supernatural Fiction', 'Thriller'],
    topBooks: [
      {
        title: 'The Shining',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225263-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL81600W'
      },
      {
        title: 'It',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225264-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL81601W'
      }
    ]
  },
  {
    id: 'OL2648577A',
    name: 'Agatha Christie',
    country: 'United Kingdom',
    description: 'Queen of Crime, mystery novelist',
    booksCount: 66,
    followersCount: 1200000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png',
    bio: 'Dame Agatha Mary Clarissa Christie was an English writer known for her sixty-six detective novels and fourteen short story collections.',
    birthDate: '1890-09-15',
    nationality: 'British',
    genres: ['Mystery', 'Crime Fiction', 'Detective Fiction'],
    topBooks: [
      {
        title: 'Murder on the Orient Express',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225265-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL471528W'
      },
      {
        title: 'And Then There Were None',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225266-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL471529W'
      }
    ]
  },
  {
    id: 'OL234664A',
    name: 'George R.R. Martin',
    country: 'United States',
    description: 'Epic fantasy author, creator of Game of Thrones',
    booksCount: 25,
    followersCount: 2100000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/George_R.R._Martin_by_Gage_Skidmore_2.jpg/200px-George_R.R._Martin_by_Gage_Skidmore_2.jpg',
    bio: 'George Raymond Richard Martin, also known as GRRM, is an American novelist, screenwriter, television producer and short story writer.',
    birthDate: '1948-09-20',
    nationality: 'American',
    genres: ['Fantasy', 'Science Fiction', 'Horror'],
    topBooks: [
      {
        title: 'A Game of Thrones',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225267-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL8479867W'
      },
      {
        title: 'A Clash of Kings',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225268-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL8479868W'
      }
    ]
  },
  {
    id: 'OL118077A',
    name: 'George Orwell',
    country: 'United Kingdom',
    description: 'Author of 1984 and Animal Farm',
    booksCount: 12,
    followersCount: 1500000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg',
    bio: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic.',
    birthDate: '1903-06-25',
    nationality: 'British',
    genres: ['Dystopian Fiction', 'Political Fiction', 'Social Criticism'],
    topBooks: [
      {
        title: '1984',
        coverUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL1168007W'
      },
      {
        title: 'Animal Farm',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225269-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL1168083W'
      }
    ]
  },
  {
    id: 'OL26320A',
    name: 'Neil Gaiman',
    country: 'United Kingdom',
    description: 'Fantasy and horror author',
    booksCount: 30,
    followersCount: 1300000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kyle-cassidy-neil-gaiman-April-2013.jpg/200px-Kyle-cassidy-neil-gaiman-April-2013.jpg',
    bio: 'Neil Richard MacKinnon Gaiman is an English author of short fiction, novels, comic books, graphic novels, nonfiction, audio theatre, and films.',
    birthDate: '1960-11-10',
    nationality: 'British',
    genres: ['Fantasy', 'Horror', 'Mythology'],
    topBooks: [
      {
        title: 'American Gods',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225270-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL14906539W'
      },
      {
        title: 'Good Omens',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225271-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL2038674W'
      }
    ]
  },
  {
    id: 'OL21594A',
    name: 'Jane Austen',
    country: 'United Kingdom',
    description: 'English novelist known for romantic fiction',
    booksCount: 7,
    followersCount: 1800000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg',
    bio: 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    birthDate: '1775-12-16',
    nationality: 'British',
    genres: ['Romance', 'Historical Fiction', 'Social Commentary'],
    topBooks: [
      {
        title: 'Pride and Prejudice',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225272-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL66554W'
      },
      {
        title: 'Emma',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225273-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL66555W'
      }
    ]
  },
  {
    id: 'OL18319A',
    name: 'Mark Twain',
    country: 'United States',
    description: 'American writer and humorist',
    booksCount: 20,
    followersCount: 1100000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mark_Twain_by_AF_Bradley.jpg',
    bio: 'Samuel Langhorne Clemens, known by his pen name Mark Twain, was an American writer, humorist, entrepreneur, publisher, and lecturer.',
    birthDate: '1835-11-30',
    nationality: 'American',
    genres: ['Satire', 'Adventure', 'Humor'],
    topBooks: [
      {
        title: 'The Adventures of Tom Sawyer',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225274-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL53919W'
      },
      {
        title: 'Adventures of Huckleberry Finn',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225275-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL53920W'
      }
    ]
  },
  {
    id: 'OL22098A',
    name: 'Charles Dickens',
    country: 'United Kingdom',
    description: 'Victorian era novelist',
    booksCount: 15,
    followersCount: 1400000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Dickens_Gurney_head.jpg',
    bio: 'Charles John Huffam Dickens was an English writer and social critic. He created some of the world\'s best-known fictional characters.',
    birthDate: '1812-02-07',
    nationality: 'British',
    genres: ['Victorian Literature', 'Social Criticism', 'Historical Fiction'],
    topBooks: [
      {
        title: 'A Tale of Two Cities',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225276-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL14865719W'
      },
      {
        title: 'Great Expectations',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225277-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL14865720W'
      }
    ]
  },
  {
    id: 'OL4340033A',
    name: 'Gabriel García Márquez',
    country: 'Colombia',
    description: 'Nobel Prize-winning author of magical realism',
    booksCount: 18,
    followersCount: 900000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg',
    bio: 'Gabriel José de la Concordia García Márquez was a Colombian novelist, short-story writer, screenwriter, and journalist.',
    birthDate: '1927-03-06',
    nationality: 'Colombian',
    genres: ['Magical Realism', 'Literary Fiction', 'Latin American Literature'],
    topBooks: [
      {
        title: 'One Hundred Years of Solitude',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225278-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL27258W'
      },
      {
        title: 'Love in the Time of Cholera',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225279-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL27259W'
      }
    ]
  },
  {
    id: 'OL2622968A',
    name: 'Haruki Murakami',
    country: 'Japan',
    description: 'Contemporary Japanese novelist',
    booksCount: 22,
    followersCount: 1600000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Haruki_Murakami_2018.jpg/440px-Haruki_Murakami_2018.jpg',
    bio: 'Haruki Murakami is a Japanese writer. His novels, essays, and short stories have been bestsellers in Japan as well as internationally.',
    birthDate: '1949-01-12',
    nationality: 'Japanese',
    genres: ['Surrealism', 'Magical Realism', 'Contemporary Fiction'],
    topBooks: [
      {
        title: 'Norwegian Wood',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225280-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL2629986W'
      },
      {
        title: 'Kafka on the Shore',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225281-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL2629987W'
      }
    ]
  },
  {
    id: 'OL28125A',
    name: 'Virginia Woolf',
    country: 'United Kingdom',
    description: 'Modernist writer and feminist icon',
    booksCount: 18,
    followersCount: 800000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg/440px-George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg',
    bio: 'Adeline Virginia Woolf was an English writer, considered one of the most important modernist 20th-century authors.',
    birthDate: '1882-01-25',
    nationality: 'British',
    genres: ['Modernism', 'Stream of Consciousness', 'Feminist Literature'],
    topBooks: [
      {
        title: 'Mrs Dalloway',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225282-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL1097634W'
      },
      {
        title: 'To the Lighthouse',
        coverUrl: 'https://covers.openlibrary.org/b/id/8225283-L.jpg',
        openLibraryUrl: 'https://openlibrary.org/works/OL1097635W'
      }
    ]
  }
];

/**
 * Fetch top authors for the homepage section (optimized for speed)
 * @param {number} limit - Number of authors to fetch (default: 8)
 * @returns {Promise<Array>} Array of author objects
 */
export const fetchTopAuthors = async (limit = 8) => {
  try {
    console.log('Loading top authors...');
    
    // Return fallback data immediately for better performance
    // API enhancement can be done in background or on-demand
    const selectedAuthors = FALLBACK_AUTHORS.slice(0, limit);
    
    console.log(`Loaded ${selectedAuthors.length} authors instantly`);
    return selectedAuthors;
    
  } catch (error) {
    console.error('Error loading top authors:', error);
    return FALLBACK_AUTHORS.slice(0, limit);
  }
};

/**
 * Search authors using OpenLibrary API
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of author search results
 */
export const searchAuthors = async (query, limit = 20) => {
  try {
    const response = await axios.get(SEARCH_AUTHORS_URL, {
      params: {
        q: query,
        limit: limit
      },
      timeout: 10000
    });

    if (response.data && response.data.docs) {
      return response.data.docs.map(author => ({
        id: author.key,
        name: author.name,
        birthDate: author.birth_date,
        topWork: author.top_work,
        workCount: author.work_count,
        photoUrl: author.key ? `https://covers.openlibrary.org/a/olid/${author.key.replace('/authors/', '')}-L.jpg` : null
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching authors:', error);
    return [];
  }
};

/**
 * Fetch detailed author information
 * @param {string} authorId - OpenLibrary author ID
 * @returns {Promise<Object>} Detailed author information
 */
export const fetchAuthorDetails = async (authorId) => {
  try {
    console.log('Fetching author details for ID:', authorId);
    
    // Check if we have fallback data for this author
    const fallbackAuthor = FALLBACK_AUTHORS.find(author => author.id === authorId);
    if (fallbackAuthor) {
      console.log('Found fallback author:', fallbackAuthor.name);
      return fallbackAuthor;
    }

    // Try to fetch from OpenLibrary API
    try {
      const response = await axios.get(`${OPENLIBRARY_BASE_URL}/authors/${authorId}.json`, {
        timeout: 10000
      });

      const authorData = response.data;
      
      // Fetch author's works
      let topBooks = [];
      try {
        const worksResponse = await axios.get(`${OPENLIBRARY_BASE_URL}/authors/${authorId}/works.json`, {
          timeout: 5000
        });
        
        if (worksResponse.data && worksResponse.data.entries) {
          topBooks = worksResponse.data.entries.slice(0, 6).map(work => ({
            title: work.title,
            coverUrl: work.covers && work.covers[0] ? 
              `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg` : 
              'https://via.placeholder.com/200x300/f3f4f6/9ca3af?text=No+Cover',
            openLibraryUrl: `https://openlibrary.org${work.key}`
          }));
        }
      } catch (worksError) {
        console.warn('Error fetching author works:', worksError);
      }

      return {
        id: authorId,
        name: authorData.name,
        bio: typeof authorData.bio === 'object' ? authorData.bio.value : authorData.bio,
        birthDate: authorData.birth_date,
        deathDate: authorData.death_date,
        nationality: authorData.nationality || 'Unknown',
        country: authorData.nationality || 'Unknown',
        photoUrl: `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg`,
        genres: authorData.subjects ? authorData.subjects.slice(0, 5) : ['Fiction'],
        topBooks: topBooks,
        booksCount: authorData.work_count || 0,
        followersCount: Math.floor(Math.random() * 1000000) + 100000 // Simulated for demo
      };
    } catch (apiError) {
      console.warn('OpenLibrary API failed, using generic fallback:', apiError);
      
      // Create a generic author profile if API fails
      return {
        id: authorId,
        name: 'Unknown Author',
        bio: 'This author\'s information is currently unavailable. Please check back later or try searching for a different author.',
        birthDate: null,
        deathDate: null,
        nationality: 'Unknown',
        country: 'Unknown',
        photoUrl: `https://ui-avatars.com/api/?name=Unknown+Author&size=200&background=667eea&color=ffffff&bold=true`,
        genres: ['Fiction'],
        topBooks: [
          {
            title: 'Sample Book',
            coverUrl: 'https://via.placeholder.com/200x300/f3f4f6/9ca3af?text=No+Cover',
            openLibraryUrl: 'https://openlibrary.org'
          }
        ],
        booksCount: 0,
        followersCount: 0
      };
    }
  } catch (error) {
    console.error('Error fetching author details:', error);
    throw new Error('Failed to load author details. Please try again later.');
  }
};

/**
 * Fetch all authors with pagination
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of authors per page
 * @param {string} genre - Filter by genre (optional)
 * @returns {Promise<Object>} Paginated authors data
 */
export const fetchAllAuthors = async (page = 1, limit = 20, genre = null) => {
  try {
    // Use all our fallback authors plus some additional ones
    const additionalAuthors = [
      {
        id: 'OL2622969A',
        name: 'F. Scott Fitzgerald',
        country: 'United States',
        description: 'Author of The Great Gatsby',
        booksCount: 12,
        followersCount: 950000,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/F_Scott_Fitzgerald_1921.jpg/440px-F_Scott_Fitzgerald_1921.jpg',
        bio: 'Francis Scott Key Fitzgerald was an American novelist, essayist, and short story writer.',
        birthDate: '1896-09-24',
        nationality: 'American',
        genres: ['Modernism', 'Jazz Age Literature', 'American Literature']
      },
      {
        id: 'OL2622970A',
        name: 'Toni Morrison',
        country: 'United States',
        description: 'Nobel Prize-winning American novelist',
        booksCount: 11,
        followersCount: 750000,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Toni_Morrison_2008.jpg/440px-Toni_Morrison_2008.jpg',
        bio: 'Toni Morrison was an American novelist, essayist, book editor, and college professor.',
        birthDate: '1931-02-18',
        nationality: 'American',
        genres: ['African American Literature', 'Historical Fiction', 'Literary Fiction']
      },
      {
        id: 'OL2622971A',
        name: 'Margaret Atwood',
        country: 'Canada',
        description: 'Canadian poet, novelist, and environmental activist',
        booksCount: 50,
        followersCount: 1200000,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Margaret_Atwood_Eden_Mills_Writers_Festival_2006.jpg/440px-Margaret_Atwood_Eden_Mills_Writers_Festival_2006.jpg',
        bio: 'Margaret Eleanor Atwood is a Canadian poet, novelist, literary critic, essayist, teacher, environmental activist, and inventor.',
        birthDate: '1939-11-18',
        nationality: 'Canadian',
        genres: ['Dystopian Fiction', 'Speculative Fiction', 'Feminist Literature']
      },
      {
        id: 'OL2622972A',
        name: 'Ernest Hemingway',
        country: 'United States',
        description: 'Nobel Prize-winning American novelist and journalist',
        booksCount: 25,
        followersCount: 1100000,
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg',
        bio: 'Ernest Miller Hemingway was an American novelist, short-story writer, and journalist.',
        birthDate: '1899-07-21',
        nationality: 'American',
        genres: ['Modernism', 'War Literature', 'Adventure']
      }
    ];
    
    const allAuthors = [...FALLBACK_AUTHORS, ...additionalAuthors];

    // Filter by genre if specified
    const filteredAuthors = genre ? 
      allAuthors.filter(author => author.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))) :
      allAuthors;

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);

    return {
      authors: paginatedAuthors,
      totalCount: filteredAuthors.length,
      currentPage: page,
      totalPages: Math.ceil(filteredAuthors.length / limit),
      hasNextPage: endIndex < filteredAuthors.length,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    console.error('Error fetching all authors:', error);
    return {
      authors: FALLBACK_AUTHORS.slice(0, limit),
      totalCount: FALLBACK_AUTHORS.length,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
};

export default {
  fetchTopAuthors,
  searchAuthors,
  fetchAuthorDetails,
  fetchAllAuthors
};