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
} from 'react-icons/fa';
import Link from 'next/link';
import CustomConnectButton from './CustomConnectBtn/CustomConnectBtn';

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const { connect } = useConnect();

  useEffect(() => {
    setShowLinks(window.innerWidth > 800);
  }, []);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: 'metaMask' }) });
    }

    const handleResize = () => setShowLinks(window.innerWidth > 800);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [connect]);

  const navLinks = [
    { href: '/', icon: <FaHome />, label: 'Home' },
    { href: '/how-it-works', icon: <FaCog />, label: 'Help' },
    { href: '/faq', icon: <FaQuestionCircle />, label: 'FAQ' },
    { href: '/contact', icon: <FaEnvelope />, label: 'Contact' },
  ];

  const socialPlatforms = [
    { name: 'facebook', icon: <FaFacebook /> },
    { name: 'twitter', icon: <FaTwitter /> },
    { name: 'instagram', icon: <FaInstagram /> },
  ];

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
        <ul className="dropdown">
          <button
            className="dropdownBtn"
            onClick={() => setShowLinks(!showLinks)}
          >
            {showLinks ? (
              <FaTimes aria-hidden="true" />
            ) : (
              <Bars3Icon aria-hidden="true" />
            )}
          </button>
        </ul>
        {showLinks && (
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
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
