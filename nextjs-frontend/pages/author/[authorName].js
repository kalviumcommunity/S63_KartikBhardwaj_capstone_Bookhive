import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import ErrorBoundary from '../../components/ErrorBoundary';
import dynamic from 'next/dynamic';

// This will be implemented later
const AuthorDetailsComponent = dynamic(() => import('../../components/AuthorDetails'), {
  ssr: true,
});

export default function AuthorDetailsPage({ initialAuthorData, authorName }) {
  const router = useRouter();
  const [authorData, setAuthorData] = useState(initialAuthorData);
  const [loading, setLoading] = useState(!initialAuthorData);
  const [error, setError] = useState(null);

  // If the page is being rendered on the client side without initial data
  useEffect(() => {
    // If we don't have initial data and we're not already loading, fetch the data
    if (!initialAuthorData && !loading && !authorData) {
      const fetchAuthorData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/authors/${encodeURIComponent(authorName)}`);
          setAuthorData(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching author data:', err);
          setError('Failed to load author details. Please try again later.');
          setLoading(false);
        }
      };

      fetchAuthorData();
    }
  }, [initialAuthorData, authorName, loading, authorData]);

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

  // If we have author data, render the author details
  return (
    <>
      <Head>
        <title>{authorData?.name || authorName} | BookHive</title>
        <meta name="description" content={`Learn about ${authorData?.name || authorName} and their works on BookHive`} />
      </Head>
      
      <ErrorBoundary>
        <AuthorDetailsComponent authorData={authorData} isLoading={loading} />
      </ErrorBoundary>
    </>
  );
}

// This function gets called at request time on server-side
export async function getServerSideProps(context) {
  const { authorName } = context.params;
  
  try {
    // Fetch author data from API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${encodeURIComponent(authorName)}`
    );
    
    return {
      props: {
        initialAuthorData: response.data,
        authorName,
      },
    };
  } catch (error) {
    console.error('Error fetching author data:', error);
    
    // Return empty props instead of an error
    // The client-side code will handle fetching the data
    return {
      props: {
        initialAuthorData: null,
        authorName,
      },
    };
  }
}