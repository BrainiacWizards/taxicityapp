import React, { useState, memo, useCallback } from 'react';
import DriverLayout from '@/components/DriverLayout/DriverLayout';
import styles from './receipts.module.css';
import Divider from '@/components/Divider/Divider';
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaCopy,
  FaCheck,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
} from 'react-icons/fa';

interface Receipt {
  id: string;
  user: string;
  date: string;
  amount: number;
  from: string;
  to: string;
  regNumber: string;
}

const receipts: Receipt[] = [
  {
    id: '1',
    user: 'John Doe',
    date: '2023-01-01',
    amount: 100.0,
    from: 'Location A',
    to: 'Location B',
    regNumber: 'ABC123',
  },
  {
    id: '2',
    user: 'Jane Smith',
    date: '2023-01-02',
    amount: 150.0,
    from: 'Location C',
    to: 'Location D',
    regNumber: 'DEF456',
  },
  {
    id: '3',
    user: 'Alice Johnson',
    date: '2023-01-03',
    amount: 200.0,
    from: 'Location E',
    to: 'Location F',
    regNumber: 'GHI789',
  },
  {
    id: '4',
    user: 'Bob Brown',
    date: '2023-01-04',
    amount: 250.0,
    from: 'Location G',
    to: 'Location H',
    regNumber: 'JKL012',
  },
  {
    id: '5',
    user: 'Charlie Davis',
    date: '2023-01-05',
    amount: 300.0,
    from: 'Location I',
    to: 'Location J',
    regNumber: 'MNO345',
  },
  {
    id: '6',
    user: 'Diana Evans',
    date: '2023-01-06',
    amount: 350.0,
    from: 'Location K',
    to: 'Location L',
    regNumber: 'PQR678',
  },
  {
    id: '7',
    user: 'Ethan Harris',
    date: '2023-01-07',
    amount: 400.0,
    from: 'Location M',
    to: 'Location N',
    regNumber: 'STU901',
  },
  {
    id: '8',
    user: 'Fiona Green',
    date: '2023-01-08',
    amount: 450.0,
    from: 'Location O',
    to: 'Location P',
    regNumber: 'VWX234',
  },
];

const COPY_TIMEOUT = 1000;
const RECEIPTS_PER_PAGE = 5;

const ReceiptComponent: React.FC<{ receipt: Receipt }> = memo(({ receipt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(receipt));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, COPY_TIMEOUT);
  }, [receipt]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={`${styles.receipt} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
    >
      <div className={styles.receiptHeader}>
        <h1>{receipt.date}</h1>
        <h1>#{receipt.id}</h1>
      </div>
      <Divider variant="thin-tertiary-large" />
      <div className={styles.receiptBody}>
        <table className={styles.receiptTable}>
          <tbody>
            <tr>
              <td>User:</td>
              <td>{receipt.user}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{receipt.date}</td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>${receipt.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>From:</td>
              <td>{receipt.from}</td>
            </tr>
            <tr>
              <td>To:</td>
              <td>{receipt.to}</td>
            </tr>
            <tr>
              <td>Reg Number:</td>
              <td>{receipt.regNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Divider variant="thin-tertiary-medium" />
      <div className={styles.receiptFooter}>
        <button onClick={handleCopy}>
          {isCopied ? <FaCheck /> : <FaCopy />}
        </button>
        <h2>Total: </h2>
        <h2>${receipt.amount.toFixed(2)}</h2>
      </div>
      <button className={styles.extendButton} onClick={toggleExpand}>
        {isExpanded ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
      </button>
    </div>
  );
});

const ReceiptsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(receipts.length / RECEIPTS_PER_PAGE);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * RECEIPTS_PER_PAGE;
  const currentReceipts = receipts.slice(
    startIndex,
    startIndex + RECEIPTS_PER_PAGE
  );

  return (
    <DriverLayout>
      <div className={styles.receipts}>
        {currentReceipts.map((receipt: Receipt) => (
          <ReceiptComponent key={receipt.id} receipt={receipt} />
        ))}
      </div>
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
    </DriverLayout>
  );
};

export default ReceiptsPage;
