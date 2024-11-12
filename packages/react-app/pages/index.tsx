import RankLocator from '@/components/RankLocator';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
  const [, setUserAddress] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RankLocator />
    </>
  );
}
