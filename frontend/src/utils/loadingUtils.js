/**
 * Utility functions for handling loading states with the LoadingAvatar
 */

/**
 * Wraps an async function with loading state management
 * @param {Function} asyncFn - The async function to wrap
 * @param {Object} options - Options for the loading state
 * @param {Function} options.onStart - Function to call when loading starts
 * @param {Function} options.onProgress - Function to call to update progress
 * @param {Function} options.onSuccess - Function to call on successful completion
 * @param {Function} options.onError - Function to call on error
 * @param {Function} options.onFinish - Function to call when loading finishes (success or error)
 * @returns {Function} - Wrapped function that handles loading states
 */
export const withLoading = (
  asyncFn,
  {
    onStart = () => {},
    onProgress = () => {},
    onSuccess = () => {},
    onError = () => {},
    onFinish = () => {}
  } = {}
) => {
  return async (...args) => {
    try {
      // Call onStart callback
      onStart();
      
      // Execute the async function
      const result = await asyncFn(...args);
      
      // Call onSuccess callback
      onSuccess(result);
      
      return result;
    } catch (error) {
      // Call onError callback
      onError(error);
      
      // Re-throw the error to be handled by the caller
      throw error;
    } finally {
      // Call onFinish callback
      onFinish();
    }
  };
};

/**
 * Creates a loading handler for use with the LoadingContext
 * @param {Object} loadingContext - The loading context from useLoading()
 * @returns {Object} - Object with loading handler functions
 */
export const createLoadingHandler = (loadingContext) => {
  const { startLoading, updateProgress, stopLoading } = loadingContext;
  
  return {
    /**
     * Wraps an async function with the loading context
     * @param {Function} asyncFn - The async function to wrap
     * @param {Object} options - Options for the loading state
     * @param {string} options.message - The loading message to display
     * @param {number} options.timeout - Timeout in ms after which loading will stop automatically
     * @returns {Function} - Wrapped function that shows loading avatar
     */
    withGlobalLoading: (asyncFn, { message = 'Loading...', timeout = 0 } = {}) => {
      return withLoading(asyncFn, {
        onStart: () => startLoading(message, timeout),
        onProgress: (progress, progressMessage) => {
          if (progressMessage) {
            updateProgress(progress, progressMessage);
          } else {
            updateProgress(progress);
          }
        },
        onFinish: stopLoading
      });
    }
  };
};