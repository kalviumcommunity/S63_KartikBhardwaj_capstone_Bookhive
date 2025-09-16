import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="brand-logo">
            <h2>📚 BookHive</h2>
            <p>Discover your next favorite book</p>
          </div>
          <div className="brand-description">
            <p>
              BookHive is your ultimate destination for book discovery, reviews, and 
              literary discussions. Join our community of book lovers and explore 
              endless reading possibilities.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <div className="nav-column">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/books">📖 All Books</Link></li>
              <li><Link to="/authors">✍️ Authors</Link></li>
              <li><Link to="/mood-matcher">🎯 Mood Matcher</Link></li>
              <li><Link to="/book-chat">🤖 AI Chat</Link></li>
              <li><Link to="/recommend-book">⭐ Recommend</Link></li>
            </ul>
          </div>

          <div className="nav-column">
            <h3>Community</h3>
            <ul>
              <li><Link to="/reviews">📝 Reviews</Link></li>
              <li><Link to="/profile">👤 My Profile</Link></li>
              <li><Link to="/my-reviews">📋 My Reviews</Link></li>
              <li><Link to="/review-requests">🙋 Review Requests</Link></li>
            </ul>
          </div>

          <div className="nav-column">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">🔐 Login</Link></li>
              <li><Link to="/signup">📝 Sign Up</Link></li>
              <li><Link to="/contact">📞 Contact</Link></li>
              <li><Link to="/about">ℹ️ About</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Social Section */}
        <div className="footer-contact">
          <h3>Connect With Developer</h3>
          <div className="contact-details">
            <div className="contact-item">
              <span className="icon">📧</span>
              <a href="mailto:kbrupc2020@gmail.com">kbrupc2020@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="icon">📱</span>
              <span>9917044xxx</span>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <span>Greater Noida sector - 1</span>
            </div>
          </div>

          <div className="social-links">
            <a href="https://www.linkedin.com/in/kartik-bhardwaj-0b82a8316/" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-link linkedin">
              <span className="icon">💼</span>
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/kartikbhardwaj1111" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-link github">
              <span className="icon">💻</span>
              <span>GitHub</span>
            </a>
            <a href="https://portfolio-website-lilac-xi-72.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-link portfolio">
              <span className="icon">🌟</span>
              <span>Portfolio</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; {currentYear} BookHive. All rights reserved.</p>
          </div>
          <div className="developer-credit">
            <p>Designed & Developed with ❤️ by <strong>Kartik Bhardwaj</strong></p>
          </div>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
