import React, { Component } from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Check if it's a network-related error
    const isNetworkError = 
      error.message?.includes('network') || 
      error.message?.includes('CORS') ||
      error.message?.includes('JSONP') ||
      error.message?.includes('fetch') ||
      error.message?.includes('timeout');
    
    this.setState({ 
      error, 
      errorInfo,
      isNetworkError
    });
    
    // Automatically retry once for network errors after a delay
    if (isNetworkError && this.state.retryCount === 0) {
      this.setState({ isRetrying: true });
      
      setTimeout(() => {
        this.handleRetry();
      }, 3000);
    }
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRetrying: false
    }));
  }
  
  handleClearCache = () => {
    // Clear API caches
    try {
      localStorage.removeItem('apiCache');
      localStorage.removeItem('jsonpCache');
      
      // Clear any items that start with 'api_' or 'jsonp_'
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('api_') || key.startsWith('jsonp_')) {
          localStorage.removeItem(key);
        }
      });
      
      alert('Cache cleared successfully. The page will now reload.');
      window.location.reload();
    } catch (e) {
      console.error('Error clearing cache:', e);
      alert('Failed to clear cache. Please try reloading the page manually.');
    }
  }

  render() {
    if (this.state.hasError) {
      // Get error message
      const errorMessage = this.state.error?.message || 'Unknown error';
      const isNetworkError = this.state.isNetworkError;
      
      // Render fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              {isNetworkError ? '🌐' : '⚠️'}
            </div>
            
            <h2>Something went wrong</h2>
            
            <p className="error-message">
              {isNetworkError 
                ? "We're having trouble connecting to our book service. This might be due to network issues."
                : "We're sorry, but there was an error loading this component."}
            </p>
            
            {this.state.isRetrying ? (
              <div className="retry-progress">
                <div className="retry-spinner"></div>
                <p>Retrying automatically...</p>
              </div>
            ) : (
              <div className="error-actions">
                <button 
                  onClick={this.handleRetry}
                  className="retry-button"
                >
                  Try Again
                </button>
                
                {isNetworkError && (
                  <button 
                    onClick={this.handleClearCache}
                    className="clear-cache-button"
                  >
                    Clear Cache & Reload
                  </button>
                )}
              </div>
            )}
            
            {this.props.showDetails && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <p>{errorMessage}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;