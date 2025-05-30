import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">BookHive</h3>
          <p className="footer-description">
            Your ultimate destination for discovering, reviewing, and sharing your favorite books.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li><Link href="/books">Books</Link></li>
            <li><Link href="/authors">Authors</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/categories">Categories</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/signup">Sign Up</Link></li>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/settings">Settings</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Connect</h4>
          <ul className="footer-links">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BookHive. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;