import React from 'react';
import { Instagram, Twitter, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">
              TITAN<span>FIT</span>
            </Link>
            <p className="brand-desc">
              Pushing you beyond your limits. Join the elite community of fitness enthusiasts and transform your life today.
            </p>
            <div className="social-links">
              <a href="#"><Instagram size={20} /></a>
              <a href="#"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/join">Join Now</Link></li>
              <li><a href="#membership">Membership</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>CONTACT US</h4>
            <ul>
              <li><MapPin size={18} /> 123 Fitness Ave, Mumbai, India</li>
              <li><Phone size={18} /> +91 98765 43210</li>
              <li><Mail size={18} /> contact@titanfit.com</li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>NEWSLETTER</h4>
            <p>Subscribe to get the latest fitness tips and offers.</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Your Email" />
              <button>JOIN</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TITAN FIT. ALL RIGHTS RESERVED.</p>
          
          <div className="watermark-tag">
            POWERED BY <a href="https://www.adyber.com" target="_blank" rel="noopener noreferrer">ADYBER</a>
          </div>

          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
