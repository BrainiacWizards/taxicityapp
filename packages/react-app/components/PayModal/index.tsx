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

type PaymentStatus = 'pending' | 'successful' | 'error';

let calls = 0;

const PayModal: React.FC<iPayModal> = ({ TaxiData, setShowPaymentModal }) => {
  /*********States******************/
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const [isTransactionInProgress, setIsTransactionInProgress] =
    useState<boolean>(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState<boolean>(false);
  const paymentInfoRef = useRef<HTMLDivElement>(null);
  const [copyIcon, setCopyIcon] = useState(<FaCopy size={20} />);
  const router = useRouter();

  const logPayment = useCallback((status: PaymentStatus, message: string) => {
    setPaymentStatus(status);
    setPaymentLog((prevLog) => `${prevLog}\n${message}`);
  }, []);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const joinTrip = useCallback(
    async (tripCode: number) => {
      setPaymentLog('Joining trip...');
      try {
        const tx = await contract.joinTrip(tripCode, {
          value: ethers.utils.parseEther(TaxiData.price.toString()),
        });
        await tx.wait();
        logPayment('successful', `Joined trip with code: ${tripCode}`);
        return tripCode;
      } catch (error) {
        const errorMessage = (error as Error).message.split('(')[0].trim();
        logPayment('error', `Error joining trip: ${errorMessage}`);
        throw error;
      }
    },
    [contract, logPayment, TaxiData.price]
  );

  const initiatePayment = useCallback(async () => {
    if (isTransactionInProgress || isPaymentInitiated) {
      console.log('Payment already initiated');
      return;
    }

    setIsTransactionInProgress(true);
    setIsPaymentInitiated(true);
    setPaymentLog('Payment initiated...');
    try {
      if (TaxiData.tripCode) {
        await joinTrip(TaxiData.tripCode);
      } else {
        throw new Error('Trip code is undefined');
      }
    } catch (error) {
      if (error instanceof Error && 'data' in error) {
        logPayment(
          'error',
          `Error initiating payment: ${(error.data as Error).message}`
        );
      } else {
        logPayment(
          'error',
          `Error initiating payment: ${(error as Error).message}`
        );
      }
    } finally {
      setIsTransactionInProgress(false);
    }
  }, [
    joinTrip,
    TaxiData.tripCode,
    isTransactionInProgress,
    isPaymentInitiated,
  ]);

  useEffect(() => {
    calls++;
    console.log(
      'PayModal Called',
      new Date().toLocaleTimeString('en-US', { hour12: false }),
      calls
    );

    initiatePayment();

    return () => {
      // Cleanup function to reset states
      setPaymentStatus('pending');
      setPaymentLog('No log info yet..');
      setIsTransactionInProgress(false);
      setIsPaymentInitiated(false);
      setCopyIcon(<FaCopy size={20} />);
    };
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
    setIsPaymentInitiated(false);
    setIsTransactionInProgress(false);
    initiatePayment();
  }, [initiatePayment]);

  const handleCancel = useCallback(() => {
    setPaymentStatus('error');
    setPaymentLog((prevLog) => `${prevLog}\nPayment was cancelled.`);
    setIsPaymentInitiated(false);
    setIsTransactionInProgress(false);
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
