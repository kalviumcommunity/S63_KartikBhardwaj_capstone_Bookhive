import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/App.css';
import '../styles/BookOfTheMonth.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { BookmarkProvider } from '../context/BookmarkContext';
import { LoadingProvider } from '../context/LoadingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingBookAvatar from '../components/FloatingBookAvatar';

function MyApp({ Component, pageProps }) {
  // Handle global error handling
  useEffect(() => {
    // Global error handler for uncaught errors
    const errorHandler = (event) => {
      console.error('Global error caught:', event.error);
    };

    // Global error handler for unhandled promise rejections
    const rejectionHandler = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BookmarkProvider>
          <LoadingProvider>
            <div className="app-container">
              <Navbar />
              <Component {...pageProps} />
              <FloatingBookAvatar />
              <Footer />
              <ToastContainer />
            </div>
          </LoadingProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;