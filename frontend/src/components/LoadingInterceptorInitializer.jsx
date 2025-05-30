import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import { initializeLoadingInterceptors } from '../utils/axiosConfig';

// Component to initialize loading interceptors
const LoadingInterceptorInitializer = () => {
  const loadingContext = useLoading();
  
  useEffect(() => {
    // Initialize loading interceptors when component mounts
    initializeLoadingInterceptors(loadingContext);
  }, [loadingContext]);
  
  // This component doesn't render anything
  return null;
};

export default LoadingInterceptorInitializer;