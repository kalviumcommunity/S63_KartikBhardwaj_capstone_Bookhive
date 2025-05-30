import React from 'react';
import { useLoading } from '../context/LoadingContext';
import { createLoadingHandler } from '../utils/loadingUtils';

// Example component showing how to use the loading context
const LoadingExample = () => {
  // Get the loading context
  const loadingContext = useLoading();
  const { withGlobalLoading } = createLoadingHandler(loadingContext);
  
  // Example async function that would normally fetch data
  const fetchData = async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: 'Example data' });
      }, 3000); // 3 second delay
    });
  };
  
  // Wrap the fetch function with loading state
  const fetchWithLoading = withGlobalLoading(fetchData, {
    message: 'Fetching data...'
  });
  
  // Handle button click
  const handleClick = async () => {
    try {
      const result = await fetchWithLoading();
      console.log('Fetched data:', result);
      // Do something with the result
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div className="loading-example">
      <h2>Loading Example</h2>
      <p>Click the button below to see the loading avatar in action</p>
      <button onClick={handleClick} className="example-button">
        Fetch Data
      </button>
    </div>
  );
};

export default LoadingExample;