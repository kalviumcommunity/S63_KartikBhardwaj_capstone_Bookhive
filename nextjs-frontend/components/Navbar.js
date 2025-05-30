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
            <Link href="/books" className={router.pathname === '/books' ? 'nav-link active' : 'nav-link'}>
              Books
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