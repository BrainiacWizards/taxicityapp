import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  styles: Record<string, string>;
}

const useQRScanner = (onScan: (data: string | null) => void) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const videoElement = document.getElementById(
      'qr-reader-video'
    ) as HTMLVideoElement;
    if (!videoElement) return;

    if (isScanning && videoElement.paused) {
      videoElement.play().catch((error) => {
        setError(
          error.name === 'AbortError'
            ? 'Video play was interrupted.'
            : 'Video play error.'
        );
      });
    }

    const handlePause = () => videoElement.paused && videoElement.pause();
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('pause', handlePause);
      if (videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isScanning]);

  const handleScan = (result: any) => {
    if (result?.text) {
      onScan(result.text);
      setError(null);
      setIsScanning(false);
    }
  };

  return { error, isScanning, setIsScanning, handleScan, setError };
};

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, styles }) => {
  const { error, isScanning, setIsScanning, handleScan, setError } =
    useQRScanner(onScan);

  if (!isScanning) {
    return (
      <div className={styles.QrScanner}>
        <button
          onClick={() => setIsScanning(true)}
          className={styles.ScanButton}
        >
          Activate Scanner
        </button>
      </div>
    );
  }

  return (
    <div className={styles.QrScanner}>
      <button
        onClick={() => setIsScanning(false)}
        className={styles.ScanButton}
      >
        Deactivate Scanner
      </button>

      {error === 'Requested device not found' ? (
        <div className={styles.Error + ' inline-span'}>
          Camera not found <FaCamera />
        </div>
      ) : (
        <QrReader
          onResult={(result, error) => {
            result && handleScan(result);
            error && setError(error.message);
          }}
          constraints={{ facingMode: 'user' }}
          videoId="qr-reader-video"
          videoStyle={{ width: '100%', height: '100%' }}
        />
      )}

      {error && error !== 'Requested device not found' && (
        <p>QR Code Error: {error}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
