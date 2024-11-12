import { Bars3Icon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCog,
  FaQuestionCircle,
  FaEnvelope,
  FaHome,
  FaTimes,
  FaUserCircle,
  FaCar,
} from 'react-icons/fa';
import Link from 'next/link';
import CustomConnectButton from './CustomConnectBtn';

const navLinks = [
  { href: '/', icon: <FaHome />, label: 'Home' },
  { href: '/how-it-works', icon: <FaCog />, label: 'Help' },
  { href: '/faq', icon: <FaQuestionCircle />, label: 'FAQ' },
  { href: '/contact', icon: <FaEnvelope />, label: 'Contact' },
  { href: '/u/profile', icon: <FaUserCircle />, label: 'User' },
  { href: '/d/profile', icon: <FaCar />, label: 'Driver' },
];

const socialPlatforms = [
  { name: 'facebook', icon: <FaFacebook /> },
  { name: 'twitter', icon: <FaTwitter /> },
  { name: 'instagram', icon: <FaInstagram /> },
];

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { connect } = useConnect();

  const handleResize = () => {
    setShowLinks(window.innerWidth >= 1100);
    setIsMobile(window.innerWidth < 1100);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: 'metaMask' }) });
    }
  }, [connect]);

  return (
    <header>
      <div className="top-navbar">
        <div className="social-icons">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              {platform.icon}
            </a>
          ))}
        </div>
        <div className="logo">
          <Link href="/">Taxi City</Link>
        </div>
      </div>
      <nav className="main-navbar">
        {isMobile && (
          <ul className="dropdown">
            <button
              className="dropdownBtn"
              onMouseDown={() => setShowLinks(!showLinks)}
            >
              {showLinks ? (
                <FaTimes aria-hidden="true" />
              ) : (
                <Bars3Icon aria-hidden="true" />
              )}
            </button>
          </ul>
        )}
        {(showLinks || !isMobile) && (
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li
                key={link.href}
                onClick={() => {
                  if (isMobile) setShowLinks(false);
                }}
              >
                <Link href={link.href}>
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="user-actions">
          <div className="wallet-address">
            {!hideConnectBtn ? <CustomConnectButton /> : <span>Welcome</span>}
          </div>
        </div>
      </nav>
    </header>
  );
}
