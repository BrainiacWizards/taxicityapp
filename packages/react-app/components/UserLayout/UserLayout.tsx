import React, { ReactNode } from 'react';
import UserSideBar from '../UserSidebar/UserSidebar';
import styles from './userLayout.module.css';

interface iUserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<iUserLayoutProps> = ({ children }) => {
  return (
    <div className={styles.userLayout}>
      <UserSideBar />
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
};

export default UserLayout;
