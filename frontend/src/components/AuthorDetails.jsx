import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { fetchAuthorDetails } from '../utils/api';
import LoadingAvatar from './LoadingAvatar';
import '../styles/AuthorDetails.css';

const AuthorDetails = () => {
  const { authorName } = useParams();
  const [author, setAuthor] = useState(null);
  const [authorWorks, setAuthorWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleWorks, setVisibleWorks] = useState(12);
  const sectionRef = useRef(null);
  const worksRef = useRef(null);

  // Fallback images for popular authors
  const authorImages = {
    'J.K. Rowling': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg',
    'Stephen King': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Stephen_King%2C_Comicon.jpg',
    'Agatha Christie': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png',
    'George R.R. Martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/George_R.R._Martin_by_Gage_Skidmore_2.jpg/440px-George_R.R._Martin_by_Gage_Skidmore_2.jpg',
    'George Orwell': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg',
    'Neil Gaiman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kyle-cassidy-neil-gaiman-April-2013.jpg/440px-Kyle-cassidy-neil-gaiman-April-2013.jpg',
    'Mark Twain': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mark_Twain_by_AF_Bradley.jpg',
    'Charles Dickens': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Dickens_Gurney_head.jpg',
    'J.R.R. Tolkien': 'https://upload.wikimedia.org/wikipedia/commons/6/66/J._R._R._Tolkien%2C_1940s.jpg',
    'Gabriel García Márquez': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg',
    'Haruki Murakami': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Murakami_Haruki_%282009%29.jpg',
    'Jane Austen': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg'
  };

  // Helper function to safely fetch data with CORS handling
  const fetchWithCORS = async (url) => {
    try {
      // First try with our proxy if available
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl);
        return response.data;
      } catch (proxyError) {
        console.warn('Proxy fetch failed, trying direct with CORS mode:', proxyError);
      }
      
      // If proxy fails, try direct with CORS mode
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      throw error;
    }
  };

  // Helper function to ensure minimum loading time
  const finishLoadingWithDelay = (minTime = 3000) => {
    setLoadingProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, minTime);
  };
  
  // Function to fetch author details - defined outside useEffect so it can be called from retry buttons
  const getAuthorDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      setLoadingProgress(10);
      
      // Add a minimum delay to ensure loading avatar is visible
      const simulateLoading = async () => {
        // Simulate a gradual loading progress
        await new Promise(resolve => setTimeout(() => {
          setLoadingProgress(20);
          resolve();
        }, 800));
        
        await new Promise(resolve => setTimeout(() => {
          setLoadingProgress(30);
          resolve();
        }, 800));
        
        await new Promise(resolve => setTimeout(() => {
          setLoadingProgress(50);
          resolve();
        }, 800));
        
        await new Promise(resolve => setTimeout(() => {
          setLoadingProgress(70);
          resolve();
        }, 800));
      };
      
      // Start the loading simulation
      simulateLoading();
      
      // Immediately show a loading state with placeholder content
      try {
        // Import fallback data immediately to show something while loading
        const { getFallbackAuthor, getFallbackWorks } = await import('../utils/fallbackData');
        const placeholderAuthor = getFallbackAuthor('J.K. Rowling'); // Use a popular author as placeholder
        const placeholderWorks = getFallbackWorks('J.K. Rowling');
        
        if (placeholderAuthor && placeholderWorks) {
          // Show placeholder content immediately
          setAuthor(placeholderAuthor);
          setAuthorWorks(placeholderWorks);
          setLoadingProgress(30);
        }
      } catch (fallbackError) {
        console.warn('Error loading placeholder content:', fallbackError);
      }
      
      // Check if we have this author in localStorage cache
      try {
        const cachedAuthor = localStorage.getItem(`author_${authorName}`);
        const cachedWorks = localStorage.getItem(`works_${authorName}`);
        
        if (cachedAuthor && cachedWorks) {
          const authorData = JSON.parse(cachedAuthor);
          const worksData = JSON.parse(cachedWorks);
          
          // Check if the cache is still valid (less than 24 hours old)
          const cacheTime = localStorage.getItem(`author_${authorName}_time`);
          const cacheAge = cacheTime ? Date.now() - parseInt(cacheTime) : Infinity;
          
          if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
            console.log(`Using cached data for author: ${authorName}`);
            setAuthor(authorData);
            setAuthorWorks(worksData);
            setLoadingProgress(100);
            setLoading(false);
            return;
          }
        }
      } catch (cacheError) {
        console.warn('Error reading from cache:', cacheError);
      }
      
      // Set a timeout to ensure we don't wait too long
      const timeoutId = setTimeout(() => {
        // If we're still loading after 5 seconds, use fallback data
        if (loading) {
          console.log('Loading timed out, using fallback data');
          import('../utils/fallbackData').then(({ getFallbackAuthor, getFallbackWorks }) => {
            // Try to find a similar author
            const fallbackAuthor = getFallbackAuthor(authorName) || getFallbackAuthor('J.K. Rowling');
            const fallbackWorks = getFallbackWorks(fallbackAuthor.name);
            
            setAuthor(fallbackAuthor);
            setAuthorWorks(fallbackWorks);
            setLoadingProgress(100);
            setLoading(false);
          });
        }
      }, 5000);
      
      // Use the existing fetchAuthorDetails utility if possible
      try {
        // Import the utility dynamically to avoid issues
        const { fetchAuthorDetails } = await import('../utils/api');
        
        // Start loading popular authors in the background while we fetch the requested author
        import('../utils/fallbackData').then(({ popularAuthors }) => {
          // Preload popular authors' images
          Object.values(popularAuthors).forEach(author => {
            if (author.photoUrl) {
              const img = new Image();
              img.src = author.photoUrl;
            }
          });
        });
        
        const { author: authorData, works: worksData } = await fetchAuthorDetails(authorName);
        
        // Clear the timeout since we got data
        clearTimeout(timeoutId);
        
        if (!authorData) {
          throw new Error('Author data not found');
        }
        
        // Save to localStorage for faster loading next time
        try {
          localStorage.setItem(`author_${authorName}`, JSON.stringify(authorData));
          localStorage.setItem(`works_${authorName}`, JSON.stringify(worksData));
          localStorage.setItem(`author_${authorName}_time`, Date.now().toString());
        } catch (saveError) {
          console.warn('Error saving to cache:', saveError);
        }
        
        // Verify author has an image - if not, try to find another author
        if (!authorData.photoUrl || authorData.photoUrl.includes('default=false')) {
          console.log('Author image not available, checking for alternative authors');
          
          // Try to find another author with the same name but with an image
          const { safeFetch } = await import('../utils/axiosConfig');
          const searchData = await safeFetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}&limit=5`);
          
          if (searchData.docs && searchData.docs.length > 1) {
            // Try other authors from the search results
            for (let i = 1; i < searchData.docs.length; i++) {
              const altAuthorMatch = searchData.docs[i];
              const altAuthorKey = altAuthorMatch.key.replace('/authors/', '');
              
              // Check if this author has an image
              const testImg = new Image();
              testImg.src = `https://covers.openlibrary.org/a/olid/${altAuthorKey}-M.jpg?default=false`;
              
              // If image loads successfully, use this author instead
              if (await new Promise(resolve => {
                testImg.onload = () => resolve(testImg.width > 1);
                testImg.onerror = () => resolve(false);
                // Set a timeout in case the image check takes too long
                setTimeout(() => resolve(false), 2000);
              })) {
                console.log(`Found alternative author with image: ${altAuthorMatch.name}`);
                // Fetch this author's details instead
                const { author: newAuthorData, works: newWorksData } = 
                  await fetchAuthorDetails(altAuthorMatch.name);
                
                if (newAuthorData) {
                  // Add work count to author data
                  const authorWithCount = {
                    ...newAuthorData,
                    worksCount: newWorksData?.length || 0
                  };
                  
                  setAuthor(authorWithCount);
                  
                  // Process works for this new author
                  const processedWorks = await processAuthorWorks(newWorksData);
                  setAuthorWorks(processedWorks);
                  finishLoadingWithDelay();
                  return; // Exit early with the new author
                }
              }
            }
          }
          
          // If we couldn't find an alternative author with an image, use a fallback
          console.log('No alternative author with image found, using fallback');
          // Try to get a popular author from fallback data
          const { popularAuthors, sampleWorks } = await import('../utils/fallbackData');
          const popularAuthorNames = Object.keys(popularAuthors);
          const randomAuthor = popularAuthorNames[Math.floor(Math.random() * popularAuthorNames.length)];
          
          setAuthor(popularAuthors[randomAuthor]);
          setAuthorWorks(sampleWorks[randomAuthor] || []);
          finishLoadingWithDelay();
          return;
        }
        
        // Add work count to author data
        const authorWithCount = {
          ...authorData,
          worksCount: worksData?.length || 0
        };
        
        setAuthor(authorWithCount);
        
        // Process works and filter out those without images
        const processedWorks = await processAuthorWorks(worksData);
        setAuthorWorks(processedWorks);
        finishLoadingWithDelay();
        return; // Exit early if we successfully used the utility
      } catch (utilError) {
        console.warn('Could not use fetchAuthorDetails utility, falling back to direct implementation:', utilError);
        // Continue with fallback implementation
      }
      
      // Fallback implementation if the utility fails
      // Search for the author by name
      const { safeFetch } = await import('../utils/axiosConfig');
      const searchData = await safeFetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`);
      
      if (!searchData.docs || searchData.docs.length === 0) {
        throw new Error('Author not found');
      }
      
      setLoadingProgress(30);
      
      // Get the first matching author
      const authorMatch = searchData.docs[0];
      const authorKey = authorMatch.key.replace('/authors/', '');
      
      // Fetch detailed author information
      const authorData = await safeFetch(`https://openlibrary.org/authors/${authorKey}.json`);
      
      setLoadingProgress(50);
      
      // Process author data
      const authorInfo = {
        id: authorKey,
        name: authorData.name,
        bio: authorData.bio ? 
          (typeof authorData.bio === 'object' ? authorData.bio.value : authorData.bio) : 
          'No biography available',
        photoUrl: authorImages[authorData.name] || `https://covers.openlibrary.org/a/olid/${authorKey}-L.jpg?default=false&timestamp=${new Date().getTime()}`,
        birthDate: authorData.birth_date || 'Unknown',
        deathDate: authorData.death_date || null,
        wikipedia: authorData.wikipedia || null,
        topWork: authorData.top_work || 'Various works',
        worksCount: authorMatch.work_count || 0
      };
      
      // Verify author has an image - if not, try to find another author
      if (!authorInfo.photoUrl || authorInfo.photoUrl.includes('default=false')) {
        console.log('Author image not available in fallback, checking for alternative authors');
        
        // Try to find another author with an image
        if (searchData.docs.length > 1) {
          // Try other authors from the search results
          for (let i = 1; i < Math.min(searchData.docs.length, 5); i++) {
            const altAuthorMatch = searchData.docs[i];
            const altAuthorKey = altAuthorMatch.key.replace('/authors/', '');
            
            // Check if this author has an image
            const testImg = new Image();
            testImg.src = `https://covers.openlibrary.org/a/olid/${altAuthorKey}-M.jpg?default=false`;
            
            // If image loads successfully, use this author instead
            if (await new Promise(resolve => {
              testImg.onload = () => resolve(testImg.width > 1);
              testImg.onerror = () => resolve(false);
              // Set a timeout in case the image check takes too long
              setTimeout(() => resolve(false), 2000);
            })) {
              console.log(`Found alternative author with image: ${altAuthorMatch.name}`);
              // Fetch this author's details instead
              const altAuthorData = await safeFetch(`https://openlibrary.org/authors/${altAuthorKey}.json`);
              
              const altAuthorInfo = {
                id: altAuthorKey,
                name: altAuthorData.name,
                bio: altAuthorData.bio ? 
                  (typeof altAuthorData.bio === 'object' ? altAuthorData.bio.value : altAuthorData.bio) : 
                  'No biography available',
                photoUrl: `https://covers.openlibrary.org/a/olid/${altAuthorKey}-L.jpg?timestamp=${new Date().getTime()}`,
                birthDate: altAuthorData.birth_date || 'Unknown',
                deathDate: altAuthorData.death_date || null,
                wikipedia: altAuthorData.wikipedia || null,
                topWork: altAuthorData.top_work || 'Various works',
                worksCount: altAuthorMatch.work_count || 0
              };
              
              setAuthor(altAuthorInfo);
              
              // Fetch and process works for this new author
              const altWorksData = await safeFetch(`https://openlibrary.org/authors/${altAuthorKey}/works.json?limit=50`);
              const altWorksEntries = altWorksData.entries || [];
              
              const processedWorks = await processWorksWithImages(altWorksEntries, safeFetch);
              setAuthorWorks(processedWorks);
              
              setLoadingProgress(100);
              setLoading(false);
              return; // Exit early with the new author
            }
          }
        }
        
        // If we couldn't find an alternative author with an image, use a fallback
        console.log('No alternative author with image found, using fallback');
        // Try to get a popular author from fallback data
        const { popularAuthors, sampleWorks } = await import('../utils/fallbackData');
        const popularAuthorNames = Object.keys(popularAuthors);
        const randomAuthor = popularAuthorNames[Math.floor(Math.random() * popularAuthorNames.length)];
        
        setAuthor(popularAuthors[randomAuthor]);
        setAuthorWorks(sampleWorks[randomAuthor] || []);
        setLoadingProgress(100);
        setLoading(false);
        return;
      }
      
      setAuthor(authorInfo);
      setLoadingProgress(70);
      
      // Fetch author's works with more details
      const worksData = await safeFetch(`https://openlibrary.org/authors/${authorKey}/works.json?limit=50`);
      const worksEntries = worksData.entries || [];
      
      setLoadingProgress(85);
      
      // Process works data and fetch cover images, filtering out those without images
      const processedWorks = await processWorksWithImages(worksEntries, safeFetch);
      setAuthorWorks(processedWorks);
      
      setLoadingProgress(100);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching author details:', error);
      setError('Failed to load author details. Please try again later.');
      setLoading(false);
    }
  };
  
  // Helper function to process author works and filter out those without images
  const processAuthorWorks = async (worksData) => {
    if (!worksData || worksData.length === 0) return [];
    
    const processedWorks = await Promise.all((worksData || []).map(async (work) => {
      try {
        if (!work) return null;
        
        let description = work.description || 'No description available';
        let subjects = work.subjects || [];
        
        // If we don't have enough details, try to fetch more
        if (!description || subjects.length === 0) {
          try {
            const workId = work.id;
            if (!workId) throw new Error('Work ID not found');
            
            const { safeFetch } = await import('../utils/axiosConfig');
            const workDetails = await safeFetch(`https://openlibrary.org/works/${workId}.json`);
            
            // Get description
            if (workDetails.description) {
              description = typeof workDetails.description === 'object' 
                ? workDetails.description.value 
                : workDetails.description;
            }
            
            // Get subjects
            if (workDetails.subjects) {
              subjects = workDetails.subjects;
            }
          } catch (error) {
            console.warn(`Error fetching additional details for work:`, error);
          }
        }
        
        // Check if the work has a valid cover image
        if (!work.coverUrl || work.coverUrl.includes('placeholder') || work.coverUrl.includes('ui-avatars')) {
          console.log(`Work "${work.title}" has no cover image, skipping`);
          return null; // Skip works without cover images
        }
        
        return {
          ...work,
          description: description,
          subjects: subjects,
          genres: subjects // For backward compatibility
        };
      } catch (error) {
        console.error(`Error processing work:`, error);
        return null;
      }
    }));
    
    // Filter out any null values and ensure we have at least some works
    const validWorks = processedWorks.filter(work => work !== null);
    
    // If we don't have enough works with images, use fallback data
    if (validWorks.length < 3) {
      console.log('Not enough works with images, using fallback data');
      const { sampleWorks } = await import('../utils/fallbackData');
      const fallbackAuthorNames = Object.keys(sampleWorks);
      const randomAuthor = fallbackAuthorNames[Math.floor(Math.random() * fallbackAuthorNames.length)];
      return sampleWorks[randomAuthor] || [];
    }
    
    return validWorks;
  };
  
  // Helper function to process works and ensure they have images
  const processWorksWithImages = async (worksEntries, safeFetch) => {
    if (!worksEntries || worksEntries.length === 0) return [];
    
    const processedWorks = await Promise.all(worksEntries.map(async (work, index) => {
      try {
        // Extract work ID from key
        const workId = work.key.split('/').pop();
        let coverUrl = null;
        let description = null;
        let subjects = [];
        let firstPublishYear = 'Unknown';
        
        // Try to get more details about the work
        try {
          const workData = await safeFetch(`https://openlibrary.org/works/${workId}.json`);
          
          // Get cover ID
          const coverId = workData.covers?.[0];
          if (coverId) {
            coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?timestamp=${new Date().getTime()}`;
            
            // Verify the cover image exists
            const testImg = new Image();
            testImg.src = coverUrl;
            
            const imageExists = await new Promise(resolve => {
              testImg.onload = () => resolve(testImg.width > 1);
              testImg.onerror = () => resolve(false);
              // Set a timeout in case the image check takes too long
              setTimeout(() => resolve(false), 2000);
            });
            
            if (!imageExists) {
              console.log(`Cover image for "${work.title}" failed to load, skipping`);
              return null; // Skip works without valid cover images
            }
          } else {
            console.log(`No cover ID for "${work.title}", skipping`);
            return null; // Skip works without cover IDs
          }
          
          // Get description
          if (workData.description) {
            description = typeof workData.description === 'object' 
              ? workData.description.value 
              : workData.description;
          }
          
          // Get subjects
          subjects = workData.subjects || [];
          
          // Get first publish year
          firstPublishYear = workData.first_publish_date || work.first_publish_year || 'Unknown';
          
        } catch (error) {
          console.warn(`Error fetching details for work ${workId}:`, error);
          return null; // Skip works that fail to fetch details
        }
        
        return {
          id: workId,
          key: work.key,
          title: work.title,
          coverUrl: coverUrl,
          description: description || 'No description available',
          firstPublishYear: firstPublishYear,
          subjects: subjects,
          genres: work.subjects || []
        };
      } catch (error) {
        console.error(`Error processing work:`, error);
        return null;
      }
    }));
    
    // Filter out any null values from failed processing
    const validWorks = processedWorks.filter(work => work !== null);
    
    // If we don't have enough works with images, use fallback data
    if (validWorks.length < 3) {
      console.log('Not enough works with images, using fallback data');
      const { sampleWorks } = await import('../utils/fallbackData');
      const fallbackAuthorNames = Object.keys(sampleWorks);
      const randomAuthor = fallbackAuthorNames[Math.floor(Math.random() * fallbackAuthorNames.length)];
      return sampleWorks[randomAuthor] || [];
    }
    
    return validWorks;
  };
  
  // Use useEffect to call getAuthorDetails on component mount and when authorName changes
  useEffect(() => {
    getAuthorDetails();
  }, [authorName]);
  
  // Filter works based on active tab
  const filteredWorks = authorWorks.filter(work => {
    if (activeTab === 'all') return true;
    
    // Check if work has subjects/genres that match the active tab
    const allCategories = [...(work.subjects || []), ...(work.genres || [])];
    return allCategories.some(category => 
      category.toLowerCase().includes(activeTab.toLowerCase())
    );
  });
  
  // Load more works
  const loadMoreWorks = () => {
    setVisibleWorks(prev => prev + 12);
  };
  
  // Handle work selection
  const handleWorkSelect = (work) => {
    setSelectedWork(work);
    // Scroll to top when a work is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Close work details
  const closeWorkDetails = () => {
    setSelectedWork(null);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
    hidden: { scale: 0.9, opacity: 0 },
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
  
  // Extract unique genres/categories from all works
  const allCategories = authorWorks.reduce((categories, work) => {
    const workCategories = [...(work.subjects || []), ...(work.genres || [])];
    workCategories.forEach(category => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });
    return categories;
  }, []);
  
  // Select the most common categories (up to 5)
  const topCategories = allCategories
    .map(category => ({
      name: category,
      count: authorWorks.filter(work => 
        (work.subjects || []).includes(category) || 
        (work.genres || []).includes(category)
      ).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(category => category.name);
  
  if (loading) {
    return (
      <LoadingAvatar 
        progress={loadingProgress} 
        message={
          loadingProgress < 30 ? "Searching for author..." :
          loadingProgress < 50 ? "Found author, fetching details..." :
          loadingProgress < 70 ? "Processing author information..." :
          loadingProgress < 85 ? "Fetching author's works..." :
          "Loading book covers and details..."
        }
      />
    );
  }
  
  if (error) {
    return (
      <div className="author-details-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button 
            className="retry-button" 
            onClick={() => {
              setError(null);
              setLoading(true);
              setLoadingProgress(0);
              // Retry after a short delay
              setTimeout(() => {
                getAuthorDetails();
              }, 500);
            }}
          >
            Try Again
          </button>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
        <p className="error-suggestion">
          If the problem persists, try searching for a different author or check your internet connection.
        </p>
      </div>
    );
  }
  
  if (!author) {
    return (
      <div className="author-details-error">
        <h2>Author Not Found</h2>
        <p>We couldn't find information for <strong>{authorName}</strong>.</p>
        <p className="error-suggestion">
          Try checking the spelling or search for a different author.
        </p>
        <div className="error-actions">
          <button 
            className="retry-button" 
            onClick={() => {
              setError(null);
              setLoading(true);
              setLoadingProgress(0);
              // Retry after a short delay
              setTimeout(() => {
                getAuthorDetails();
              }, 500);
            }}
          >
            Try Again
          </button>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="author-profile-container" ref={sectionRef}>
      <AnimatePresence mode="wait">
        {selectedWork ? (
          // Book Details View
          <motion.div 
            key="book-details"
            className="book-details-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button 
              className="close-button"
              onClick={closeWorkDetails}
              aria-label="Close book details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="book-details-content">
              <div className="book-cover-large">
                <motion.img 
                  src={selectedWork.coverUrl} 
                  alt={selectedWork.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  onError={(e) => {
                    // Try different image sizes and sources
                    if (!e.target.src.includes('placeholder') && !e.target.src.includes('ui-avatars')) {
                      console.log(`Trying alternative large cover for: ${selectedWork.title}`);
                      
                      // Try different image format/size from Open Library
                      if (e.target.src.includes('-M.jpg')) {
                        console.log('Trying large size cover');
                        e.target.src = e.target.src.replace('-M.jpg', '-L.jpg');
                      } else if (e.target.src.includes('-S.jpg')) {
                        console.log('Trying medium size cover');
                        e.target.src = e.target.src.replace('-S.jpg', '-M.jpg');
                      } else if (e.target.src.includes('/b/id/')) {
                        // Try ISBN cover if ID cover fails
                        console.log('Trying ISBN cover for large view');
                        // Extract the ID from the URL
                        const idMatch = e.target.src.match(/\/b\/id\/(\d+)/);
                        if (idMatch && idMatch[1]) {
                          // Try a different cover source with the same ID
                          e.target.src = `https://covers.openlibrary.org/b/isbn/${selectedWork.id}-L.jpg`;
                        } else {
                          // Generate a colorful cover with the book title
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedWork.title.substring(0, 2))}&size=400&background=2575fc&color=fff&font-size=0.5`;
                        }
                      } else {
                        // Generate a colorful cover with the book title
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedWork.title.substring(0, 2))}&size=400&background=2575fc&color=fff&font-size=0.5`;
                      }
                      
                      // Set a final fallback
                      e.target.onerror = () => {
                        console.log('All large cover attempts failed, using placeholder');
                        // Create a nicer placeholder with book title
                        const title = selectedWork.title.length > 30 ? selectedWork.title.substring(0, 30) + '...' : selectedWork.title;
                        e.target.src = `https://via.placeholder.com/400x600/2575fc/ffffff?text=${encodeURIComponent(title)}`;
                        e.target.onerror = null;
                      };
                    } else {
                      // Create a nicer placeholder with book title
                      const title = selectedWork.title.length > 30 ? selectedWork.title.substring(0, 30) + '...' : selectedWork.title;
                      e.target.src = `https://via.placeholder.com/400x600/2575fc/ffffff?text=${encodeURIComponent(title)}`;
                      e.target.onerror = null;
                    }
                  }}
                />
                <div className="book-cover-large-overlay">
                  <span>{selectedWork.title}</span>
                </div>
              </div>
              
              <div className="book-info-large">
                <motion.h2 
                  className="book-title-large"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {selectedWork.title}
                </motion.h2>
                
                <motion.div 
                  className="book-meta"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="book-author">By {author.name}</div>
                  <div className="book-publish">First published: {selectedWork.firstPublishYear}</div>
                </motion.div>
                
                <motion.div 
                  className="book-description"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h3>Description</h3>
                  <p>{selectedWork.description}</p>
                </motion.div>
                
                {selectedWork.subjects && selectedWork.subjects.length > 0 && (
                  <motion.div 
                    className="book-subjects-large"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h3>Subjects</h3>
                    <div className="subjects-list">
                      {selectedWork.subjects.map((subject, index) => (
                        <span key={index} className="subject-tag-large">{subject}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  className="book-actions"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <a 
                    href={`https://openlibrary.org${selectedWork.key}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-on-ol-button"
                  >
                    View on Open Library
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="more-by-author"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3>More by {author.name}</h3>
              <div className="more-books-carousel">
                {authorWorks
                  .filter(work => work.id !== selectedWork.id)
                  .slice(0, 6)
                  .map((work, index) => (
                    <motion.div 
                      key={work.id} 
                      className="more-book-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                      onClick={() => handleWorkSelect(work)}
                    >
                      <img 
                        src={work.coverUrl} 
                        alt={work.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                        }}
                      />
                      <span className="more-book-title">{work.title}</span>
                    </motion.div>
                  ))
                }
              </div>
            </motion.div>
            
            <motion.div 
              className="back-to-author"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button 
                className="back-to-author-button"
                onClick={closeWorkDetails}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Author Profile
              </button>
            </motion.div>
          </motion.div>
        ) : (
          // Author Profile View
          <motion.div 
            key="author-profile"
            className="author-profile"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="author-profile-header">
              <motion.div 
                className="author-image-container"
                variants={itemVariants}
              >
                <img 
                  src={author.photoUrl} 
                  alt={author.name} 
                  className="author-image"
                  loading="eager" // Load this image immediately
                  fetchpriority="high" // High priority fetch
                  onError={(e) => {
                    // Check if we have a cached fallback image
                    const cachedFallback = localStorage.getItem(`author_image_${author.id || author.name}`);
                    if (cachedFallback) {
                      console.log(`Using cached fallback image for author: ${author.name}`);
                      e.target.src = cachedFallback;
                      return;
                    }
                    
                    // Try a different image source format first
                    if (author.id && !e.target.src.includes('placeholder') && !e.target.src.includes('ui-avatars')) {
                      console.log(`Trying alternative image for author: ${author.name}`);
                      
                      // Try different image format from Open Library
                      if (e.target.src.includes('-L.jpg')) {
                        console.log('Trying medium size image');
                        const newSrc = `https://covers.openlibrary.org/a/olid/${author.id}-M.jpg`;
                        e.target.src = newSrc;
                        
                        // Cache this fallback for future use
                        try {
                          localStorage.setItem(`author_image_${author.id || author.name}`, newSrc);
                        } catch (e) {
                          console.warn('Failed to cache fallback image:', e);
                        }
                      } else if (e.target.src.includes('-M.jpg')) {
                        console.log('Trying small size image');
                        const newSrc = `https://covers.openlibrary.org/a/olid/${author.id}-S.jpg`;
                        e.target.src = newSrc;
                        
                        // Cache this fallback for future use
                        try {
                          localStorage.setItem(`author_image_${author.id || author.name}`, newSrc);
                        } catch (e) {
                          console.warn('Failed to cache fallback image:', e);
                        }
                      } else {
                        // Try a generated avatar with author initials
                        console.log('Using generated avatar');
                        const newSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=300&background=6a11cb&color=fff&font-size=0.33`;
                        e.target.src = newSrc;
                        
                        // Cache this fallback for future use
                        try {
                          localStorage.setItem(`author_image_${author.id || author.name}`, newSrc);
                        } catch (e) {
                          console.warn('Failed to cache fallback image:', e);
                        }
                      }
                      
                      // Set a final fallback
                      e.target.onerror = () => {
                        console.log('All image attempts failed, using placeholder');
                        const finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=300&background=6a11cb&color=fff&font-size=0.33`;
                        e.target.src = finalSrc;
                        e.target.onerror = null;
                        
                        // Cache this fallback for future use
                        try {
                          localStorage.setItem(`author_image_${author.id || author.name}`, finalSrc);
                        } catch (e) {
                          console.warn('Failed to cache fallback image:', e);
                        }
                      };
                    } else {
                      // Use a nicer placeholder with author initials
                      console.log('Using placeholder with initials');
                      const finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=300&background=6a11cb&color=fff&font-size=0.33`;
                      e.target.src = finalSrc;
                      e.target.onerror = null;
                      
                      // Cache this fallback for future use
                      try {
                        localStorage.setItem(`author_image_${author.id || author.name}`, finalSrc);
                      } catch (e) {
                        console.warn('Failed to cache fallback image:', e);
                      }
                    }
                  }}
                />
                <div className="author-image-overlay">
                  <span>{author.name}</span>
                </div>
              </motion.div>
              
              <div className="author-header-content">
                <motion.h1 
                  className="author-name"
                  variants={itemVariants}
                >
                  {author.name}
                </motion.h1>
                
                <motion.div 
                  className="author-meta"
                  variants={itemVariants}
                >
                  <div className="author-stats">
                    {author.worksCount > 0 && (
                      <div className="stat-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>{author.worksCount} Works</span>
                      </div>
                    )}
                    
                    {author.birthDate && (
                      <div className="stat-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Born: {author.birthDate}</span>
                      </div>
                    )}
                    
                    {author.deathDate && (
                      <div className="stat-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                          <path d="M12 8v8"></path>
                          <path d="M12 16v.01"></path>
                        </svg>
                        <span>Died: {author.deathDate}</span>
                      </div>
                    )}
                  </div>
                  
                  {author.topWork && (
                    <motion.div 
                      className="notable-work"
                      variants={itemVariants}
                    >
                      <h3>Notable Work</h3>
                      <p>{author.topWork}</p>
                    </motion.div>
                  )}
                  
                  {author.wikipedia && (
                    <motion.a 
                      href={author.wikipedia} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="wikipedia-button"
                      variants={itemVariants}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      View on Wikipedia
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="author-bio-section"
              variants={itemVariants}
            >
              <h2>Biography</h2>
              <div className="author-bio">
                <p>{author.bio}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="author-works-section"
              variants={itemVariants}
              ref={worksRef}
            >
              <div className="works-header">
                <h2>Works by {author.name}</h2>
                <div className="works-count">{filteredWorks.length} books</div>
              </div>
              
              {topCategories.length > 0 && (
                <div className="category-filters">
                  <button 
                    className={`category-filter ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  {topCategories.map((category, index) => (
                    <button 
                      key={index}
                      className={`category-filter ${activeTab === category ? 'active' : ''}`}
                      onClick={() => setActiveTab(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
              
              {filteredWorks.length > 0 ? (
                <>
                  <motion.div 
                    className="works-grid"
                    variants={containerVariants}
                  >
                    <AnimatePresence>
                      {filteredWorks.slice(0, visibleWorks).map((work) => (
                        <motion.div 
                          key={work.id} 
                          className="work-card"
                          variants={cardVariants}
                          whileHover="hover"
                          layout
                          onClick={() => handleWorkSelect(work)}
                        >
                          <div className="work-cover">
                            <img 
                              src={work.coverUrl} 
                              alt={work.title}
                              loading="lazy"
                              onError={(e) => {
                                // Check if we have a cached fallback image
                                const cachedFallback = localStorage.getItem(`book_cover_${work.id}`);
                                if (cachedFallback) {
                                  console.log(`Using cached fallback cover for: ${work.title}`);
                                  e.target.src = cachedFallback;
                                  return;
                                }
                                
                                // Try different image sizes and sources
                                if (!e.target.src.includes('placeholder') && !e.target.src.includes('ui-avatars')) {
                                  console.log(`Trying alternative cover for: ${work.title}`);
                                  
                                  // Try different image format/size from Open Library
                                  if (e.target.src.includes('-L.jpg')) {
                                    console.log('Trying medium size cover');
                                    const newSrc = e.target.src.replace('-L.jpg', '-M.jpg');
                                    e.target.src = newSrc;
                                    
                                    // Cache this fallback for future use
                                    try {
                                      localStorage.setItem(`book_cover_${work.id}`, newSrc);
                                    } catch (e) {
                                      console.warn('Failed to cache fallback cover:', e);
                                    }
                                  } else if (e.target.src.includes('-M.jpg')) {
                                    console.log('Trying small size cover');
                                    const newSrc = e.target.src.replace('-M.jpg', '-S.jpg');
                                    e.target.src = newSrc;
                                    
                                    // Cache this fallback for future use
                                    try {
                                      localStorage.setItem(`book_cover_${work.id}`, newSrc);
                                    } catch (e) {
                                      console.warn('Failed to cache fallback cover:', e);
                                    }
                                  } else if (e.target.src.includes('/b/id/')) {
                                    // Try ISBN cover if ID cover fails
                                    console.log('Trying ISBN cover');
                                    // Extract the ID from the URL
                                    const idMatch = e.target.src.match(/\/b\/id\/(\d+)/);
                                    if (idMatch && idMatch[1]) {
                                      // Try a different cover source with the same ID
                                      const newSrc = `https://covers.openlibrary.org/b/isbn/${work.id}-M.jpg`;
                                      e.target.src = newSrc;
                                      
                                      // Cache this fallback for future use
                                      try {
                                        localStorage.setItem(`book_cover_${work.id}`, newSrc);
                                      } catch (e) {
                                        console.warn('Failed to cache fallback cover:', e);
                                      }
                                    } else {
                                      // Generate a colorful cover with the book title
                                      const newSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.title.substring(0, 2))}&size=200&background=2575fc&color=fff&font-size=0.5`;
                                      e.target.src = newSrc;
                                      
                                      // Cache this fallback for future use
                                      try {
                                        localStorage.setItem(`book_cover_${work.id}`, newSrc);
                                      } catch (e) {
                                        console.warn('Failed to cache fallback cover:', e);
                                      }
                                    }
                                  } else {
                                    // Generate a colorful cover with the book title
                                    const newSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.title.substring(0, 2))}&size=200&background=2575fc&color=fff&font-size=0.5`;
                                    e.target.src = newSrc;
                                    
                                    // Cache this fallback for future use
                                    try {
                                      localStorage.setItem(`book_cover_${work.id}`, newSrc);
                                    } catch (e) {
                                      console.warn('Failed to cache fallback cover:', e);
                                    }
                                  }
                                  
                                  // Set a final fallback
                                  e.target.onerror = () => {
                                    console.log('All cover attempts failed, using placeholder');
                                    // Create a nicer placeholder with book title
                                    const title = work.title.length > 20 ? work.title.substring(0, 20) + '...' : work.title;
                                    const finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.title.substring(0, 2))}&size=200&background=2575fc&color=fff&font-size=0.5`;
                                    e.target.src = finalSrc;
                                    e.target.onerror = null;
                                    
                                    // Cache this fallback for future use
                                    try {
                                      localStorage.setItem(`book_cover_${work.id}`, finalSrc);
                                    } catch (e) {
                                      console.warn('Failed to cache fallback cover:', e);
                                    }
                                  };
                                } else {
                                  // Create a nicer placeholder with book title
                                  const finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(work.title.substring(0, 2))}&size=200&background=2575fc&color=fff&font-size=0.5`;
                                  e.target.src = finalSrc;
                                  e.target.onerror = null;
                                  
                                  // Cache this fallback for future use
                                  try {
                                    localStorage.setItem(`book_cover_${work.id}`, finalSrc);
                                  } catch (e) {
                                    console.warn('Failed to cache fallback cover:', e);
                                  }
                                }
                              }}
                            />
                            <div className="work-cover-overlay">
                              <span>{work.title}</span>
                            </div>
                          </div>
                          <div className="work-info">
                            <h3 className="work-title">{work.title}</h3>
                            <p className="work-year">Published: {work.firstPublishYear}</p>
                            {work.subjects && work.subjects.length > 0 && (
                              <div className="work-subjects">
                                {work.subjects.slice(0, 2).map((subject, index) => (
                                  <span key={index} className="subject-tag">{subject}</span>
                                ))}
                              </div>
                            )}
                            <button className="view-details-button">
                              View Details
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  {visibleWorks < filteredWorks.length && (
                    <motion.div 
                      className="load-more"
                      variants={itemVariants}
                    >
                      <button 
                        className="load-more-button"
                        onClick={loadMoreWorks}
                      >
                        Load More Books
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="no-works">
                  <p>No works found for this author in the selected category.</p>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="back-to-home"
              variants={itemVariants}
            >
              <Link to="/" className="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthorDetails;