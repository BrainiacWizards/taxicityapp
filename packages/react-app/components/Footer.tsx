// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="social-icons">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a
            href="mailto:info@taxicity.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Taxi City. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
