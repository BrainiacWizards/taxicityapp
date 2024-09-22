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
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { FaCheckDouble, FaCopy } from 'react-icons/fa';
import { ethers } from 'ethers';

interface iPayModal {
  TaxiData: iTaxiData;
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
}

const PayModal: React.FC<iPayModal> = ({ TaxiData, setShowPaymentModal }) => {
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'error'
  >('pending');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const paymentInfoRef = useRef<HTMLDivElement>(null);
  const [copyIcon, setCopyIcon] = useState(<FaCopy size={20} />);

  const logPayment = useCallback(
    (status: 'pending' | 'successful' | 'error', message: string) => {
      setPaymentStatus(status);
      setPaymentLog((prevLog) => `${prevLog}\n${message}`);
    },
    []
  );

  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const to = '0x0717329C677ab484EAA73F4C8EEd92A2FA948746';
  // const value = useMemo(() => TaxiData.price.toString(), [TaxiData.price]);
  const value = '1.2';

  const initiatePayment = useCallback(() => {
    if (!paymentInfoRef.current) {
      return null;
    }
    setPaymentLog('Payment initiated...');
    sendTransaction({
      to,
      data: '0x0717329c677ab484eaa73f4c8eed92a2fa948746',
    });
  }, [sendTransaction, to, value]);

  useEffect(() => {
    if (isCancelled) {
      logPayment('error', 'Transaction Cancelled');
      return;
    }

    if (isConfirmed) {
      logPayment('successful', 'Payment successful');
    } else if (isPending) {
      logPayment('pending', 'Processing payment...');
    } else if (isConfirming) {
      logPayment('pending', 'Confirming payment...');
    }

    if (error) {
      logPayment('error', error.message);
    }
  }, [isPending, isConfirmed, isConfirming, isCancelled, error, logPayment]);

  useEffect(() => {
    if (retry) {
      setIsCancelled(false);
      setPaymentStatus('pending');
      setPaymentLog('Retrying payment...');
      initiatePayment();
      setRetry(false);
    } else {
      initiatePayment();
    }
  }, [retry, initiatePayment]);

  useEffect(() => {
    if (paymentInfoRef.current) {
      paymentInfoRef.current.scrollTo({
        top: paymentInfoRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [paymentLog]);

  const handleRetry = useCallback(() => {
    setRetry(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsCancelled(true);
    setPaymentStatus('error');
    setPaymentLog((prevLog) => `${prevLog}\nPayment was cancelled.`);
    setShowPaymentModal(false);
  }, []);

  const handleContinue = useCallback(() => {
    setShowPaymentModal(false);
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
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleCopy} className={styles.copyButton}>
              {copyIcon}
            </button>
            <button onClick={handleRetry}>Retry</button>
          </>
        );
      case 'successful':
        return (
          <>
            <button onClick={handleCopy} className={styles.copyButton}>
              <FaCopy size={24} />
            </button>
            <button onClick={handleContinue}>Continue</button>
          </>
        );
      case 'pending':
        return (
          <>
            <button onClick={handleCopy} className={styles.copyButton}>
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
