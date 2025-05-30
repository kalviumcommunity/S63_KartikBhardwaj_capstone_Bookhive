// API utility functions
import { openLibraryAPI } from './axiosConfig';

/**
 * Fetch data from Open Library API
 * @param {string} endpoint - The API endpoint to fetch from
 * @returns {Promise<any>} - The JSON response
 */
export const fetchFromOpenLibrary = async (endpoint) => {
  try {
    console.log(`Fetching from OpenLibrary: ${endpoint}`);
    
    // First try the proxy endpoint
    try {
      const response = await fetch(`/api/openlibrary${endpoint}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      
      if (response.ok) {
        return response.json();
      }
    } catch (proxyError) {
      console.warn('Proxy fetch failed, trying direct API:', proxyError);
    }
    
    // If proxy fails, try direct API with CORS settings
    const response = await fetch(`https://openlibrary.org${endpoint}`, {
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch from OpenLibrary: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Process book data from Open Library API
 * @param {Array} books - Array of book data from Open Library
 * @param {number} limit - Maximum number of books to return
 * @returns {Array} - Processed book data
 */
export const processBookData = (books, limit = 6) => {
  return books.slice(0, limit).map(book => ({
    id: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : 'Unknown Author',
    coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/book-placeholder.png',
    year: book.first_publish_year || 'Unknown'
  }));
};

/**
 * Fetch author details from Open Library API
 * @param {string} authorName - The name of the author to search for
 * @returns {Promise<Object>} - Author details and works
 */
export const fetchAuthorDetails = async (authorName) => {
  try {
    console.log(`Fetching details for author: ${authorName}`);
    
    // Check if we have cached data for this author
    const cacheKey = `author_details_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        const cacheAge = cacheTime ? Date.now() - parseInt(cacheTime) : Infinity;
        
        // Use cache if it's less than 24 hours old
        if (cacheAge < 24 * 60 * 60 * 1000) {
          console.log(`Using cached author details for: ${authorName}`);
          return parsedData;
        }
      } catch (cacheError) {
        console.warn('Error reading from cache:', cacheError);
      }
    }
    
    // Try to use fallback data first for faster loading
    try {
      const { getFallbackAuthor, getFallbackWorks } = await import('./fallbackData');
      
      // Check if we have this author in our fallback data
      const fallbackAuthor = getFallbackAuthor(authorName);
      if (fallbackAuthor) {
        console.log(`Using fallback data for author: ${authorName}`);
        const fallbackWorks = getFallbackWorks(fallbackAuthor.name);
        
        // Save to cache
        const result = { author: fallbackAuthor, works: fallbackWorks };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } catch (e) {
          console.warn('Error saving fallback data to cache:', e);
        }
        
        return result;
      }
    } catch (fallbackError) {
      console.warn('Error using fallback data:', fallbackError);
    }
    
    // Fallback images for popular authors - using Amazon CDN for reliability
    const authorImages = {
      'J.K. Rowling': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg',
      'Stephen King': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Stephen_King%2C_Comicon.jpg',
      'Agatha Christie': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png',
      'George R.R. Martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/George_R._R._Martin_2023.jpg/440px-George_R._R._Martin_2023.jpg',
      'George Orwell': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg',
      'Neil Gaiman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kyle-cassidy-neil-gaiman-April-2013.jpg/440px-Kyle-cassidy-neil-gaiman-April-2013.jpg',
      'Mark Twain': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mark_Twain_by_AF_Bradley.jpg',
      'Charles Dickens': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Dickens_Gurney_head.jpg',
      'J.R.R. Tolkien': 'https://upload.wikimedia.org/wikipedia/commons/6/66/J._R._R._Tolkien%2C_1940s.jpg',
      'Gabriel García Márquez': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg',
      'Haruki Murakami': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Murakami_Haruki_%282009%29.jpg',
      'Jane Austen': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg'
    };
    
    // Use the safeFetch method for better CORS handling
    const { safeFetch } = await import('./axiosConfig');
    
    // Start a timer to measure performance
    const startTime = performance.now();
    
    // Set a timeout to use fallback data if API is too slow
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ timedOut: true });
      }, 3000); // 3 second timeout
    });
    
    // Race between API call and timeout
    const searchPromise = safeFetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`);
    const searchResult = await Promise.race([searchPromise, timeoutPromise]);
    
    // If timed out, use fallback data
    if (searchResult.timedOut) {
      console.log('API search timed out, using fallback data');
      const { popularAuthors, sampleWorks } = await import('./fallbackData');
      
      // Find a similar author as fallback
      const fallbackAuthorNames = Object.keys(popularAuthors);
      const randomAuthor = fallbackAuthorNames[Math.floor(Math.random() * fallbackAuthorNames.length)];
      
      const result = { 
        author: popularAuthors[randomAuthor], 
        works: sampleWorks[randomAuthor] || [] 
      };
      
      // Save to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch (e) {
        console.warn('Error saving timeout fallback to cache:', e);
      }
      
      return result;
    }
    
    const searchData = searchResult;
    
    if (!searchData.docs || searchData.docs.length === 0) {
      throw new Error('Author not found');
    }
    
    // Get the first matching author
    const authorMatch = searchData.docs[0];
    const authorKey = authorMatch.key.replace('/authors/', '');
    
    // Set another timeout for author details
    const detailsTimeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ timedOut: true });
      }, 3000); // 3 second timeout
    });
    
    // Race between API calls and timeout
    const authorPromise = safeFetch(`https://openlibrary.org/authors/${authorKey}.json`);
    const worksPromise = safeFetch(`https://openlibrary.org/authors/${authorKey}/works.json?limit=10`);
    
    const [authorResult, worksResult] = await Promise.all([
      Promise.race([authorPromise, detailsTimeoutPromise]),
      Promise.race([worksPromise, detailsTimeoutPromise])
    ]);
    
    // If either timed out, use fallback data
    if (authorResult.timedOut || worksResult.timedOut) {
      console.log('API details timed out, using fallback data');
      const { popularAuthors, sampleWorks } = await import('./fallbackData');
      
      // Find a similar author as fallback
      const fallbackAuthorNames = Object.keys(popularAuthors);
      const randomAuthor = fallbackAuthorNames[Math.floor(Math.random() * fallbackAuthorNames.length)];
      
      const result = { 
        author: popularAuthors[randomAuthor], 
        works: sampleWorks[randomAuthor] || [] 
      };
      
      // Save to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      } catch (e) {
        console.warn('Error saving timeout fallback to cache:', e);
      }
      
      return result;
    }
    
    const authorData = authorResult;
    const worksData = worksResult;
    const worksEntries = worksData.entries || [];
    
    // Process author data
    const author = {
      id: authorKey,
      name: authorData.name,
      bio: authorData.bio ? 
        (typeof authorData.bio === 'object' ? authorData.bio.value : authorData.bio) : 
        'No biography available',
      photoUrl: authorImages[authorData.name] || 
        `https://covers.openlibrary.org/a/olid/${authorKey}-L.jpg?default=false&timestamp=${new Date().getTime()}`,
      birthDate: authorData.birth_date || 'Unknown',
      deathDate: authorData.death_date || null,
      wikipedia: authorData.wikipedia || null,
      topWork: authorData.top_work || 'Various works'
    };
    
    // Process only the first 10 works to speed up loading
    const limitedWorks = worksEntries.slice(0, 10);
    
    // Check if we have cached work details
    const worksCacheKey = `works_${authorKey}`;
    let cachedWorks = null;
    
    try {
      const cachedWorksData = localStorage.getItem(worksCacheKey);
      if (cachedWorksData) {
        cachedWorks = JSON.parse(cachedWorksData);
        console.log(`Using ${cachedWorks.length} cached works for ${authorName}`);
      }
    } catch (cacheError) {
      console.warn('Error reading works from cache:', cacheError);
    }
    
    // If we have cached works, use them instead of processing again
    if (cachedWorks && cachedWorks.length >= 3) {
      console.log('Using cached works data');
      return cachedWorks;
    }
    
    // Process works data with simplified error handling for faster loading
    const works = await Promise.all(limitedWorks.map(async (work) => {
      try {
        const workId = work.key.replace('/works/', '');
        
        // Check if we have this work cached individually
        const workCacheKey = `work_${workId}`;
        try {
          const cachedWork = localStorage.getItem(workCacheKey);
          if (cachedWork) {
            return JSON.parse(cachedWork);
          }
        } catch (e) {
          console.warn(`Error reading cached work ${workId}:`, e);
        }
        
        let coverUrl = null;
        let description = work.description || 'No description available';
        let subjects = work.subjects || [];
        
        // Get cover ID - simplified to avoid image verification which is slow
        if (work.covers && work.covers.length > 0) {
          coverUrl = `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`;
        } else {
          // Skip works without covers to speed up loading
          return null;
        }
        
        const result = {
          id: workId,
          key: work.key,
          title: work.title,
          coverUrl: coverUrl,
          description: description,
          firstPublishYear: work.first_publish_year || 'Unknown',
          subjects: subjects
        };
        
        // Cache individual work
        try {
          localStorage.setItem(workCacheKey, JSON.stringify(result));
        } catch (e) {
          console.warn(`Error caching work ${workId}:`, e);
        }
        
        return result;
      } catch (error) {
        console.error(`Error processing work:`, error);
        return null; // Skip works that fail to process
      }
    }));
    
    // Filter out any null works
    const validWorks = works.filter(work => work !== null);
    
    // If we don't have enough works with images, use fallback data
    if (validWorks.length < 3) {
      console.log('Not enough works with images, using fallback data');
      const { sampleWorks } = await import('./fallbackData');
      const fallbackAuthorNames = Object.keys(sampleWorks);
      
      // Try to find a fallback author that matches the genre/style of the current author
      let bestMatch = fallbackAuthorNames[0];
      if (author.name.toLowerCase().includes('fantasy') || author.bio.toLowerCase().includes('fantasy')) {
        bestMatch = 'J.K. Rowling';
      } else if (author.name.toLowerCase().includes('mystery') || author.bio.toLowerCase().includes('mystery')) {
        bestMatch = 'Agatha Christie';
      } else if (author.name.toLowerCase().includes('horror') || author.bio.toLowerCase().includes('horror')) {
        bestMatch = 'Stephen King';
      }
      
      const result = { author, works: sampleWorks[bestMatch] || sampleWorks[fallbackAuthorNames[0]] };
      
      // Save to localStorage for faster loading next time
      try {
        const cacheKey = `author_details_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        console.log(`Cached fallback author details for: ${authorName}`);
      } catch (saveError) {
        console.warn('Error saving to cache:', saveError);
      }
      
      return result;
    }
    
    const result = { author, works: validWorks };
    
    // Save to localStorage for faster loading next time
    try {
      const cacheKey = `author_details_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
      // Log performance metrics
      const endTime = performance.now();
      console.log(`Fetched and cached author details for ${authorName} in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (saveError) {
      console.warn('Error saving to cache:', saveError);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching author details:', error);
    
    // Try to use fallback data for popular authors
    try {
      const { getFallbackAuthor, getFallbackWorks } = await import('./fallbackData');
      const fallbackAuthor = getFallbackAuthor(authorName);
      
      if (fallbackAuthor) {
        console.log(`Using fallback data for author: ${authorName}`);
        const fallbackWorks = getFallbackWorks(authorName);
        return { 
          author: fallbackAuthor, 
          works: fallbackWorks 
        };
      }
    } catch (fallbackError) {
      console.error('Failed to load fallback data:', fallbackError);
    }
    
    throw error;
  }
};