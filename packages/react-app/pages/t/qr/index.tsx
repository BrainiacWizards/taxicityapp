import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './styles.module.css'; // Assuming you have a CSS module for styling

const QrCodeScanner = () => {
  const [selected, setSelected] = useState('environment');
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState('');

  const handleScan = (scanData: string | null) => {
    if (scanData) {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
    }
    setLoadingScan(false);
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className={styles.container}>
      <h1>Hello CodeSandbox</h1>
      <h2>
        Last Scan:
        {selected}
      </h2>

      <button
        onClick={() => {
          setStartScan(!startScan);
        }}
      >
        {startScan ? 'Stop Scan' : 'Start Scan'}
      </button>
      {startScan && (
        <>
          <select onChange={(e) => setSelected(e.target.value)}>
            <option value={'environment'}>Back Camera</option>
            <option value={'user'}>Front Camera</option>
          </select>
          <QrReader
            constraints={{ facingMode: selected }}
            onResult={(result, error) => {
              if (!!result) {
                handleScan(result.getText());
              }
              if (!!error) {
                handleError(error);
              }
            }}
          />
        </>
      )}
      {loadingScan && <p>Loading</p>}
      {data && <p>{data}</p>}
    </div>
  );
};

export default QrCodeScanner;
