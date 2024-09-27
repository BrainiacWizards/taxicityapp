import React, { ReactNode } from 'react';
import DriverSidebar from '../DriverSidebar/DriverSidebar';
import styles from './drive-layout.module.css';

interface DriverLayoutProps {
  children: ReactNode;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children }) => {
  return (
    <div className={styles.driverLayout}>
      <DriverSidebar />
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
};

export default DriverLayout;
