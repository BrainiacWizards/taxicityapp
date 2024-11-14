import React from 'react';

import TransactionList from '@/components/TransactionList';
import { iTransaction } from '@/models/UserModels';
import UserLayout from '@/components/UserLayout';
import styles from './transactions.module.css';

const UserTransactionPage: React.FC = () => {
  const transactions: iTransaction[] = [
    {
      hash: '0x1234',
      from: '0x1234',
      to: '0x5678',
      date: '2021-01-01',
      amount: 100,
    },
    {
      hash: '0x5678',
      from: '0x5678',
      to: '0x1234',
      date: '2021-01-02',
      amount: 200,
    },
    {
      hash: '0x9101',
      from: '0x9101',
      to: '0x1121',
      date: '2021-01-03',
      amount: 300,
    },
    {
      hash: '0x1121',
      from: '0x1121',
      to: '0x9101',
      date: '2021-01-04',
      amount: 400,
    },
    {
      hash: '0x3141',
      from: '0x3141',
      to: '0x5161',
      date: '2021-01-05',
      amount: 500,
    },
    {
      hash: '0x5161',
      from: '0x5161',
      to: '0x3141',
      date: '2021-01-06',
      amount: 600,
    },
  ];

  return (
    <UserLayout>
      <div className={styles.userTransactions}>
        <h1>Transactions</h1>
        <TransactionList transactions={transactions} />
      </div>
    </UserLayout>
  );
};

export default UserTransactionPage;
