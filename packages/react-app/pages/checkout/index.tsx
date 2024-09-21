import React, { useState, useEffect } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner/QRCodeScanner';
import styles from './checkout.module.css';
import { iTaxiData } from '@/models/RankMapModels';
import TaxiDetails from '@/components/TaxiDetails/TaxiDetails';
import Divider from '@/components/Divider/Divider';
import { useConnect } from 'wagmi';

const dummyTaxiData: iTaxiData = {
  capacity: 0,
  driver: 'NA',
  price: 70,
  rankName: 'NA',
  registration: 'NA',
  route: 'NA',
  verified: false,
};

const Checkout: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [taxiData, setTaxiData] = useState<iTaxiData>(dummyTaxiData);
  const code = 'ABC1235';

  useEffect(() => {
    if (accessCode.trim() === '') {
      setCodeError('');
    } else if (code === accessCode) {
      setIsCodeEntered(true);
      setCodeError('Code Correct');
    } else {
      setCodeError('Incorrect code');
    }
  }, [accessCode]);

  useEffect(() => {
    setIsMounted(true);
    const tripData = sessionStorage.getItem('trip');
    if (tripData) {
      setTaxiData(JSON.parse(tripData));
    }
  }, []);

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value);
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setAccessCode(data);
    }
  };

  if (!isMounted) {
    return null;
  }

  const payForTrip = () => {};

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.tripDetailsContainer}>
        <TaxiDetails
          TaxiData={taxiData}
          type="fitted"
          showTaxiDetails={() => {}}
        />
      </div>

      <Divider />

      {!isCodeEntered ? (
        <div className={styles.accessCodeContainer}>
          <h2>Enter Trip Access Code or Scan QR</h2>
          <div className={styles.accessCodeForm}>
            <input
              type="text"
              value={accessCode}
              onChange={handleAccessCodeChange}
              placeholder="Enter Trip Code"
            />
            <span className={styles.codeError}>{codeError}</span>
          </div>
          <span>Or</span>
          <QRCodeScanner onScan={handleScan} styles={styles} />
        </div>
      ) : (
        <button>Pay with Wallet</button>
      )}
    </div>
  );
};

export default Checkout;
