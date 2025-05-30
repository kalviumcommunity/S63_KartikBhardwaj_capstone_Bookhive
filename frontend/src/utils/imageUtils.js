/**
 * Image utility functions for handling fallbacks and placeholders
 */

// Base64 encoded placeholder images
export const PLACEHOLDER_IMAGES = {
  // Simple book cover placeholder (small base64 image)
  BOOK_COVER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkJvb2sgQ292ZXI8L3RleHQ+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI2MCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
  
  // Author placeholder (small base64 image)
  AUTHOR: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNTAiIGZpbGw9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMjUiIGZpbGw9IiNjY2MiLz48cGF0aCBkPSJNNTAgMTgwQzUwIDEzMCA3NSAxMTAgMTAwIDExMFMxNTAgMTMwIDE1MCAxODBaIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI5NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+QXV0aG9yPC90ZXh0Pjwvc3ZnPg==',
  
  // Generic book placeholder
  GENERIC_BOOK: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2YTExY2IiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTc1ZmMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNncmFkKSIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+Qm9va0hpdmU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+TGlicmFyeTwvdGV4dD48L3N2Zz4='
};

// Fallback URLs for different categories (using local SVG images)
export const FALLBACK_URLS = {
  FICTION_BOOK: '/images/book-covers/fiction-book.svg',
  SCIFI_BOOK: '/images/book-covers/scifi-book.svg',
  FANTASY_BOOK: '/images/book-covers/fantasy-book.svg',
  MYSTERY_BOOK: '/images/book-covers/mystery-book.svg',
  ROMANCE_BOOK: '/images/book-covers/romance-book.svg',
  NONFICTION_BOOK: '/images/book-covers/nonfiction-book.svg',
  DEFAULT_BOOK: '/images/book-covers/default-book.svg',
  DEFAULT_AUTHOR: '/images/book-covers/default-book.svg'
};

/**
 * Get a fallback image URL based on genre or category
 * @param {string} genre - Book genre or category
 * @returns {string} - Fallback image URL
 */
export const getFallbackByGenre = (genre = '') => {
  const normalizedGenre = genre.toLowerCase();
  
  if (normalizedGenre.includes('fiction') && !normalizedGenre.includes('non')) {
    return FALLBACK_URLS.FICTION_BOOK;
  } else if (normalizedGenre.includes('sci') || normalizedGenre.includes('science')) {
    return FALLBACK_URLS.SCIFI_BOOK;
  } else if (normalizedGenre.includes('fantasy')) {
    return FALLBACK_URLS.FANTASY_BOOK;
  } else if (normalizedGenre.includes('mystery') || normalizedGenre.includes('thriller')) {
    return FALLBACK_URLS.MYSTERY_BOOK;
  } else if (normalizedGenre.includes('romance')) {
    return FALLBACK_URLS.ROMANCE_BOOK;
  } else if (normalizedGenre.includes('non') || normalizedGenre.includes('self')) {
    return FALLBACK_URLS.NONFICTION_BOOK;
  } else {
    return FALLBACK_URLS.DEFAULT_BOOK;
  }
};

/**
 * Handle image loading error with multiple fallback options
 * @param {Event} event - The error event
 * @param {string} type - Type of image (book, author)
 * @param {string} genre - Optional genre for books
 */
export const handleImageError = (event, type = 'book', genre = '') => {
  const img = event.target;
  img.onerror = null; // Prevent infinite error loop
  
  // Try a genre-specific fallback for books
  if (type === 'book' && genre) {
    img.src = getFallbackByGenre(genre);
  } 
  // If that fails or for other types, use default fallbacks
  else if (type === 'book') {
    img.src = FALLBACK_URLS.DEFAULT_BOOK;
  } else if (type === 'author') {
    img.src = FALLBACK_URLS.DEFAULT_AUTHOR;
  }
  
  // If external URLs fail, use base64 encoded images as final fallback
  img.onerror = () => {
    img.onerror = null;
    if (type === 'book') {
      img.src = PLACEHOLDER_IMAGES.BOOK_COVER;
    } else if (type === 'author') {
      img.src = PLACEHOLDER_IMAGES.AUTHOR;
    } else {
      img.src = PLACEHOLDER_IMAGES.GENERIC_BOOK;
    }
  };
};