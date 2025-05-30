import Head from 'next/head';
import Hero from '../components/Hero';
import FeaturedBooks from '../components/FeaturedBooks';
import BookOfTheMonth from '../components/BookOfTheMonth';
import TopAuthors from '../components/TopAuthors';
import ContactSection from '../components/ContactSection';
import ErrorBoundary from '../components/ErrorBoundary';
import axios from 'axios';

export default function Home({ featuredBooks, bookOfMonth, topAuthors }) {
  return (
    <div className="app">
      <Head>
        <title>BookHive - Your Ultimate Book Review Platform</title>
        <meta name="description" content="Discover, review, and share your favorite books on BookHive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      
      <ErrorBoundary>
        <FeaturedBooks initialBooks={featuredBooks} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <BookOfTheMonth initialBook={bookOfMonth} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <TopAuthors initialAuthors={topAuthors} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <ContactSection />
      </ErrorBoundary>
    </div>
  );
}

// Mock data for when API is not available
const mockFeaturedBooks = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    rating: 4.8
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
    rating: 4.7
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    rating: 4.5
  }
];

const mockBookOfMonth = {
  id: 4,
  title: "The Catcher in the Rye",
  author: "J.D. Salinger",
  coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
  rating: 4.6,
  description: "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days."
};

const mockTopAuthors = [
  {
    id: 1,
    name: "Stephen King",
    photoUrl: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/8cigckin175jtpsk3gs361r4ss.jpg",
    booksCount: 64,
    genre: "Horror, Thriller"
  },
  {
    id: 2,
    name: "J.K. Rowling",
    photoUrl: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/8k5iuqaipfo3h8a9quq99uuh7n.jpg",
    booksCount: 14,
    genre: "Fantasy"
  },
  {
    id: 3,
    name: "James Patterson",
    photoUrl: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/d1jq6r6r9m7s3r6s6s6s6s6s6s.jpg",
    booksCount: 114,
    genre: "Mystery, Thriller"
  }
];

// This function gets called at build time on server-side
export async function getStaticProps() {
  try {
    let featuredBooks = [];
    let bookOfMonth = null;
    let topAuthors = [];
    
    // Check if API URL is defined
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        // Fetch featured books
        const featuredBooksResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/books/featured`
        );
        featuredBooks = featuredBooksResponse.data || [];
        
        // Fetch book of the month
        const bookOfMonthResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/books/book-of-month`
        );
        bookOfMonth = bookOfMonthResponse.data || null;
        
        // Fetch top authors
        const topAuthorsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/books/top-authors`
        );
        topAuthors = topAuthorsResponse.data || [];
      } catch (apiError) {
        console.log('API error, using mock data instead:', apiError.message);
        // Use mock data if API calls fail
        featuredBooks = mockFeaturedBooks;
        bookOfMonth = mockBookOfMonth;
        topAuthors = mockTopAuthors;
      }
    } else {
      console.log('API URL not defined, using mock data');
      // Use mock data if API URL is not defined
      featuredBooks = mockFeaturedBooks;
      bookOfMonth = mockBookOfMonth;
      topAuthors = mockTopAuthors;
    }

    return {
      props: {
        featuredBooks,
        bookOfMonth,
        topAuthors,
      },
      // Re-generate the page at most once per day
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    // Return mock data as fallback
    return {
      props: {
        featuredBooks: mockFeaturedBooks,
        bookOfMonth: mockBookOfMonth,
        topAuthors: mockTopAuthors,
      },
      revalidate: 3600, // Try again in an hour if there was an error
    };
  }
}