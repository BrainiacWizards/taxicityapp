import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './loader.module.css';

const Loader: React.FC = () => {
  return (
    <>
      <div className={styles.loaderContainer}>
        <Skeleton height={300} width={'100%'} />
        <Skeleton height={80} width={'100%'} />
        <Skeleton height={80} width={'100%'} />
        <Skeleton height={80} width={'100%'} />
        <Skeleton height={80} width={'100%'} />
      </div>
    </>
  );
};

export default Loader;
