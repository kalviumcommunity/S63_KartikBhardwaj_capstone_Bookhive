import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          BookHive
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={isMenuOpen ? 'menu-icon-bar open' : 'menu-icon-bar'}></span>
          <span className={isMenuOpen ? 'menu-icon-bar open' : 'menu-icon-bar'}></span>
          <span className={isMenuOpen ? 'menu-icon-bar open' : 'menu-icon-bar'}></span>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link href="/" className={router.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/books" 
              className={router.pathname === '/books' ? 'find-books-button active' : 'find-books-button'}
              style={{
                background: '#722F37', // Rich burgundy solid color
                color: 'white',
                padding: '0.9rem 1.8rem',
                borderRadius: '50px', // Fully rounded pill shape
                textDecoration: 'none',
                fontWeight: '700', // Bold text
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center', // Perfect centering
                gap: '0.6rem',
                border: 'none', // Remove border for solid filled design
                boxShadow: '0 4px 15px rgba(114, 47, 55, 0.3)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#8B3A42'; // Slightly brighter on hover
                e.target.style.transform = 'translateY(-2px)'; // Lift effect
                e.target.style.boxShadow = '0 8px 25px rgba(114, 47, 55, 0.4)'; // Enhanced shadow
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#722F37'; // Return to original
                e.target.style.transform = 'translateY(0)'; // Return to original position
                e.target.style.boxShadow = '0 4px 15px rgba(114, 47, 55, 0.3)'; // Original shadow
              }}
            >
              {/* Clean, minimalist magnifying glass SVG icon */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <circle 
                  cx="11" 
                  cy="11" 
                  r="8" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="m21 21-4.35-4.35" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Find Books
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/authors" className={router.pathname === '/authors' ? 'nav-link active' : 'nav-link'}>
              Authors
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/login" className="nav-link-button">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/signup" className="nav-link-button primary">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;