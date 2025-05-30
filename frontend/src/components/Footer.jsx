import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Footer.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const wavesRef = useRef(null);
  
  useEffect(() => {
    if (!footerRef.current || !wavesRef.current) return;
    
    // Animate the waves
    gsap.to(wavesRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1
      },
      backgroundPositionX: "+=100%",
      ease: "none"
    });
    
    // Animate footer content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
    
    tl.from(".footer-content > *", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-waves" ref={wavesRef}></div>
      
      <div className="footer-content">
        <div className="footer-logo">
          <h2>BookHive</h2>
          <p>Your literary journey begins here</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/books">Books</Link></li>
              <li><Link to="/authors">Authors</Link></li>
              <li><Link to="/mood-matcher">Mood Matcher</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>Account</h3>
            <ul>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/my-reviews">My Reviews</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>About</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest book recommendations and news.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Facebook">
            <i className="social-icon">📘</i>
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <i className="social-icon">📱</i>
          </a>
          <a href="#" className="social-link" aria-label="Instagram">
            <i className="social-icon">📷</i>
          </a>
          <a href="#" className="social-link" aria-label="YouTube">
            <i className="social-icon">📺</i>
          </a>
        </div>
        
        <p className="copyright">
          &copy; {currentYear} BookHive. All rights reserved. Designed with ❤️ by Kartik Bhardwaj
        </p>
      </div>
    </footer>
  );
};

export default Footer;