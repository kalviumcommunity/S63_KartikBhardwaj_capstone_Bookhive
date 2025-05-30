import { handleImageError, PLACEHOLDER_IMAGES, FALLBACK_URLS } from '../utils/imageUtils';
import { generateAmazonLink } from '../utils/affiliateLinks';
import '../styles/BookCarousel.css';

const BASE_URL = 'https://openlibrary.org';

// Sample featured book IDs from Open Library
const FEATURED_BOOK_IDS = [
  'OL24236961M', // The Great Gatsby
  'OL7358913M',  // To Kill a Mockingbird
  'OL26515564M', // 1984
  'OL24721971M', // Pride and Prejudice
  'OL25887411M', // The Hobbit
  'OL6990157M',  // The Lord of the Rings
  'OL24347578M', // Harry Potter and the Sorcerer's Stone
  'OL24347578M', // Harry Potter and the Sorcerer's Stone
  'OL7603982M',  // Jane Eyre
];

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();
    return data.docs.map(book => {
      // Determine book genre for appropriate cover image
      let genre = 'default';
      if (book.subject) {
        const subjects = Array.isArray(book.subject) ? book.subject.join(' ').toLowerCase() : '';
        if (subjects.includes('fiction') && !subjects.includes('science') && !subjects.includes('fantasy')) {
          genre = 'fiction';
        } else if (subjects.includes('science fiction') || subjects.includes('sci-fi')) {
          genre = 'scifi';
        } else if (subjects.includes('fantasy')) {
          genre = 'fantasy';
        } else if (subjects.includes('mystery') || subjects.includes('thriller')) {
          genre = 'mystery';
        } else if (subjects.includes('romance')) {
          genre = 'romance';
        }
      }
      
      // Map genre to local SVG image path
      const coverMap = {
        'fiction': '/images/book-covers/fiction-book.svg',
        'scifi': '/images/book-covers/scifi-book.svg',
        'fantasy': '/images/book-covers/fantasy-book.svg',
        'mystery': '/images/book-covers/mystery-book.svg',
        'romance': '/images/book-covers/romance-book.svg',
        'default': '/images/book-covers/default-book.svg'
      };
      
      return {
        id: book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        coverUrl: coverMap[genre],
        alternativeCoverUrl: '/images/book-covers/default-book.svg',
        publishYear: book.first_publish_year || 'Unknown',
      };
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getFeaturedBooks = async () => {
  try {
    const featuredBooksData = [];
    
    for (const bookId of FEATURED_BOOK_IDS) {
      const bookDetails = await getBookById(bookId);
      
      if (bookDetails) {
        // Construct Open Library cover image URLs for different sizes
        const coverUrlL = `https://covers.openlibrary.org/b/olid/${bookId}-L.jpg`;
        const coverUrlM = `https://covers.openlibrary.org/b/olid/${bookId}-M.jpg`;
        const coverUrlS = `https://covers.openlibrary.org/b/olid/${bookId}-S.jpg`;
        
        // Add potential image URLs in order of preference (Large, Medium, Small)
        const imageUrlsToTry = [coverUrlL, coverUrlM, coverUrlS].filter(url => url);

        console.log(`Constructed Open Library URLs for ${bookDetails.title} (ID: ${bookId}):`, imageUrlsToTry);

        featuredBooksData.push({
          ...bookDetails,
          // Pass the array of potential image URLs to BookCover
          imageUrl: imageUrlsToTry.length > 0 ? imageUrlsToTry : bookDetails.imageUrl,
          alternativeCoverUrl: bookDetails.alternativeCoverUrl, 
          additionalImageUrls: [],
        });
      }
    }
    
    console.log('Featured Books data sent to BookCarousel:', featuredBooksData);
    return featuredBooksData;

  } catch (error) {
    console.error('Error fetching featured books:', error);
    return [];
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}${bookId}.json`);
    const book = await response.json();
    
    // For description
    let description = 'No description available';
    if (book.description) {
      description = typeof book.description === 'object' ? book.description.value : book.description;
    }
    
    // Determine book genre for appropriate cover image
    let genre = 'default';
    if (book.subjects) {
      const subjects = Array.isArray(book.subjects) ? book.subjects.join(' ').toLowerCase() : '';
      if (subjects.includes('fiction') && !subjects.includes('science') && !subjects.includes('fantasy')) {
        genre = 'fiction';
      } else if (subjects.includes('science fiction') || subjects.includes('sci-fi')) {
        genre = 'scifi';
      } else if (subjects.includes('fantasy')) {
        genre = 'fantasy';
      } else if (subjects.includes('mystery') || subjects.includes('thriller')) {
        genre = 'mystery';
      } else if (subjects.includes('romance')) {
        genre = 'romance';
      }
    }
    
    // Map genre to local SVG image path
    const coverMap = {
      'fiction': '/images/book-covers/fiction-book.svg',
      'scifi': '/images/book-covers/scifi-book.svg',
      'fantasy': '/images/book-covers/fantasy-book.svg',
      'mystery': '/images/book-covers/mystery-book.svg',
      'romance': '/images/book-covers/romance-book.svg',
      'default': '/images/book-covers/default-book.svg'
    };
    
    return {
      id: book.key,
      title: book.title,
      description,
      coverUrl: coverMap[genre],
      alternativeCoverUrl: '/images/book-covers/default-book.svg',
      publishDate: book.first_publish_date || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Function to fetch a book from Open Library by ID
export const getBookById = async (bookId) => {
  try {
    console.log(`Fetching book details for ID: ${bookId}`);
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${bookId}&format=json&jscmd=data`);
    const data = await response.json();
    console.log(`Raw data for ID ${bookId}:`, data);
    const bookData = data[`OLID:${bookId}`];
    
    if (!bookData) {
      console.warn(`Book data not found for ID: ${bookId}`);
      throw new Error('Book not found');
    }
    
    // Determine book genre for appropriate cover image
    let genre = 'default';
    if (bookData.subjects) {
      const subjects = Array.isArray(bookData.subjects) 
        ? bookData.subjects.map(s => s.name || s).join(' ').toLowerCase() 
        : '';
      
      if (subjects.includes('fiction') && !subjects.includes('science') && !subjects.includes('fantasy')) {
        genre = 'fiction';
      } else if (subjects.includes('science fiction') || subjects.includes('sci-fi')) {
        genre = 'scifi';
      } else if (subjects.includes('fantasy')) {
        genre = 'fantasy';
      } else if (subjects.includes('mystery') || subjects.includes('thriller')) {
        genre = 'mystery';
      } else if (subjects.includes('romance')) {
        genre = 'romance';
      }
    }
    
    // Map genre to local image path - Use .svg for consistency
    const coverMap = {
      'fiction': '/images/book-covers/fiction-book.svg',
      'scifi': '/images/book-covers/scifi-book.svg',
      'fantasy': '/images/book-covers/fantasy-book.svg',
      'mystery': '/images/book-covers/mystery-book.svg',
      'romance': '/images/book-covers/romance-book.svg',
      'default': '/images/book-covers/default-book.svg'
    };
    
    const bookDetails = {
      id: bookId,
      title: bookData.title,
      author: bookData.authors?.[0]?.name || 'Unknown Author',
      coverUrl: coverMap[genre], // This will now be an SVG path from here initially
      alternativeCoverUrl: '/images/book-covers/default-book.svg', // Use SVG here too
      publishYear: bookData.publish_date ? parseInt(bookData.publish_date.slice(-4)) : null,
      description: bookData.excerpts?.[0]?.text || bookData.description?.value || 'No description available',
      category: bookData.subjects?.[0]?.name || bookData.subjects?.[0] || null,
    };
    
    console.log(`Processed book details for ID ${bookId}:`, bookDetails);
    return bookDetails;

  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    return null;
  }
}; 