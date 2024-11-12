import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { useChains, useAccount } from 'wagmi';
import { createPublicClient, formatEther, getContract, http } from 'viem';
import { celoAlfajores } from 'wagmi/chains';
import { stableTokenABI } from '@celo/abis';
import CustomConnectButton from '@/components/CustomConnectBtn';
import DriverLayout from '@/components/DriverLayout';
import Image from 'next/image';
import PopUpLoader from '@/components/PopupLoader'; // Import the PopUpLoader component

const STABLE_TOKEN_ADDRESS = process.env.STABLE_TOKEN_ADDRESS || '0x12345';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    walletAddress: '0x1234567890abcdef',
    phoneNumber: '+1234567890',
    totalTrips: 42,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [userBalance, setUserBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const chains = useChains();
  const account = useAccount();

  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });

  const chain = {
    hasIcon: true,
    iconBackground: '#FCFF52',
    iconUrl:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><circle cx="14" cy="14" r="14" fill="%23FCFF52"/><path d="M21 7H7v14h14v-4.887h-2.325a5.126 5.126 0 0 1-4.664 3.023c-2.844 0-5.147-2.325-5.147-5.147-.003-2.822 2.303-5.125 5.147-5.125 2.102 0 3.904 1.28 4.704 3.104H21V7Z" fill="%23000"/></svg>',
    id: 44787,
    name: 'Celo Alfajores',
    unsupported: false,
  };

  const fetchBalance = async () => {
    if (!account.address) {
      console.error('Account address is undefined');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const StableTokenContract = getContract({
        abi: stableTokenABI,
        address: (STABLE_TOKEN_ADDRESS || '0x123456') as `0x${string}`,
        client: publicClient,
      });

      const balanceInBigNumber = await StableTokenContract.read.balanceOf([
        account.address,
      ]);

      const balanceInEthers = formatEther(
        BigInt(balanceInBigNumber.toString())
      );
      setUserBalance(balanceInEthers);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        walletAddress: account.address?.toString() || '0x0',
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [account.address]);

  const handleSave = () => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      name,
    }));
    setIsEditing(false);
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard changes?')) {
      setName(userProfile.name);
      setIsEditing(false);
    }
  };

  const formFields = [
    {
      label: 'Name',
      type: 'text',
      value: name,
      readOnly: !isEditing,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setName(e.target.value),
      icon: '👤',
    },
    {
      label: 'Wallet Address',
      type: 'text',
      value: userProfile.walletAddress,
      readOnly: true,
      onChange: () => {},
      icon: '💼',
    },
    {
      label: 'Phone Number',
      type: 'text',
      value: userProfile.phoneNumber,
      readOnly: true,
      onChange: () => {},
      icon: '📞',
    },
    {
      label: 'Total Trips',
      type: 'number',
      value: userProfile.totalTrips.toString(),
      readOnly: true,
      onChange: () => {},
      icon: '🛣️',
    },
  ];

  return (
    <DriverLayout>
      <div className={styles.userProfile}>
        <form className={styles.profileForm}>
          <div className={styles.profileDetails}>
            {account.isConnected ? (
              <>
                <h1>{userProfile.name}</h1>
                <div className={styles.currencyDetails}>
                  <span key={chain.id} className={styles.balance}>
                    <Image
                      src={chain.iconUrl}
                      alt="Celo Icon"
                      className={styles.icon}
                      width={20}
                      height={20}
                    />
                    {userBalance.substring(0, 4)}{' '}
                    {chains[0].nativeCurrency.symbol}
                  </span>
                </div>
                {formFields.map((field, index) => (
                  <div className={styles.formGroup} key={index}>
                    <label>
                      {field.icon} {field.label}:
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      readOnly={field.readOnly}
                      onChange={field.onChange}
                    />
                  </div>
                ))}
                <div className={styles.formActions}>
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleSave}>
                        Save
                      </button>
                      <button type="button" onClick={handleDiscard}>
                        Discard
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3>You Need to Login First</h3>
                <CustomConnectButton />
              </>
            )}
          </div>
        </form>
        {isLoading && <PopUpLoader />} {/* Show PopUpLoader when loading */}
      </div>
    </DriverLayout>
  );
};

export default ProfilePage;
