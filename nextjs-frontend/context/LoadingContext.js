import { createContext, useState, useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/LoadingAvatar.module.css';

// Dynamically import LoadingAvatar with no SSR
const LoadingAvatar = dynamic(() => import('../components/LoadingAvatar'), {
  ssr: false,
});

// Create context
const LoadingContext = createContext({
  isLoading: false,
  progress: 0,
  message: '',
  startLoading: () => {},
  updateProgress: () => {},
  stopLoading: () => {}
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading...');
  const [loadingId, setLoadingId] = useState(null);
  
  // Start loading with minimum display time and optional maximum timeout
  const startLoading = (msg = 'Loading...', minDisplayTime = 2500, maxTimeout = 0) => {
    setIsLoading(true);
    setProgress(0);
    setMessage(msg);
    
    // setLoadingStartTime is handled by the useEffect
    
    // If maxTimeout is provided, automatically stop loading after maxTimeout
    if (maxTimeout > 0) {
      const id = setTimeout(() => {
        stopLoading(minDisplayTime);
      }, maxTimeout);
      setLoadingId(id);
    }
    
    // Return a function that ensures the loading state is shown for at least minDisplayTime
    return () => {
      stopLoading(minDisplayTime);
    };
  };
  
  // Update progress
  const updateProgress = (newProgress, newMessage = null) => {
    setProgress(newProgress);
    if (newMessage) setMessage(newMessage);
  };
  
  // Track loading start time
  const [loadingStartTime, setLoadingStartTime] = useState(0);
  
  // Update startLoading to record start time
  useEffect(() => {
    if (isLoading) {
      setLoadingStartTime(Date.now());
    }
  }, [isLoading]);
  
  // Stop loading with respect to minimum display time
  const stopLoading = (minDisplayTime = 2500) => {
    if (loadingId) clearTimeout(loadingId);
    
    const elapsedTime = Date.now() - loadingStartTime;
    
    if (elapsedTime < minDisplayTime) {
      // If not enough time has passed, delay the hiding
      const remainingTime = minDisplayTime - elapsedTime;
      const id = setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
      setLoadingId(id);
    } else {
      // If minimum time has passed, hide immediately
      setIsLoading(false);
    }
  };
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (loadingId) clearTimeout(loadingId);
    };
  }, [loadingId]);
  
  // Context value
  const value = {
    isLoading,
    progress,
    message,
    startLoading,
    updateProgress,
    stopLoading
  };
  
  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && typeof window !== 'undefined' && (
        <div className={styles.global_loading_overlay}>
          <LoadingAvatar progress={progress} message={message} />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;