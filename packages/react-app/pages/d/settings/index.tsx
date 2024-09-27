import React, { useEffect, useState, useCallback } from 'react';
import { Config, useChains } from 'wagmi';
import { clearStorage } from '@/lib/storage';
import { Chain } from 'viem';
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { getAccount } from '@wagmi/core';
import styles from './settings.module.css';
import { config } from '@/lib/config';
import Image from 'next/image';
import DriverLayout from '@/components/DriverLayout/DriverLayout';

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [chain, setChain] = useState<Chain | null>(null);
  const [storageSize, setStorageSize] = useState(0);
  const [storageClear, setStorageClear] = useState(false);
  const chains = useChains();
  const account = getAccount(config as Config);
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();

  const calculateStorageSize = useCallback(() => {
    const getSize = (storage: Storage) =>
      Array.from({ length: storage.length }).reduce(
        (total: number, _, i: number) => {
          const key = storage.key(i);
          const value = key ? storage.getItem(key) : null;
          return total + (key?.length || 0) + (value?.length || 0);
        },
        0
      );

    return getSize(localStorage) + getSize(sessionStorage);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStorageSize(calculateStorageSize());
    }
  }, [storageClear, calculateStorageSize]);

  useEffect(() => {
    setChain(account?.chain || chains[0]);
  }, [chains, account]);

  const handleClearStorage = () => {
    if (
      confirm(
        'Are you sure you want to clear all cookies and cache? This might cause some issues on the app.'
      )
    ) {
      clearStorage();
      setStorageClear((prev) => !prev);
    }
  };

  return (
    <DriverLayout>
      <div className={styles.userSettings}>
        <div className={styles.userSetting}>
          <h2 className={styles.settingHeading}>App Configs</h2>
          <div className={styles.userSettingBlock}>
            <label>
              App Theme:
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </div>
        <div className={styles.userSetting}>
          <h2 className={styles.settingHeading}>Network Information</h2>
          <div className={styles.userSettingBlock}>
            <p>Current Network: {chain?.name}</p>
            <p>Chain ID: {chain?.id}</p>
            <p>Currency: {chain?.nativeCurrency.symbol}</p>
            <p>
              Network Type:{' '}
              {chain?.testnet ? 'You are on Testnet' : 'You are on Mainnet'}
            </p>
            <p>RPC URLs: {chain?.rpcUrls?.default?.http?.join(', ')}</p>
            {account.connector && (
              <>
                <p>
                  Wallet Name:
                  {account.connector.icon && (
                    <Image
                      src={account.connector.icon}
                      alt={`${account.connector.name} icon`}
                      width={20}
                      height={20}
                    />
                  )}{' '}
                  {account.connector.name}
                </p>
                <p>Wallet Type: {account.connector.type}</p>
              </>
            )}
            <div className={styles.settingActions}>
              {account.isConnected ? (
                <>
                  <button
                    className={styles.settingBtn}
                    onClick={openChainModal}
                  >
                    Switch Network
                  </button>
                  <button
                    className={styles.settingBtn}
                    onClick={openAccountModal}
                  >
                    Disconnect Wallet
                  </button>
                </>
              ) : (
                <button
                  className={styles.settingBtn}
                  onClick={openConnectModal}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.userSetting}>
          <h2 className={styles.settingHeading}>Cache Storage</h2>
          <div className={styles.userSettingBlock}>
            <p>Storage Size: {storageSize} bytes</p>
            <div className={styles.settingActions}>
              <button
                className={styles.settingBtn}
                onClick={handleClearStorage}
              >
                Clear Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
};

export default SettingsPage;
