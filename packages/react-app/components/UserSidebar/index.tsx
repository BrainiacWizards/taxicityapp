import React from 'react';
import styles from './userSidebar.module.css';
import Link from 'next/link';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCog,
  FaHistory,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaTachometerAlt,
} from 'react-icons/fa';

const UserSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={
        styles.userSidebar + ' ' + (isOpen ? styles.open : styles.closed)
      }
      onFocus={openSidebar}
      onBlur={closeSidebar}
      onFocusCapture={openSidebar}
    >
      <button className={styles.openSidebarBtn}>
        {isOpen ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>
      <ul
        onFocus={openSidebar}
        onBlur={closeSidebar}
        onFocusCapture={openSidebar}
      >
        <li>
          <Link href="./profile">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="./transactions">
            <FaMoneyCheckAlt /> View Transactions
          </Link>
        </li>
        <li>
          <Link href="./trip-history">
            <FaHistory /> Trip History
          </Link>
        </li>
        <li>
          <Link href="./settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li>
          <Link href="./logout">
            <FaSignOutAlt /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSideBar;
