import { RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';

import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/header.css';
import '../styles/footer.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { config } from '@/lib/config';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoadingStateChange = () => {
      setLoading(document.readyState !== 'complete');
    };

    // Set initial loading state
    handleLoadingStateChange();

    // Listen for changes in the loading state
    document.addEventListener('readystatechange', handleLoadingStateChange);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener(
        'readystatechange',
        handleLoadingStateChange
      );
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme({
            accentColor: '#bc74f7',
            borderRadius: 'large',
            overlayBlur: 'small',
          })}
        >
          <Layout>{loading ? <Loader /> : <Component {...pageProps} />}</Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
