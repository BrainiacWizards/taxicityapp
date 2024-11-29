import React from 'react';
import styles from './loader.module.css';
const PopupLoader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <section className={styles.loader}>
        <div className={styles.dot}></div>
      </section>
    </div>
  );
};

export default PopupLoader;
