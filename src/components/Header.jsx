import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
        TITAN<span>FIT</span>
      </Link>
      
      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li><a href="#membership" onClick={() => setIsMenuOpen(false)}>Membership</a></li>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
          <li>
            <Link 
              to="/join" 
              className={`btn-contact ${isActive('/join') ? 'active-btn' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mobile-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </header>
  );
};

export default Header;
