import React, { useState } from 'react';
// import QrReader from 'react-qr-reader';
// import QrReader from 'modern-react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  styles: Record<string, string>;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ styles }) => {
  const [error] = useState<string | null>(null);

  return (
    <div className={styles.QrScanner}>
      {error === 'No video input devices found' ? (
        <p>QR Code Error: {error}</p>
      ) : (
        // <QrReader delay={300} onError={handleError} onScan={handleScan} />
        <>QR Code</>
      )}
      {error && error !== 'No video input devices found' && (
        <p>QR Code Error: {error}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
