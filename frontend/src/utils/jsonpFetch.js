/**
 * Utility for fetching data from APIs that don't support CORS using JSONP
 * with improved error handling and fallback mechanisms
 */

// Cache for JSONP responses
const jsonpCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Initialize cache from localStorage
try {
  const storedCache = localStorage.getItem('jsonpCache');
  if (storedCache) {
    const parsedCache = JSON.parse(storedCache);
    Object.entries(parsedCache).forEach(([key, value]) => {
      if (Date.now() < value.expiry) {
        jsonpCache.set(key, value);
      }
    });
    console.log(`Loaded ${jsonpCache.size} cached JSONP responses`);
  }
} catch (e) {
  console.warn('Failed to load JSONP cache:', e);
}

// Save cache to localStorage
const saveCache = () => {
  try {
    const cacheObject = {};
    jsonpCache.forEach((value, key) => {
      cacheObject[key] = value;
    });
    localStorage.setItem('jsonpCache', JSON.stringify(cacheObject));
  } catch (e) {
    console.warn('Failed to save JSONP cache:', e);
  }
};

// Save cache periodically
setInterval(saveCache, 60000);

/**
 * Fetch data from an API using JSONP with improved error handling
 * @param {string} url - The URL to fetch from
 * @param {string} callbackParam - The callback parameter name (default: 'callback')
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<any>} - The JSON response
 */
export const fetchJsonp = (url, callbackParam = 'callback', timeout = 15000) => {
  return new Promise((resolve, reject) => {
    // Check cache first
    const cacheKey = `jsonp:${url}`;
    const cachedData = jsonpCache.get(cacheKey);
    
    if (cachedData && Date.now() < cachedData.expiry) {
      console.log(`Using cached JSONP data for ${url}`);
      return resolve(cachedData.data);
    }
    
    // Create a unique callback name
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    
    // Create script element
    const script = document.createElement('script');
    
    // Setup timeout
    let timeoutId;
    
    // Cleanup function to remove script and callbacks
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      // Remove the script tag
      if (script.parentNode) script.parentNode.removeChild(script);
      
      // Remove the callback function
      delete window[callbackName];
    };
    
    // Set timeout
    timeoutId = setTimeout(() => {
      cleanup();
      
      // Try to get fallback data from localStorage
      try {
        const localData = localStorage.getItem(`jsonp_${url}`);
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log(`Using localStorage fallback for timed out JSONP request: ${url}`);
          return resolve(parsedData.data);
        }
      } catch (e) {
        console.warn('Failed to retrieve JSONP fallback from localStorage:', e);
      }
      
      reject(new Error('JSONP request timed out'));
    }, timeout);
    
    // Create the callback function
    window[callbackName] = (data) => {
      cleanup();
      
      // Cache the successful response
      jsonpCache.set(cacheKey, {
        data,
        expiry: Date.now() + CACHE_EXPIRY
      });
      
      // Also save to localStorage
      try {
        localStorage.setItem(`jsonp_${url}`, JSON.stringify({
          data,
          expiry: Date.now() + CACHE_EXPIRY
        }));
      } catch (e) {
        console.warn('Failed to save JSONP data to localStorage:', e);
      }
      
      resolve(data);
    };
    
    // Append callback parameter to URL
    const separator = url.indexOf('?') !== -1 ? '&' : '?';
    const jsonpUrl = `${url}${separator}${callbackParam}=${callbackName}`;
    
    // Set script source and append to document
    script.src = jsonpUrl;
    script.async = true;
    
    script.onerror = () => {
      cleanup();
      
      // Try to get fallback data from localStorage
      try {
        const localData = localStorage.getItem(`jsonp_${url}`);
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log(`Using localStorage fallback for failed JSONP request: ${url}`);
          return resolve(parsedData.data);
        }
      } catch (e) {
        console.warn('Failed to retrieve JSONP fallback from localStorage:', e);
      }
      
      // For Open Library, return empty results as fallback
      if (url.includes('openlibrary.org')) {
        if (url.includes('/works.json')) {
          console.log(`Returning empty works fallback for: ${url}`);
          return resolve({ entries: [] });
        } else if (url.includes('/authors/')) {
          console.log(`Returning empty author fallback for: ${url}`);
          return resolve({ name: 'Unknown Author', works: [] });
        }
      }
      
      reject(new Error('JSONP request failed'));
    };
    
    // Append script to document to start the request
    document.head.appendChild(script);
  });
};

/**
 * Fetch data from Open Library API using JSONP with retries
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {number} retries - Number of retries (default: 2)
 * @returns {Promise<any>} - The JSON response
 */
export const fetchOpenLibraryJsonp = async (endpoint, retries = 2) => {
  const url = `https://openlibrary.org${endpoint}`;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Add a delay between retries
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        console.log(`Retry attempt ${attempt} for ${url}`);
      }
      
      return await fetchJsonp(url);
    } catch (error) {
      lastError = error;
      console.warn(`JSONP attempt ${attempt + 1}/${retries + 1} failed for ${url}:`, error);
    }
  }
  
  // All retries failed, check if we can provide a fallback
  if (url.includes('/works.json')) {
    console.log(`All retries failed, returning empty works fallback for: ${url}`);
    return { entries: [] };
  } else if (url.includes('/authors/')) {
    console.log(`All retries failed, returning empty author fallback for: ${url}`);
    return { name: 'Unknown Author', works: [] };
  }
  
  throw lastError;
};

export default fetchJsonp;