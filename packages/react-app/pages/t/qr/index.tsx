import { QRScanner } from '@/components/QRScanner';
import React from 'react';

const Page = () => {
  const onScan = (code: string) => {
    console.log('Scanned code:', code);
  };

  return <QRScanner onScan={onScan} />;
};

export default Page;
