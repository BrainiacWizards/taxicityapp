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
import { useWriteContract, useTransaction, BaseError } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { contractAddress, abi } from '@/lib/contractConfig';
import { type UseTransactionParameters } from 'wagmi';

interface iPayModal {
  TaxiData: iTaxiData;
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
}

const PayModal: React.FC<iPayModal> = ({ TaxiData, setShowPaymentModal }) => {
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'error'
  >('pending');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const [retry, setRetry] = useState<boolean>(false);
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

  const { writeContract } = useWriteContract();

  const createTrip = useCallback(async () => {
    setPaymentLog('Creating trip...');
    const { data } = await writeContract({
      abi: abi,
      address: contractAddress,
      functionName: 'createTrip',
      args: [
        parseEther(TaxiData.price.toString()).toBigInt(),
        TaxiData.details,
      ],
    });
    return data;
  }, [writeContract, TaxiData.price, TaxiData.details]);

  const joinTrip = useCallback(
    async (tripCode: string) => {
      setPaymentLog('Joining trip...');
      await writeContract({
        abi: abi,
        address: contractAddress,
        functionName: 'joinTrip',
        args: [tripCode],
      });
    },
    [writeContract]
  );

  const initiatePayment = useCallback(async () => {
    setPaymentLog('Payment initiated...');
    let tripCode = TaxiData.tripCode;
    if (!tripCode) {
      const data = await createTrip();
      tripCode = data?.toString();
    }
    await joinTrip(tripCode);
  }, [createTrip, joinTrip, TaxiData.tripCode]);

  const {
    data,
    error,
    isLoading,
    isSuccess: isConfirmed,
  }: UseTransactionParameters = useTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      logPayment('successful', 'Payment successful');
    } else if (isLoading) {
      logPayment('pending', 'Processing payment...');
    }

    if (error) {
      logPayment('error', (error as BaseError).message);
    }
  }, [isLoading, isConfirmed, error, logPayment]);

  useEffect(() => {
    if (retry) {
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
