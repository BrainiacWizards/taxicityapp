import React, { useState } from 'react';
// @ts-ignore
import QrReader from 'modern-react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  styles: any;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, styles }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err: any) => {
    setError(err.message);
  };

  return (
    <div className={styles.QrScanner}>
      {error === 'No video input devices found' ? (
        <p>QR Code Error: {error}</p>
      ) : (
        <QrReader delay={300} onError={handleError} onScan={handleScan} />
      )}
      {error && error !== 'No video input devices found' && (
        <p>QR Code Error: {error}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
