import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { useState } from 'react';

const Page = () => {
  const [value, setValue] = useState('1');
  const [generate, setGenerate] = useState(false);
  return (
    <>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setGenerate(false);
          setValue(e.target.value);
        }}
      />
      <button onClick={() => setGenerate(true)}>Generate QR Code</button>
      <QRCodeGenerator value={value} generate={generate} />;
    </>
  );
};

export default Page;
