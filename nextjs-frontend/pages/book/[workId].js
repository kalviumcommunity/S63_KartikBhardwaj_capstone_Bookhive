import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import ErrorBoundary from '../../components/ErrorBoundary';
import dynamic from 'next/dynamic';

// Import styles (will need to be created)
// import '../../styles/BookDetails.css';

// This will be implemented later
const BookDetailsComponent = dynamic(() => import('../../components/BookDetails'), {
  ssr: true,
});

export default function BookDetailsPage({ initialBookData, workId }) {
  const router = useRouter();
  const [bookData, setBookData] = useState(initialBookData);
  const [loading, setLoading] = useState(!initialBookData);
  const [error, setError] = useState(null);

  // If the page is being rendered on the client side without initial data
  useEffect(() => {
    // If we don't have initial data and we're not already loading, fetch the data
    if (!initialBookData && !loading && !bookData) {
      const fetchBookData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/books/${workId}`);
          setBookData(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching book data:', err);
          setError('Failed to load book details. Please try again later.');
          setLoading(false);
        }
      };

      fetchBookData();
    }
  }, [initialBookData, workId, loading, bookData]);

  // If the page is still being generated via SSR
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // If there was an error
  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  // If we have book data, render the book details
  return (
    <>
      <Head>
        <title>{bookData?.title || 'Book Details'} | BookHive</title>
        <meta name="description" content={bookData?.description || 'View book details on BookHive'} />
      </Head>
      
      <ErrorBoundary>
        <BookDetailsComponent bookData={bookData} isLoading={loading} />
      </ErrorBoundary>
    </>
  );
}

// This function gets called at request time on server-side
export async function getServerSideProps(context) {
  const { workId } = context.params;
  
  try {
    // Fetch book data from API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/${workId}`
    );
    
    return {
      props: {
        initialBookData: response.data,
        workId,
      },
    };
  } catch (error) {
    console.error('Error fetching book data:', error);
    
    // Return empty props instead of an error
    // The client-side code will handle fetching the data
    return {
      props: {
        initialBookData: null,
        workId,
      },
    };
  }
}