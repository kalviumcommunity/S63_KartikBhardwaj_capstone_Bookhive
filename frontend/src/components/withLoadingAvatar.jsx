import React, { useState, useEffect } from 'react';
import LoadingAvatar from './LoadingAvatar';

/**
 * Higher-Order Component that adds loading avatar functionality to any component
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.loadingProp - The prop name to check for loading state (default: 'loading')
 * @param {string} options.progressProp - The prop name to check for progress (default: 'progress')
 * @param {string} options.messageProp - The prop name to check for loading message (default: 'loadingMessage')
 * @param {string} options.defaultMessage - Default loading message (default: 'Loading...')
 * @returns {React.Component} - Enhanced component with loading avatar
 */
const withLoadingAvatar = (
  WrappedComponent,
  {
    loadingProp = 'loading',
    progressProp = 'progress',
    messageProp = 'loadingMessage',
    defaultMessage = 'Loading...'
  } = {}
) => {
  return function WithLoadingAvatar(props) {
    // Extract loading state and progress from props
    const isLoading = props[loadingProp];
    const progress = props[progressProp] || 50;
    const message = props[messageProp] || defaultMessage;
    
    // If loading, show the avatar
    if (isLoading) {
      return <LoadingAvatar progress={progress} message={message} />;
    }
    
    // Otherwise, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withLoadingAvatar;