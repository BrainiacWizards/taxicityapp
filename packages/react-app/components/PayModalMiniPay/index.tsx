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
import {
  contractAddress,
  abi,
  mainnetAbi,
  mainnetContractAddress,
} from '@/lib/contractConfig';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

interface iMiniPayModal {
  TaxiData: iTaxiData;
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
}

type PaymentState = 'idle' | 'processing' | 'success' | 'error';

const MiniPayModal: React.FC<iMiniPayModal> = ({
  TaxiData,
  setShowPaymentModal,
}) => {
  /*********States******************/
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentLog, setPaymentLog] = useState<string>('No log info yet..');
  const paymentInfoRef = useRef<HTMLDivElement>(null);
  const [copyIcon, setCopyIcon] = useState(<FaCopy size={20} />);
  const router = useRouter();
  const account = useAccount();

  const logPayment = useCallback((status: PaymentState, message: string) => {
    setPaymentState(status);
    setPaymentLog((prevLog) => `${prevLog}\n${message}`);
  }, []);

  // initialize contract and signer
  const { signer, contract } = useMemo(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
    const ABI = account?.chain?.testnet ? abi : mainnetAbi;
    const CONTRACT_ADDRESS = account?.chain?.testnet
      ? contractAddress
      : mainnetContractAddress;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return { provider, signer, contract };
  }, [contractAddress, abi]);

  /*******Trip and payment functions***************/
  const estimateGas = useCallback(async () => {
    try {
      const gasLimit = ethers.BigNumber.from(9000000); // Set a manual gas limit
      return { gasLimit };
    } catch (error) {
      console.error('Error estimating gas:', error);
      logPayment(
        'error',
        `Error estimating gas: ${
          (error as Error).message
        }, data: ${JSON.stringify(error)}`
      );

      toast.error('Error estimating gas, please check console for more info');
      throw error;
    }
  }, [contract, TaxiData.tripCode, logPayment]);

  const joinTrip = useCallback(
    async (tripCode: number) => {
      setPaymentLog('Joining trip...');
      try {
        const tripCost = ethers.utils.parseEther(TaxiData.price.toString());
        const gasLimit = await contract.estimateGas.joinTrip(tripCode, {
          value: tripCost,
        });

        const tx = await contract.joinTrip(tripCode, {
          value: tripCost,
          gasLimit: gasLimit,
        });
        await tx.wait();
        logPayment('success', `Joined trip with code: ${tripCode}`);
        toast.success(
          'Payment successful, you can now continue to trip, Thank you!'
        );
        return tripCode;
      } catch (error) {
        const errorMessage = (error as Error).message.split('(')[0].trim();
        logPayment('error', `Error joining trip: ${errorMessage}`);
        toast.error(`Error joining trip: ${errorMessage}`);
        throw new Error(`Error joining trip: ${String(error)}`);
      }
    },
    [contract, logPayment, TaxiData.price]
  );

  const initiatePayment = useCallback(async () => {
    if (paymentState === 'processing') {
      console.log('Payment already in progress');
      return;
    }

    setPaymentState('processing');
    setPaymentLog('Payment initiated...');
    try {
      const balance = await signer.getBalance();
      const tripCost = ethers.utils.parseEther(TaxiData.price.toString());

      if (balance.lt(tripCost)) {
        throw new Error('Insufficient funds to cover the trip cost');
      }

      setPaymentLog(
        `Initiating transaction: ${ethers.utils
          .formatUnits(tripCost, 'ether')
          .slice(0, 6)}...`
      );

      if (TaxiData.tripCode) {
        setPaymentLog(
          (prevLog) =>
            `${prevLog}\nJoining Trip with Code: ${TaxiData.tripCode}`
        );
        await joinTrip(TaxiData.tripCode);
      } else {
        setPaymentLog((prevLog) => `${prevLog}\ncouldn't find trip code!`);
        logPayment(
          'error',
          'Trip Code Not Found! if payment is successful, please report transaction (use your transaction hash) as reference'
        );
        throw new Error('Trip code is undefined');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      logPayment(
        'error',
        `Error initiating payment: ${(error as Error).message}`
      );
      toast.error('Error initiating payment, please try again');
    }
  }, [joinTrip, TaxiData.tripCode, paymentState, logPayment, TaxiData.price]);

  const hasInitiatedPayment = useRef(false);

  useEffect(() => {
    if (!hasInitiatedPayment.current) {
      toast.info('Initiating payment..., please check you wallet...');
      initiatePayment();
      hasInitiatedPayment.current = true;
    }
    return () => setPaymentState('idle');
  }, []);

  useEffect(() => {
    if (paymentInfoRef.current) {
      paymentInfoRef.current.scrollTo({
        top: paymentInfoRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [paymentLog]);

  const handleRetry = useCallback(() => {
    setPaymentState('idle');
    setPaymentLog('Retrying payment...');
    initiatePayment();
  }, [initiatePayment]);

  const handleCancel = useCallback(() => {
    setPaymentState('error');
    setPaymentLog((prevLog) => `${prevLog}\nPayment was cancelled.`);
    setShowPaymentModal(false);
  }, [setShowPaymentModal]);

  const handleContinue = useCallback(() => {
    setShowPaymentModal(false);
    router.push('/trip');
  }, [setShowPaymentModal, router]);

  const handleCopy = useCallback(() => {
    setCopyIcon(<FaCheckDouble size={20} />);
    navigator.clipboard.writeText(paymentLog);

    setTimeout(() => {
      setCopyIcon(<FaCopy size={20} />);
    }, 1000);
  }, [paymentLog]);

  const renderStatusIcon = useMemo(() => {
    switch (paymentState) {
      case 'processing':
        return (
          <Image
            src="/loader.gif"
            alt="Loading..."
            className={styles.loader}
            width={150}
            height={150}
          />
        );
      case 'success':
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
  }, [paymentState]);

  const renderActions = useMemo(() => {
    switch (paymentState) {
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
      case 'success':
        return (
          <>
            <button onClick={handleCopy} className={styles.copyButton}>
              <FaCopy size={24} />
            </button>
            <button onClick={handleContinue}>Continue</button>
          </>
        );
      case 'processing':
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
    paymentState,
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

export default MiniPayModal;
