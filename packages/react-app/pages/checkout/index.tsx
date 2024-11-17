import React, { useState, useEffect, useCallback, useRef } from 'react';
// import QRCodeScanner from '@/components/QRCodeScanner';
import styles from './checkout.module.css';
import { iTaxiData } from '@/models/RankMapModels';
import TaxiDetails from '@/components/TaxiDetails';
import { useConnect, useAccount } from 'wagmi';
import PayModal from '@/components/PayModal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { abi, contractAddress } from '@/lib/contractConfig';
import PopUpLoader from '@/components/PopupLoader/'; // Import PopUpLoader
import QRCodeScanner from '@/components/QRCodeScanner';
import { FaQrcode } from 'react-icons/fa';

let checkoutCalls = 0;

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
  checkoutCalls++;
  const [codeError, setCodeError] = useState('');
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [taxiData, setTaxiData] = useState<iTaxiData>(dummyTaxiData);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { connectors } = useConnect();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const tripData = sessionStorage.getItem('trip');
    if (tripData) setTaxiData(JSON.parse(tripData));
  }, []);

  const checkTripCode = useCallback(async () => {
    if (!connectors) return;
    if (!isVerifying) setIsVerifying(true);

    try {
      const accessCode = inputRef.current?.value || '-1';

      if (
        accessCode.trim() === '' ||
        isNaN(parseInt(accessCode)) ||
        parseInt(accessCode) < 0
      ) {
        setCodeError('Enter a code');
        return;
      }

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
        setTaxiData((prevTaxiData) => ({
          ...prevTaxiData,
          tripCode,
        }));

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
  }, [connectors, isVerifying]);

  const payForTrip = useCallback(() => {
    if (!isConnected) return;
    if (!showPaymentModal) setShowPaymentModal(true);
  }, [isConnected, showPaymentModal]);

  console.log('checkout component rendered', checkoutCalls, {
    codeError,
    isCodeEntered,
    isMounted,
    taxiData,
    showPaymentModal,
    isConnected,
    isVerifying,
  });

  function handleScan(data: string | null): void {
    console.log(data);
  }

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
      {!isCodeEntered && isConnected ? (
        <div className={styles.accessCodeContainer}>
          <h2>Enter Trip Access Code or Scan QR</h2>
          <div className={styles.accessCodeForm}>
            <input
              type="text"
              placeholder="Enter Trip Code"
              disabled={isVerifying}
              ref={inputRef}
            />
            <button onClick={checkTripCode} disabled={isVerifying}>
              Verify Code
            </button>
            <span className={styles.codeError}>{codeError}</span>
          </div>
          <span>Or</span>
          <span className="inline-span">
            Scan QR Code <FaQrcode />
          </span>
          <QRCodeScanner onScan={handleScan} styles={styles} />
        </div>
      ) : (
        <div className={styles.accessCodeContainer}>
          {!isConnected ? (
            <button
              onClick={() => {
                if (openConnectModal) openConnectModal();
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <h3>Trip Code correct: Proceed to pay.</h3>
              <button onClick={payForTrip}>Pay with Wallet</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
