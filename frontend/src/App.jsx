import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedBooks from './components/FeaturedBooks'
import Signup from './components/Signup'
import Login from './components/Login'
import Books from './components/Books'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Reviews from './components/Reviews'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <div className="app">
                  <Hero />
                  <FeaturedBooks />
                </div>
              } />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/books" element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/reviews" element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <div className="error-page">
                  <h1 className="error-title">404 - Page Not Found</h1>
                  <p className="error-message">The page you're looking for doesn't exist.</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="home-button"
                  >
                    Go Home
                  </button>
                </div>
              } />
            </Routes>
          </div>
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
