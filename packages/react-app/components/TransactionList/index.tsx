import React, { useState, useEffect } from 'react';
import styles from './transaction-list.module.css';
import { iTransaction, iTransactionListProps } from '@/models/UserModels';

import {
  FaHashtag,
  FaArrowRight,
  FaArrowLeft,
  FaCalendarAlt,
  FaDollarSign,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaClipboard,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

const TransactionList: React.FC<iTransactionListProps> = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [copyStatus, setCopyStatus] = useState<{
    [key: string]: 'success' | 'error' | 'idle';
  }>({});
  const [transactionsPerPage, setTransactionsPerPage] = useState(4);
  const [onMobile, setOnMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 800 : false
  );

  useEffect(() => {
    console.log('initial ', onMobile);

    const updateTransactionsPerPage = () => {
      setOnMobile(window.innerWidth < 800);
    };

    updateTransactionsPerPage();
    window.addEventListener('resize', updateTransactionsPerPage);

    return () => {
      window.removeEventListener('resize', updateTransactionsPerPage);
    };
  }, []);

  useEffect(() => {
    console.log('setTransaction', onMobile);
    setTransactionsPerPage(onMobile ? 4 : 8);
  }, [onMobile]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    if (sortCriteria === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortCriteria === 'hash') {
      comparison = a.hash.localeCompare(b.hash);
    } else if (sortCriteria === 'to') {
      comparison = a.to.localeCompare(b.to);
    } else if (sortCriteria === 'amount') {
      comparison = a.amount - b.amount;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const formatTransactionForClipboard = (transaction: iTransaction) => {
    return `Hash: ${transaction.hash}\nFrom: ${transaction.from}\nTo: ${transaction.to}\nDate: ${transaction.date}\nAmount: ${transaction.amount}`;
  };

  const handleCopyToClipboard = (transaction: iTransaction) => {
    const formattedTransaction = formatTransactionForClipboard(transaction);
    navigator.clipboard
      .writeText(formattedTransaction)
      .then(() => {
        setCopyStatus((prevStatus) => ({
          ...prevStatus,
          [transaction.hash]: 'success',
        }));
        setTimeout(() => {
          setCopyStatus((prevStatus) => ({
            ...prevStatus,
            [transaction.hash]: 'idle',
          }));
        }, 2000);
      })
      .catch(() => {
        setCopyStatus((prevStatus) => ({
          ...prevStatus,
          [transaction.hash]: 'error',
        }));
        setTimeout(() => {
          setCopyStatus((prevStatus) => ({
            ...prevStatus,
            [transaction.hash]: 'idle',
          }));
        }, 2000);
      });
  };

  return (
    <div>
      <div className={styles.sortOptions}>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="hash">Hash</option>
          <option value="to">To</option>
          <option value="amount">Amount</option>
        </select>
        <label htmlFor="order"></label>
        <select id="order" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className={styles.transactionList}>
        {currentTransactions.map((transaction: iTransaction) => (
          <li key={transaction.hash}>
            <span>
              <FaHashtag /> Hash: {transaction.hash}
            </span>
            <span>
              <FaArrowLeft /> From: {transaction.from}
            </span>
            <span>
              <FaArrowRight /> To: {transaction.to}
            </span>
            <span>
              <FaCalendarAlt /> Date: {transaction.date}
            </span>
            <span>
              <FaDollarSign /> Amount: {transaction.amount}
            </span>
            <button onClick={() => handleCopyToClipboard(transaction)}>
              {copyStatus[transaction.hash] === 'success' ? (
                <>
                  {' '}
                  <FaCheck /> {'Copied!'}{' '}
                </>
              ) : copyStatus[transaction.hash] === 'error' ? (
                <>
                  <FaTimes /> {'Error!'}
                </>
              ) : (
                <>
                  <FaClipboard /> {'Copy to clipboard'}
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          <FaAngleDoubleLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
