import { useState, useRef, RefObject } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [text, setText] = useState<string>('');
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);

  const generateQRCode = () => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
      });
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          placeholder="Enter text to generate QR code"
        />
        <button onClick={generateQRCode}>Generate QR Code</button>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
