import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

const AuthTokenHandler = () => {
  const { checkAuthStatus } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      checkAuthStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [checkAuthStatus]);
  return null;
};

export default AuthTokenHandler; 