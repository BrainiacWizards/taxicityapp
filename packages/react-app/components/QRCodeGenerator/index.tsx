import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  generate: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  generate = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (canvasRef.current) {
      setLoading(true);
      try {
        await QRCode.toCanvas(canvasRef.current, value);
        console.log('QR code generated!');
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (generate && value) {
      generateQRCode();
    }

    return () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }
    };
  }, [value, generate]);

  return (
    <div>
      {loading ? (
        <div
          style={{
            width: 200,
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span>Loading...</span>
        </div>
      ) : (
        <canvas width={200} height={200} ref={canvasRef}></canvas>
      )}
    </div>
  );
};
