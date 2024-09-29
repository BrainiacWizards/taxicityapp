import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { iTaxiData } from '@/models/RankMapModels';
import styles from './paymodal.module.css';
import Image from 'next/image';
import { FaCheckDouble, FaCopy } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { contractAddress, abi } from '@/lib/contractConfig';

interface iPayModal {
  TaxiData: iTaxiData;
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
}

const PayModal: React.FC<iPayModal> = ({ TaxiData, setShowPaymentModal }) => {
  console.log('TaxiData', TaxiData);
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'error'
  >('pending');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const [isTransactionInProgress, setIsTransactionInProgress] =
    useState<boolean>(false);
  const paymentInfoRef = useRef<HTMLDivElement>(null);
  const [copyIcon, setCopyIcon] = useState(<FaCopy size={20} />);
  const router = useRouter();

  const logPayment = useCallback(
    (status: 'pending' | 'successful' | 'error', message: string) => {
      setPaymentStatus(status);
      setPaymentLog((prevLog) => `${prevLog}\n${message}`);
    },
    []
  );

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const createTrip = useCallback(async () => {
    setPaymentLog('Creating trip...');
    try {
      const details = `Route: ${TaxiData.route}, Verified: ${TaxiData.verified}, Capacity: ${TaxiData.capacity}`;

      const tx = await contract.createTrip(
        ethers.utils.parseEther(TaxiData.price.toString()),
        details
      );
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt); // Log the receipt to debug

      // Parse the TripCreated event from the receipt
      const event = receipt.events?.find(
        (event: any) => event.event === 'TripCreated'
      );
      const tripCounter = event?.args.tripCode?.toString();

      console.log(event, tripCounter);

      if (!tripCounter) {
        throw new Error('Trip counter is undefined');
      }
      logPayment('successful', `Trip created with Code: ${tripCounter}`);
      return tripCounter;
    } catch (error: unknown) {
      logPayment('error', `Error creating trip: ${(error as Error).message}`);
      throw error;
    }
  }, [contract, TaxiData.price, TaxiData, logPayment]);

  const joinTrip = useCallback(
    async (tripCode: number) => {
      setPaymentLog('Joining trip...');
      try {
        const tx = await contract.joinTrip(tripCode);
        await tx.wait();
        logPayment('successful', `Joined trip with code: ${tripCode}`);
        return tripCode;
      } catch (error) {
        logPayment('error', `Error joining trip: ${(error as Error).message}`);
        throw error;
      }
    },
    [contract, logPayment]
  );

  const completeTrip = useCallback(
    async (tripCode: number) => {
      setPaymentLog('Completing trip (payment)...');
      try {
        const tx = await contract.completeTrip(tripCode, {
          value: ethers.utils.parseEther(TaxiData.price.toString()), //  (just for test purposes)
        });
        await tx.wait();
        logPayment('successful', `Completed trip with code: ${tripCode}`);
      } catch (error) {
        logPayment(
          'error',
          `Error completing trip: ${(error as Error).message}`
        );
        throw error;
      }
    },
    [contract, logPayment, TaxiData.price]
  );

  const initiatePayment = useCallback(async () => {
    if (isTransactionInProgress) return;
    setIsTransactionInProgress(true);
    setPaymentLog('Payment initiated...');
    try {
      if (TaxiData.tripCode) {
        const tripCode = await joinTrip(TaxiData.tripCode);
        await completeTrip(tripCode);
      } else {
        logPayment('error', 'Error creating trip, invalid trip code');
      }
    } catch (error) {
      logPayment(
        'error',
        `Error initiating payment: ${(error as Error).message}`
      );
    } finally {
      setIsTransactionInProgress(false);
    }
  }, [
    createTrip,
    joinTrip,
    completeTrip,
    TaxiData.tripCode,
    isTransactionInProgress,
  ]);

  useEffect(() => {
    initiatePayment();
  }, []); // Call initiatePayment only once when the component mounts

  useEffect(() => {
    if (paymentInfoRef.current) {
      paymentInfoRef.current.scrollTo({
        top: paymentInfoRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [paymentLog]);

  const handleRetry = useCallback(() => {
    setPaymentStatus('pending');
    setPaymentLog('Retrying payment...');
    initiatePayment();
  }, [initiatePayment]);

  const handleCancel = useCallback(() => {
    setPaymentStatus('error');
    setPaymentLog((prevLog) => `${prevLog}\nPayment was cancelled.`);
    setShowPaymentModal(false);
  }, [setShowPaymentModal]);

  const handleContinue = useCallback(() => {
    setShowPaymentModal(false);
    router.push('/trip');
  }, [setShowPaymentModal]);

  const handleCopy = useCallback(() => {
    setCopyIcon(<FaCheckDouble size={20} />);
    navigator.clipboard.writeText(paymentLog);

    setTimeout(() => {
      setCopyIcon(<FaCopy size={20} />);
    }, 1000);
  }, [paymentLog]);

  const renderStatusIcon = useMemo(() => {
    switch (paymentStatus) {
      case 'pending':
        return (
          <Image
            src="/loader.gif"
            alt="Loading..."
            className={styles.loader}
            width={150}
            height={150}
          />
        );
      case 'successful':
        return (
          <Image
            src="/success-icon.png"
            alt="Success"
            className={styles.icon}
            width={150}
            height={150}
          />
        );
      case 'error':
        return (
          <Image
            src="/error-icon.png"
            alt="Error"
            className={styles.icon}
            width={150}
            height={150}
          />
        );
      default:
        return null;
    }
  }, [paymentStatus]);

  const renderActions = useMemo(() => {
    switch (paymentStatus) {
      case 'error':
        return (
          <>
            <button onClick={() => handleCancel()}>Cancel</button>
            <button onClick={() => handleCopy()} className={styles.copyButton}>
              {copyIcon}
            </button>
            <button onClick={() => handleRetry()}>Retry</button>
          </>
        );
      case 'successful':
        return (
          <>
            <button onClick={() => handleCopy()} className={styles.copyButton}>
              <FaCopy size={24} />
            </button>
            <button onClick={() => handleContinue()}>Continue</button>
          </>
        );
      case 'pending':
        return (
          <>
            <button onClick={() => handleCopy()} className={styles.copyButton}>
              <FaCopy size={24} />
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        );
      default:
        return null;
    }
  }, [
    paymentStatus,
    handleCancel,
    handleCopy,
    handleRetry,
    handleContinue,
    copyIcon,
  ]);

  return (
    <div className={styles.payModalContainer}>
      <div className={styles.payModal}>
        <h2>Price: {TaxiData.price} Celo</h2>
        <div className={styles.paymentStatus}>{renderStatusIcon}</div>
        <div className={styles.paymentInfo} ref={paymentInfoRef}>
          {paymentLog.split('\n').map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
        <div className={styles.paymentActions}>{renderActions}</div>
      </div>
    </div>
  );
};

export default PayModal;
