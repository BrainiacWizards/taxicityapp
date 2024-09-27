import React from 'react';
import DriverLayout from '@/components/DriverLayout/DriverLayout';
import styles from './receipts.module.css';
import Divider from '@/components/Divider/Divider';
import { FaAngleDoubleDown, FaCopy } from 'react-icons/fa';

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
    id: '12345',
    user: 'John Doe',
    date: '2023-10-01',
    amount: 150.0,
    from: 'Location A',
    to: 'Location B',
    regNumber: 'XYZ 1234',
  },
  {
    id: '12346',
    user: 'Jane Smith',
    date: '2023-10-02',
    amount: 200.0,
    from: 'Location C',
    to: 'Location D',
    regNumber: 'ABC 5678',
  },
  {
    id: '12347',
    user: 'Alice Johnson',
    date: '2023-10-03',
    amount: 175.5,
    from: 'Location E',
    to: 'Location F',
    regNumber: 'DEF 9012',
  },
  {
    id: '12348',
    user: 'Bob Brown',
    date: '2023-10-04',
    amount: 220.75,
    from: 'Location G',
    to: 'Location H',
    regNumber: 'GHI 3456',
  },
  {
    id: '12349',
    user: 'Charlie Davis',
    date: '2023-10-05',
    amount: 180.25,
    from: 'Location I',
    to: 'Location J',
    regNumber: 'JKL 7890',
  },
];

const ReceiptComponent: React.FC<{ receipt: Receipt }> = ({ receipt }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(receipt));
    alert('Receipt copied to clipboard');
  };

  return (
    <div key={receipt.id} className={styles.receipt}>
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
          <FaCopy />
        </button>
        <h2>Total: </h2>
        <h2>${receipt.amount.toFixed(2)}</h2>
      </div>
      <button className={styles.extendButton}>
        <FaAngleDoubleDown />
      </button>
    </div>
  );
};

const ReceiptsPage: React.FC = () => {
  return (
    <DriverLayout>
      <div className={styles.receipts}>
        {receipts.map((receipt: Receipt) => (
          <ReceiptComponent receipt={receipt} />
        ))}
      </div>
    </DriverLayout>
  );
};

export default ReceiptsPage;
