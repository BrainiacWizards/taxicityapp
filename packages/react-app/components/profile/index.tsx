import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './profile.module.css';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import CustomConnectButton from '@/components/CustomConnectBtn';
import PopUpLoader from '@/components/PopupLoader';

const STABLE_TOKEN_ADDRESS: `0x${string}` =
  (process.env.STABLE_TOKEN_ADDRESS as `0x${string}`) ||
  '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9';

interface UserProfile {
  name: string;
  walletAddress: string;
  phoneNumber: string;
  totalTrips: number;
  balance: bigint;
}

interface FormField {
  label: string;
  type: string;
  value: string;
  readOnly: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: string;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    walletAddress: '',
    phoneNumber: '+1234567890',
    totalTrips: 42,
    balance: BigInt(0),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [isLoading, setIsLoading] = useState(false);
  const account = useAccount();
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: account.address,
    token: account?.chain?.testnet
      ? STABLE_TOKEN_ADDRESS
      : '0x471EcE3750Da237f93B8E339c536989b8978a438',
  });

  console.log(account);

  useEffect(() => {
    if (account.address) {
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        walletAddress: account.address?.toString() || '0x0',
      }));
    }
  }, [account.address]);

  useEffect(() => {
    if (balanceData) {
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        balance: BigInt(balanceData.value),
      }));
    }
  }, [balanceData]);

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

  const formatBalance = (amount: bigint) => {
    return parseFloat(formatEther(amount).toString()).toFixed(2);
  };

  const formFields: FormField[] = [
    {
      label: 'Name',
      type: 'text',
      value: name,
      readOnly: !isEditing,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
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
    <>
      <div className={styles.userProfile}>
        <form className={styles.profileForm}>
          <div className={styles.profileDetails}>
            {account.isConnected ? (
              <>
                <h1>{userProfile.name}</h1>
                <div className={styles.currencyDetails}>
                  <span key={account?.chain?.id} className={styles.balance}>
                    {formatBalance(userProfile.balance)}{' '}
                    {account?.chain?.nativeCurrency.symbol}
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
        {(isLoading || balanceLoading) && <PopUpLoader />}
      </div>
    </>
  );
};

export default ProfilePage;
