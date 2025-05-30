import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize with default value
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      // Check if user previously set dark mode
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(storedDarkMode);
    }
  }, []);

  useEffect(() => {
    // Only manipulate DOM on the client side
    if (typeof window !== 'undefined') {
      // Apply dark mode class to body
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};