import axios from 'axios';
import { createLoadingHandler } from './loadingUtils';

// Configure axios defaults for external APIs
axios.defaults.withCredentials = false;
axios.defaults.timeout = 3000; // Global 3 second timeout for all requests

// Create a cache for API responses
const apiCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds - increased for better caching

// Initialize localStorage cache on load
try {
  const storedCache = localStorage.getItem('apiCache');
  if (storedCache) {
    const parsedCache = JSON.parse(storedCache);
    // Only load cache items that haven't expired
    Object.entries(parsedCache).forEach(([key, value]) => {
      if (Date.now() < value.expiry) {
        apiCache.set(key, value);
      }
    });
    console.log(`Loaded ${apiCache.size} cached API responses from localStorage`);
  }
} catch (e) {
  console.warn('Failed to load cache from localStorage:', e);
}

// Save cache to localStorage periodically
setInterval(() => {
  try {
    const cacheObject = {};
    apiCache.forEach((value, key) => {
      cacheObject[key] = value;
    });
    localStorage.setItem('apiCache', JSON.stringify(cacheObject));
    console.log(`Saved ${apiCache.size} cached API responses to localStorage`);
  } catch (e) {
    console.warn('Failed to save cache to localStorage:', e);
  }
}, 60000); // Save every minute

// Helper function to create a proxy URL
const createProxyUrl = (url) => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

// Create an instance for OpenLibrary API with proxy fallback
export const openLibraryAPI = axios.create({
  baseURL: 'https://openlibrary.org',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 3000 // Reduced to 3 seconds for faster feedback
});

