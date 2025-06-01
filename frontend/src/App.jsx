import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./styles/App.css";
import "./styles/BookOfTheMonth.css";
import { initializeLoadingInterceptors } from "./utils/axiosConfig"; // Import axios configuration
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import BookOfTheMonth from "./components/BookOfTheMonth";
import TopAuthors from "./components/TopAuthors";

import AuthorDetails from "./components/AuthorDetails";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Books from "./components/Books";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ReadingMoodMatcher from "./components/ReadingMoodMatcher";
import BookDetails from "./components/BookDetails";
import WriteReview from "./components/WriteReview";
import BookChat from "./components/BookChat";
import AIAssistantWidget from "./components/AIAssistantWidget";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reviews from "./components/Reviews";
import AuthTokenHandler from "./AuthTokenHandler";
import ErrorBoundary from "./components/ErrorBoundary";
import SearchResults from "./components/SearchResults";
import AuthorsPage from "./components/AuthorsPage";
import LoadingInterceptorInitializer from "./components/LoadingInterceptorInitializer";
import WelcomePage from "./components/WelcomePage";
import FloatingBookAvatar from "./components/FloatingBookAvatar";
import AvatarShowcase from "./components/AvatarShowcase";
import AvatarDemo from "./components/AvatarDemo";
import ContactSection from "./components/ContactSection";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import RecommendBook from "./components/RecommendBook";


function App() {
  return (
    <AuthProvider>
      <AuthTokenHandler />
      <ThemeProvider>
        <BookmarkProvider>
          <LoadingProvider>
            <SocketProvider>
              <LoadingInterceptorInitializer />
              <Router>
              <div className="app-container">
                <Navbar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <div className="app">
                        <Hero />
                        <ErrorBoundary>
                          <FeaturedBooks />
                        </ErrorBoundary>
                        <ErrorBoundary>
                          <BookOfTheMonth />
                        </ErrorBoundary>
                        <ErrorBoundary>
                          <TopAuthors />
                        </ErrorBoundary>
                        <ErrorBoundary>
                          <ContactSection />
                        </ErrorBoundary>
                      </div>
                    }
                  />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/avatar-demo" element={<AvatarDemo />} />
                  <Route
                    path="/books"
                    element={
                      <ProtectedRoute>
                        <Books />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reviews"
                    element={
                      <ProtectedRoute>
                        <Reviews />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-reviews"
                    element={
                      <ProtectedRoute>
                        <Reviews />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mood-matcher"
                    element={<ReadingMoodMatcher />}
                  />
                  <Route path="/book/:workId" element={<BookDetails />} />
                  <Route
                    path="/author/:authorName"
                    element={<AuthorDetails />}
                  />
                  <Route
                    path="/write-review/:bookId"
                    element={
                      <ProtectedRoute>
                        <WriteReview />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/recommend-book" element={<RecommendBook />} />
                  <Route path="/authors" element={<AuthorsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/book-chat" element={<BookChat />} />
                  <Route
                    path="*"
                    element={
                      <div className="error-page">
                        <h1 className="error-title">404 - Page Not Found</h1>
                        <p className="error-message">
                          The page you're looking for doesn't exist.
                        </p>
                        <button
                          onClick={() => (window.location.href = "/")}
                          className="home-button"
                        >
                          Go Home
                        </button>
                      </div>
                    }
                  />
                </Routes>
              </div>
              <FloatingBookAvatar />
              <AIAssistantWidget />
              <Footer />
              <ToastContainer />
            </Router>
            </SocketProvider>
          </LoadingProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;