import React, { useState, useEffect } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner';
import styles from './checkout.module.css';
import { iTaxiData } from '@/models/RankMapModels';
import TaxiDetails from '@/components/TaxiDetails';
import Divider from '@/components/Divider';
import { useConnect, useAccount } from 'wagmi';
import PayModal from '@/components/PayModal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { abi, contractAddress } from '@/lib/contractConfig';
import PopUpLoader from '@/components/PopupLoader/'; // Import PopUpLoader

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { connectors } = useConnect();

  useEffect(() => {
    setIsMounted(true);
    const tripData = sessionStorage.getItem('trip');
    if (tripData) {
      setTaxiData(JSON.parse(tripData));
    }
  }, []);

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value);
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setAccessCode(data);
    }
  };

  const checkTripCode = async () => {
    if (!connectors) return;

    setIsVerifying(true);
    setCodeError('Verifying code...');

    try {
      const provider = new ethers.providers.Web3Provider(
        (await connectors[0].getProvider()) as ethers.providers.ExternalProvider
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tripCode = parseInt(accessCode);
      const tripDetails = await contract.getTripDetails(tripCode);

      if (tripDetails.driver !== ethers.constants.AddressZero) {
        setIsCodeEntered(true);
        setCodeError('Code Correct');
        setTaxiData({
          ...taxiData,
          tripCode,
        });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'trip',
            JSON.stringify({
              ...taxiData,
              tripCode,
            })
          );
        }
      } else {
        setCodeError('Incorrect code');
      }
    } catch (error) {
      console.error(error);
      setCodeError('Error checking code');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  const payForTrip = () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first.');
      return;
    }

    setShowPaymentModal(true);
  };

  return (
    <div className={styles.checkoutContainer}>
      {isVerifying && <PopUpLoader />}
      {showPaymentModal && (
        <PayModal
          TaxiData={taxiData}
          setShowPaymentModal={setShowPaymentModal}
        />
      )}
      <div className={styles.tripDetailsContainer}>
        <TaxiDetails
          TaxiData={taxiData}
          type="fitted"
          showTaxiDetails={() => {}}
        />
      </div>
      {/* <Divider /> */}
      {!isCodeEntered && isWalletConnected ? (
        <div className={styles.accessCodeContainer}>
          <h2>Enter Trip Access Code or Scan QR</h2>
          <div className={styles.accessCodeForm}>
            <input
              type="text"
              value={accessCode}
              onChange={handleAccessCodeChange}
              placeholder="Enter Trip Code"
              disabled={isVerifying}
            />
            <button onClick={checkTripCode} disabled={isVerifying}>
              Verify Code
            </button>
            <span className={styles.codeError}>{codeError}</span>
          </div>
          <span>Or</span>
          <QRCodeScanner onScan={handleScan} styles={styles} />
        </div>
      ) : (
        <>
          {!isWalletConnected ? (
            <button
              onClick={() => {
                if (openConnectModal) openConnectModal();
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <button onClick={payForTrip}>Pay with Wallet</button>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