// Add request interceptor to handle CORS issues and caching
openLibraryAPI.interceptors.request.use(
  async config => {
    // Store the original URL for potential fallback
    config.originalUrl = config.url;
    
    // Check if we have a cached response for this request
    const cacheKey = `${config.method || 'GET'}:${config.baseURL}${config.url}`;
    const cachedResponse = apiCache.get(cacheKey);
    
    if (cachedResponse && Date.now() < cachedResponse.expiry) {
      console.log(`Using cached data for ${config.url}`);
      // Return a special object that will be handled by the response interceptor
      return {
        ...config,
        adapter: (config) => {
          return Promise.resolve({
            data: cachedResponse.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            cached: true
          });
        }
      };
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling, CORS fallback, and caching
openLibraryAPI.interceptors.response.use(
  response => {
    // If this is a cached response, return it directly
    if (response.cached) {
      return response;
    }
    
    // Cache the successful response
    const cacheKey = `${response.config.method || 'GET'}:${response.config.baseURL}${response.config.originalUrl || response.config.url}`;
    apiCache.set(cacheKey, {
      data: response.data,
      expiry: Date.now() + CACHE_EXPIRY
    });
    
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // If we haven't tried the proxy yet and it's a CORS or network error
    if (!originalRequest._triedProxy && 
        (error.code === 'ERR_NETWORK' || 
         error.message.includes('CORS') || 
         error.message.includes('Network Error'))) {
      
      originalRequest._triedProxy = true;
      
      try {
        // Check cache before trying proxy
        const fullUrl = originalRequest.baseURL + originalRequest.originalUrl;
        const cacheKey = `GET:${fullUrl}`;
        const cachedResponse = apiCache.get(cacheKey);
        
        if (cachedResponse && Date.now() < cachedResponse.expiry) {
          console.log(`Using cached data for proxy fallback: ${fullUrl}`);
          return { data: cachedResponse.data, cached: true };
        }
        
        // Try using the proxy
        const proxyUrl = createProxyUrl(fullUrl);
        console.log(`Trying proxy for: ${fullUrl}`);
        
        const response = await axios({
          url: proxyUrl,
          method: originalRequest.method,
          data: originalRequest.data,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 3000 // Reduced timeout
        });
        
        // Cache the successful proxy response
        apiCache.set(cacheKey, {
          data: response.data,
          expiry: Date.now() + CACHE_EXPIRY
        });
        
        return response;
      } catch (proxyError) {
        console.error('Proxy attempt failed:', proxyError);
        return Promise.reject(proxyError);
      }
    }
    
    // If the error is due to timeout or network issues and we haven't retried yet
    if ((error.code === 'ECONNABORTED' || !error.response) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Check cache before retrying
      const fullUrl = originalRequest.baseURL + originalRequest.originalUrl;
      const cacheKey = `GET:${fullUrl}`;
      const cachedResponse = apiCache.get(cacheKey);
      
      if (cachedResponse && Date.now() < cachedResponse.expiry) {
        console.log(`Using cached data for retry fallback: ${fullUrl}`);
        return { data: cachedResponse.data, cached: true };
      }
      
      // Wait a shorter time before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retry the request
      return openLibraryAPI(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Get the backend API URL from environment or use default
const getBackendUrl = () => {
  // Check if window.env is defined (for runtime environment variables)
  if (window.env && window.env.REACT_APP_API_URL) {
    return window.env.REACT_APP_API_URL;
  }
  
  // Check if import.meta.env is defined (for Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default fallback
  return 'http://localhost:5001';
};

// Create an instance for your backend API
export const backendAPI = axios.create({
  baseURL: getBackendUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000 // Reduced timeout
});

// Add a method to safely fetch from external APIs with CORS handling and caching
export const safeFetch = async (url, options = {}) => {
  // Generate cache key
  const cacheKey = `${options.method || 'GET'}:${url}`;
  
  // Check cache first
  const cachedResponse = apiCache.get(cacheKey);
  if (cachedResponse && Date.now() < cachedResponse.expiry) {
    console.log(`Using cached data for ${url}`);
    return cachedResponse.data;
  }
  
  try {
    // First try direct request with shorter timeout
    try {
      const response = await axios.get(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        },
        timeout: options.timeout || 3000, // Reduced timeout
        withCredentials: false
      });
      
      // Cache the successful response
      apiCache.set(cacheKey, {
        data: response.data,
        expiry: Date.now() + CACHE_EXPIRY
      });
      
      // Also save to localStorage for persistence
      try {
        localStorage.setItem(`api_${cacheKey}`, JSON.stringify({
          data: response.data,
          expiry: Date.now() + CACHE_EXPIRY
        }));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      
      return response.data;
    } catch (directError) {
      console.warn(`Direct request failed for ${url}, trying proxy:`, directError);
      
      // If direct request fails, try proxy with shorter timeout
      try {
        const proxyUrl = createProxyUrl(url);
        const response = await axios.get(proxyUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: options.timeout || 3000 // Reduced timeout
        });
        
        // Cache the successful proxy response
        apiCache.set(cacheKey, {
          data: response.data,
          expiry: Date.now() + CACHE_EXPIRY
        });
        
        return response.data;
      } catch (proxyError) {
        console.warn(`Proxy request failed for ${url}, trying JSONP:`, proxyError);
        
        // If proxy fails and it's an Open Library URL, try JSONP as last resort
        if (url.includes('openlibrary.org')) {
          try {
            // Dynamically import the JSONP module to avoid issues if it's not supported
            const { fetchJsonp } = await import('./jsonpFetch');
            
            // Convert the full URL to just the path for Open Library
            const openLibraryPath = url.replace('https://openlibrary.org', '');
            
            // Try JSONP approach
            const data = await fetchJsonp(`https://openlibrary.org${openLibraryPath}`);
            
            // Cache the successful JSONP response
            apiCache.set(cacheKey, {
              data,
              expiry: Date.now() + CACHE_EXPIRY
            });
            
            return data;
          } catch (jsonpError) {
            console.error(`JSONP request failed for ${url}:`, jsonpError);
            throw jsonpError;
          }
        } else {
          throw proxyError;
        }
      }
    }
  } catch (error) {
    console.error(`All attempts failed for ${url}:`, error);
    
    // Try to get data from localStorage as a last resort
    try {
      const localData = localStorage.getItem(`api_${cacheKey}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log(`Using localStorage data for ${url}`);
        return parsedData.data;
      }
    } catch (e) {
      console.warn('Failed to retrieve from localStorage:', e);
    }
    
    // For Open Library, return a minimal fallback response if possible
    if (url.includes('openlibrary.org')) {
      if (url.includes('/search/authors')) {
        return { docs: [] }; // Empty authors search result
      } else if (url.includes('/authors/') && url.includes('/works.json')) {
        return { entries: [] }; // Empty works list
      }
    }
    
    throw error;
  }
};

// Function to preload and cache common API requests
// Initialize loading interceptors for axios
export const initializeLoadingInterceptors = (loadingContext) => {
  if (!loadingContext) return;
  
  const { startLoading, updateProgress, stopLoading } = loadingContext;
  let activeRequests = 0;
  
  // Minimum display time for loading avatar (in milliseconds)
  const MIN_DISPLAY_TIME = 3000; // 3 seconds minimum display time
  
  // Add request interceptor to show loading avatar
  axios.interceptors.request.use(
    config => {
      // Only show loading for non-cached requests
      if (!config.cached) {
        activeRequests++;
        
        // Loading disabled - comment out to re-enable
        // if (activeRequests === 1) {
        //   startLoading('Loading data...', MIN_DISPLAY_TIME);
        // }
      }
      return config;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to hide loading avatar
  axios.interceptors.response.use(
    response => {
      if (!response.cached) {
        activeRequests = Math.max(0, activeRequests - 1);
        if (activeRequests === 0) {
          // Use the minimum display time to ensure avatar is visible
          stopLoading(MIN_DISPLAY_TIME);
        }
      }
      return response;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
  
  // Also add interceptors to the openLibraryAPI instance
  openLibraryAPI.interceptors.request.use(
    config => {
      if (!config.cached) {
        activeRequests++;
        
        // Loading disabled - comment out to re-enable
        // if (activeRequests === 1) {
        //   startLoading('Loading book data...', MIN_DISPLAY_TIME);
        // }
      }
      return config;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
  
  openLibraryAPI.interceptors.response.use(
    response => {
      if (!response.cached) {
        activeRequests = Math.max(0, activeRequests - 1);
        if (activeRequests === 0) {
          stopLoading(MIN_DISPLAY_TIME);
        }
      }
      return response;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
  
  // Also add interceptors to the backendAPI instance
  backendAPI.interceptors.request.use(
    config => {
      activeRequests++;
      
      // Loading disabled - comment out to re-enable  
      // if (activeRequests === 1) {
      //   startLoading('Connecting to server...', MIN_DISPLAY_TIME);
      // }
      return config;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
  
  backendAPI.interceptors.response.use(
    response => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return response;
    },
    error => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        stopLoading(MIN_DISPLAY_TIME);
      }
      return Promise.reject(error);
    }
  );
};

export const preloadCommonData = async () => {
  try {
    console.log('Preloading common data...');
    
    // Preload popular authors data
    const popularAuthorsUrls = [
      'https://openlibrary.org/authors/OL23919A.json', // J.K. Rowling
      'https://openlibrary.org/authors/OL2162284A.json', // Stephen King
      'https://openlibrary.org/authors/OL27695A.json', // Agatha Christie
      'https://openlibrary.org/authors/OL2668537A.json', // George R.R. Martin
    ];
    
    // Preload popular authors' works
    const popularWorksUrls = [
      'https://openlibrary.org/authors/OL23919A/works.json?limit=20', // J.K. Rowling works
      'https://openlibrary.org/authors/OL2162284A/works.json?limit=20', // Stephen King works
      'https://openlibrary.org/authors/OL27695A/works.json?limit=20', // Agatha Christie works
    ];
    
    // Combine all URLs to preload
    const urlsToPreload = [...popularAuthorsUrls, ...popularWorksUrls];
    
    // Load in parallel with a concurrency limit of 2 (reduced to avoid overwhelming the browser)
    const results = [];
    const concurrencyLimit = 2;
    
    for (let i = 0; i < urlsToPreload.length; i += concurrencyLimit) {
      const batch = urlsToPreload.slice(i, i + concurrencyLimit);
      
      // Add a small delay between batches to avoid overwhelming the browser
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const batchResults = await Promise.all(batch.map(url => {
        // Use a more robust approach with multiple fallbacks
        return new Promise(async (resolve) => {
          try {
            // First try regular fetch
            const data = await safeFetch(url);
            resolve(data);
          } catch (err) {
            console.warn(`Regular fetch failed for ${url}, trying JSONP:`, err);
            
            try {
              // If it's an Open Library URL, try JSONP as fallback
              if (url.includes('openlibrary.org')) {
                // Dynamically import the JSONP module
                const { fetchOpenLibraryJsonp } = await import('./jsonpFetch');
                
                // Convert the full URL to just the path for Open Library
                const openLibraryPath = url.replace('https://openlibrary.org', '');
                
                // Try JSONP approach with retries
                const data = await fetchOpenLibraryJsonp(openLibraryPath);
                resolve(data);
              } else {
                resolve(null);
              }
            } catch (jsonpErr) {
              console.error(`All fetch methods failed for ${url}:`, jsonpErr);
              
              // Return a minimal fallback response
              if (url.includes('/works.json')) {
                resolve({ entries: [] });
              } else if (url.includes('/authors/')) {
                resolve({ name: 'Unknown Author', works: [] });
              } else {
                resolve(null);
              }
            }
          }
        });
      }));
      
      results.push(...batchResults);
    }
    
    console.log(`Preloaded ${results.filter(Boolean).length}/${urlsToPreload.length} common data items`);
  } catch (error) {
    console.warn('Error during preloading:', error);
  }
};

// Call preload when this module is imported, but don't block rendering
// Start preloading immediately to have data ready faster
setTimeout(preloadCommonData, 500);

export default axios;