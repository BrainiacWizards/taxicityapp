import React from 'react';
import styles from './loader.module.css';
const PopupLoader: React.FC = () => {
  return (
    <>
      <section className={styles.loader}>
        <div className={styles.dot}></div>
      </section>
    </>
  );
};

export default PopupLoader;
