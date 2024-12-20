import { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Footer from './Footer';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'TaxiCity',
  description:
    'Find a taxi rank near you, pay with crypto, and get a discount!',
  twitter: {
    card: 'summary_large_image',
    images: 'URL to your Twitter link preview image',
    title: 'Your Twitter link preview title',
    description: 'Your Twitter link preview description',
  },
  openGraph: {
    title: 'Your link preview title',
    description: 'Your link preview description',
    url: 'Canonical link preview URL',
    siteName: 'Your site name',
    images: 'URL to your link preview image',
  },
};

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <ToastContainer />
      <Header />
      <main style={{ backgroundColor: 'rgba(255, 255, 255, 0.71)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
