import { useRef, useState, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
}

type ScannerState = 'stopped' | 'starting' | 'scanning' | 'stopping';

const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment'
  );
  const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerState, setScannerState] = useState<ScannerState>('stopped');

  // Reference to the reader element
  const readerRef = useRef<HTMLDivElement | null>(null);

  // Start scanning
  const startScanning = async () => {
    if (scannerState !== 'stopped') {
      console.warn('Scanner is not in a state to start scanning');
      return;
    }

    if (readerRef.current) {
      const qrCodeScanner = new Html5Qrcode(readerRef.current.id);
      qrCodeScannerRef.current = qrCodeScanner;
      setScannerState('starting');

      const config = {
        fps: 10,
        qrbox: function (viewfinderWidth: number, viewfinderHeight: number) {
          const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdgeSize * 0.75); // Adjust the percentage as needed
          return {
            width: qrboxSize,
            height: qrboxSize,
          };
        },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      try {
        await qrCodeScanner.start(
          { facingMode },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
            setScanning(false); // This will trigger stopScanning via useEffect
          },
          (errorMessage) => {
            console.warn('QR Scan Error:', errorMessage);
          }
        );
        setScannerState('scanning');
      } catch (err) {
        console.error('Failed to start scanning:', err);
        setScannerState('stopped');
      }
    } else {
      console.error('Reader element not found');
    }
  };

  // Stop scanning
  const stopScanning = async () => {
    if (scannerState !== 'scanning') {
      return;
    }

    const qrCodeScanner = qrCodeScannerRef.current;
    if (qrCodeScanner) {
      setScannerState('stopping');
      try {
        await qrCodeScanner.stop();
        await qrCodeScanner.clear();
        qrCodeScannerRef.current = null;
        setScannerState('stopped');
      } catch (err) {
        console.error('Failed to stop scanning:', err);
        qrCodeScannerRef.current = null;
        setScannerState('stopped');
      }
    }
  };

  // Handle Pay button click
  const handlePayClick = () => {
    setScanning(true);
  };

  // Handle Cancel button click
  const handleCancelClick = () => {
    setScanning(false);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (scannerState !== 'scanning') {
      console.warn('Cannot switch camera, scanner is not active');
      return;
    }

    stopScanning().then(() => {
      setFacingMode((prevMode) =>
        prevMode === 'environment' ? 'user' : 'environment'
      );
      setTimeout(() => {
        if (scanning) {
          startScanning();
        }
      }, 500);
    });
  };

  // Effect to start/stop scanning when scanning state changes
  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

    // Cleanup function
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, facingMode]);

  return (
    <>
      {!scanning ? (
        <button onClick={handlePayClick} style={{ width: '100%' }}>
          Scan to pay
        </button>
      ) : (
        <>
          <div
            id="reader"
            ref={readerRef}
            className=""
            style={{
              aspectRatio: '1 / 1', // Ensures a square aspect ratio
            }}
          >
            {/* Empty div for the QR reader */}
            <div className=""></div>
          </div>
          <div>
            <button onClick={toggleCamera}>Switch Camera</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        </>
      )}
    </>
  );
};

const QrCodeScannerPage = () => {
  const handleScanSuccess = (data: string) => {
    console.log('Scanned data:', data);
  };

  return <QRScanner onScanSuccess={handleScanSuccess} />;
};

export default QrCodeScannerPage;
