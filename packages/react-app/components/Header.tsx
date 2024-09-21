import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaInfoCircle,
  FaCog,
  FaQuestionCircle,
  FaEnvelope,
  FaHome,
} from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: 'metaMask' }) });
    }
  }, []);

  return (
    <header>
      <div className="top-navbar">
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
        </div>
        <div className="logo">
          <Link href="/">Taxi City</Link>
        </div>
      </div>
      <nav className="main-navbar">
        <ul className="nav-links">
          <li>
            <Link href="/">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link href="/about">
              <FaInfoCircle /> About
            </Link>
          </li>
          <li>
            <Link href="/how-it-works">
              <FaCog /> How It Works
            </Link>
          </li>
          <li>
            <Link href="/faq">
              <FaQuestionCircle /> FAQ
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <FaEnvelope /> Contact
            </Link>
          </li>
        </ul>
        <div className="user-actions">
          <div className="wallet-address">
            {!hideConnectBtn && (
              <ConnectButton
                showBalance={{
                  smallScreen: true,
                  largeScreen: false,
                }}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
