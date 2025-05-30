/**
 * Preloader utility to load and cache data before it's needed
 */

// Import fallback data
import { popularAuthors, sampleWorks } from './fallbackData';

// Function to preload images
const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    // Set a timeout to resolve anyway after 2 seconds
    setTimeout(() => resolve(false), 2000);
  });
};

// Preload all author images
const preloadAuthorImages = async () => {
  console.log('Preloading author images...');
  const imageUrls = Object.values(popularAuthors).map(author => author.photoUrl);
  
  // Load in batches of 3 to avoid overwhelming the browser
  const batchSize = 3;
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    await Promise.all(batch.map(url => preloadImage(url)));
  }
  
  console.log('Author images preloaded');
};

// Preload all book cover images
const preloadBookCovers = async () => {
  console.log('Preloading book covers...');
  const coverUrls = [];
  
  // Collect all book cover URLs
  Object.values(sampleWorks).forEach(works => {
    works.forEach(work => {
      if (work.coverUrl) {
        coverUrls.push(work.coverUrl);
      }
    });
  });
  
  // Load in batches of 5 to avoid overwhelming the browser
  const batchSize = 5;
  for (let i = 0; i < coverUrls.length; i += batchSize) {
    const batch = coverUrls.slice(i, i + batchSize);
    await Promise.all(batch.map(url => preloadImage(url)));
  }
  
  console.log('Book covers preloaded');
};

// Cache all fallback data in localStorage
const cacheFallbackData = () => {
  console.log('Caching fallback data...');
  
  try {
    // Cache author data
    Object.entries(popularAuthors).forEach(([name, author]) => {
      const cacheKey = `author_${name.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(cacheKey, JSON.stringify(author));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    });
    
    // Cache works data
    Object.entries(sampleWorks).forEach(([authorName, works]) => {
      const cacheKey = `works_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(cacheKey, JSON.stringify(works));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
      // Also cache author details with works
      const authorCacheKey = `author_details_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(authorCacheKey, JSON.stringify({
        author: popularAuthors[authorName],
        works: works
      }));
      localStorage.setItem(`${authorCacheKey}_time`, Date.now().toString());
    });
    
    console.log('Fallback data cached successfully');
  } catch (error) {
    console.warn('Error caching fallback data:', error);
  }
};

// Main preload function
export const preloadAllData = async () => {
  console.log('Starting preload of all data...');
  
  // Cache fallback data first (synchronous and fast)
  cacheFallbackData();
  
  // Then preload images in the background
  Promise.all([
    preloadAuthorImages(),
    preloadBookCovers()
  ]).then(() => {
    console.log('All preloading complete');
  }).catch(error => {
    console.warn('Error during preloading:', error);
  });
};

// Call preload immediately
preloadAllData();

export default {
  preloadAllData,
  preloadAuthorImages,
  preloadBookCovers,
  cacheFallbackData
};