import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  styles: Record<string, string>;
}

let qrCalls = 0;

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, styles }) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScan = (result: any) => {
    if (result) {
      console.log('QR Code scanned:', result);
      onScan(result?.text);
      setError(null);
      setIsScanning(false);
    }
  };

  const handleError = (error: Error) => {
    console.error('QR Code scan error:', error);
    if (error.name === 'NotFoundError') {
      setError('Requested device not found');
    } else {
      setError(error?.message);
    }
  };

  const handleButtonClick = () => {
    setError('');
    setIsScanning((prev) => !prev);
  };

  useEffect(() => {
    if (isScanning) {
      const videoElement = document.getElementById(
        'qr-reader-video'
      ) as HTMLVideoElement;
      if (videoElement && videoElement.paused) {
        videoElement.play().catch((error) => {
          if (error.name === 'AbortError') {
            console.warn('Video play was interrupted.');
            setError('Video play was interrupted.');
          } else {
            console.error('Video play error:', error);
            setError('Video play error.');
          }
        });
      }
    }
  }, [isScanning]);

  useEffect(() => {
    const videoElement = document.getElementById(
      'qr-reader-video'
    ) as HTMLVideoElement;
    if (videoElement) {
      const handlePause = () => {
        if (!videoElement.paused) {
          videoElement.pause();
        }
      };
      videoElement.addEventListener('pause', handlePause);
      return () => {
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  qrCalls++;
  console.log('QR render: ', qrCalls);

  return (
    <div className={styles.QrScanner}>
      <button onClick={handleButtonClick} className={styles.ScanButton}>
        {isScanning ? 'Deactivate Scanner' : 'Activate Scanner'}
      </button>
      {isScanning && (
        <div>
          {error === 'Requested device not found' ? (
            <div className={styles.Error + ' inline-span'}>
              Camera not found <FaCamera />
            </div>
          ) : (
            <div>
              <div id="qr-reader-container">
                <QrReader
                  onResult={(result, error) => {
                    if (result) {
                      handleScan(result);
                    }
                    if (error) {
                      handleError(error);
                    }
                  }}
                  constraints={{ facingMode: 'user' }}
                  videoId="qr-reader-video"
                  videoStyle={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          )}
          {error && error !== 'Requested device not found' && (
            <p>QR Code Error: {error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
