/**
 * Enhanced Image utility functions for better book cover handling
 * Addresses OpenLibrary API cover image issues with multiple fallback strategies
 */

import { PLACEHOLDER_IMAGES, getFallbackByGenre } from './imageUtils';

// Enhanced cover URL generation with multiple fallback strategies
export const generateCoverUrls = (book) => {
  const { id, key, workId, cover_i, isbn, oclc, lccn, title, author, genre } = book;
  
  // Extract work ID from various formats
  const extractWorkId = () => {
    if (id && id.startsWith('OL') && id.endsWith('W')) return id;
    if (key) return key.replace('/works/', '');
    if (workId) return workId.replace('/works/', '');
    return null;
  };

  const cleanWorkId = extractWorkId();
  const coverUrls = [];

  // Priority 1: Use cover_i if available (most reliable)
  if (cover_i) {
    coverUrls.push(`https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`);
    coverUrls.push(`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`);
  }

  // Priority 2: Use work ID with different formats
  if (cleanWorkId) {
    coverUrls.push(`https://covers.openlibrary.org/b/olid/${cleanWorkId}-L.jpg`);
    coverUrls.push(`https://covers.openlibrary.org/b/olid/${cleanWorkId}-M.jpg`);
    coverUrls.push(`https://covers.openlibrary.org/w/id/${cleanWorkId}-L.jpg`);
    
    // Try extracting numeric part for ID-based URLs
    const numericId = cleanWorkId.replace(/[^\d]/g, '');
    if (numericId) {
      coverUrls.push(`https://covers.openlibrary.org/b/id/${numericId}-L.jpg`);
    }
  }

  // Priority 3: Use ISBN/OCLC/LCCN if available
  if (isbn) {
    const isbnArray = Array.isArray(isbn) ? isbn : [isbn];
    isbnArray.slice(0, 3).forEach(isbnCode => {
      coverUrls.push(`https://covers.openlibrary.org/b/isbn/${isbnCode}-L.jpg`);
    });
  }

  if (oclc) {
    const oclcArray = Array.isArray(oclc) ? oclc : [oclc];
    oclcArray.slice(0, 2).forEach(oclcCode => {
      coverUrls.push(`https://covers.openlibrary.org/b/oclc/${oclcCode}-L.jpg`);
    });
  }

  if (lccn) {
    const lccnArray = Array.isArray(lccn) ? lccn : [lccn];
    lccnArray.slice(0, 2).forEach(lccnCode => {
      coverUrls.push(`https://covers.openlibrary.org/b/lccn/${lccnCode}-L.jpg`);
    });
  }

  // Priority 4: Genre-based fallback
  if (genre) {
    coverUrls.push(getFallbackByGenre(genre));
  }

  // Priority 5: Generated placeholder with title/author
  if (title && author) {
    const titleEncoded = encodeURIComponent(title.substring(0, 20));
    const authorEncoded = encodeURIComponent(author.substring(0, 15));
    coverUrls.push(`https://ui-avatars.com/api/?name=${titleEncoded}&size=300&background=667eea&color=fff&bold=true&format=png`);
  }

  // Priority 6: Final fallbacks
  coverUrls.push('/default-book-cover.svg');
  coverUrls.push('/NoCoverAvailable.svg');
  coverUrls.push(PLACEHOLDER_IMAGES.GENERIC_BOOK);

  return coverUrls;
};

// Advanced image loading with cascade fallback
export class EnhancedImageLoader {
  constructor(imageElement, book, onLoad = null, onError = null) {
    this.img = imageElement;
    this.book = book;
    this.onLoad = onLoad;
    this.onError = onError;
    this.urls = generateCoverUrls(book);
    this.currentIndex = 0;
    this.isLoading = false;
  }

  load() {
    if (this.isLoading || this.currentIndex >= this.urls.length) {
      return;
    }

    this.isLoading = true;
    const currentUrl = this.urls[this.currentIndex];
    
    // Create a new image to test loading
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    
    testImg.onload = () => {
      this.img.src = currentUrl;
      this.img.style.opacity = '1';
      this.isLoading = false;
      if (this.onLoad) this.onLoad(currentUrl, this.currentIndex);
    };

    testImg.onerror = () => {
      this.currentIndex++;
      this.isLoading = false;
      
      if (this.currentIndex < this.urls.length) {
        // Try next URL after a short delay
        setTimeout(() => this.load(), 100);
      } else {
        // All URLs failed
        this.img.src = PLACEHOLDER_IMAGES.GENERIC_BOOK;
        if (this.onError) this.onError();
      }
    };

    testImg.src = currentUrl;
  }
}

// Book data validation and filtering
export const validateAndFilterBooks = (books) => {
  const validBooks = books.filter(book => {
    // Filter out books with missing essential data
    if (!book.title || book.title.trim().length === 0) return false;
    if (!book.author || book.author.trim().length === 0) return false;
    
    // Filter out books with no cover image possibilities
    const urls = generateCoverUrls(book);
    if (urls.length <= 2) return false; // Only has final fallbacks
    
    return true;
  });

  return validBooks;
};

// Duplicate detection and removal
export const removeDuplicateBooks = (books) => {
  const seenBooks = new Map();
  const uniqueBooks = [];

  books.forEach(book => {
    // Create a unique key based on title and author
    const normalizeString = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const titleKey = normalizeString(book.title);
    const authorKey = normalizeString(book.author || '');
    const uniqueKey = `${titleKey}|${authorKey}`;

    // Also check for OpenLibrary key duplicates
    const olKey = book.id || book.key || book.workId;
    const olKeyNormalized = olKey ? olKey.replace('/works/', '') : null;

    // Check if we've seen this book before
    let isDuplicate = false;
    
    if (seenBooks.has(uniqueKey)) {
      isDuplicate = true;
    } else if (olKeyNormalized && Array.from(seenBooks.values()).some(existingBook => 
      (existingBook.id || existingBook.key || existingBook.workId || '').replace('/works/', '') === olKeyNormalized
    )) {
      isDuplicate = true;
    }

    if (!isDuplicate) {
      seenBooks.set(uniqueKey, book);
      uniqueBooks.push(book);
    }
  });

  console.log(`Removed ${books.length - uniqueBooks.length} duplicate books`);
  return uniqueBooks;
};

// Skeleton loader component data
export const createSkeletonProps = () => ({
  style: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }
});

// CSS for shimmer animation (to be added to CSS file)
export const shimmerCSS = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.book-cover-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
`;

// Performance optimization: Image preloader
export const preloadCriticalImages = (books, limit = 8) => {
  const criticalBooks = books.slice(0, limit);
  
  criticalBooks.forEach(book => {
    const urls = generateCoverUrls(book);
    if (urls.length > 0) {
      const img = new Image();
      img.src = urls[0]; // Preload the primary URL
    }
  });
};

export default {
  generateCoverUrls,
  EnhancedImageLoader,
  validateAndFilterBooks,
  removeDuplicateBooks,
  createSkeletonProps,
  shimmerCSS,
  preloadCriticalImages
};