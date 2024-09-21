import React, { useEffect, useRef, useState } from 'react';
import { iTaxiData } from '@/models/RankMapModels';
import styles from './paymodal.module.css';

const PayModal: React.FC<{ TaxiData: iTaxiData }> = ({ TaxiData }) => {
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'error'
  >('pending');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const paymentInfoRef = useRef<HTMLDivElement>(null);

  const simulatePayment = async () => {
    const logPayment = (
      status: 'pending' | 'successful' | 'error',
      message: string
    ) => {
      setPaymentStatus(status);
      setPaymentLog((prevLog) => `${prevLog}\n${message}`);
    };

    setPaymentLog('Payment initiated...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (isCancelled) {
      logPayment('error', 'Transaction Cancelled');
      return;
    }
    logPayment('pending', 'Payment is pending...');

    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (isCancelled) {
      logPayment('error', 'Transaction Cancelled');
      return;
    }
    // logPayment('successful', 'Payment was successful!');
  };

  useEffect(() => {
    if (retry) {
      setIsCancelled(false);
      setPaymentStatus('pending');
      setPaymentLog('Retrying payment...');
      simulatePayment();
      setRetry(false);
    } else {
      simulatePayment();
    }
  }, [retry]);

  useEffect(() => {
    if (paymentInfoRef.current) {
      paymentInfoRef.current.scrollTo({
        top: paymentInfoRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [paymentLog]);

  const handleRetry = () => {
    setRetry(true);
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setPaymentStatus('error');
    setPaymentLog((prevLog) => `${prevLog}\nPayment was cancelled.`);
  };

  const renderStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return (
          <img src="/loader.gif" alt="Loading..." className={styles.loader} />
        );
      case 'successful':
        return (
          <img src="/success-icon.png" alt="Success" className={styles.icon} />
        );
      case 'error':
        return (
          <img src="/error-icon.png" alt="Error" className={styles.icon} />
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (paymentStatus) {
      case 'error':
        return (
          <>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleRetry}>Retry</button>
          </>
        );
      case 'successful':
        return <button>Continue</button>;
      case 'pending':
        return <button onClick={handleCancel}>Cancel</button>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.payModalContainer}>
      <div className={styles.payModal}>
        <h2>Price: {TaxiData.price} Celo</h2>
        <div className={styles.paymentStatus}>
          {renderStatusIcon()}
          <p>Status: {paymentStatus}</p>
        </div>
        <div className={styles.paymentInfo} ref={paymentInfoRef}>
          {paymentLog.split('\n').map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
        <div className={styles.paymentActions}>{renderActions()}</div>
      </div>
    </div>
  );
};

export default PayModal;
