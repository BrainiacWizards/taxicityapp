import React, { Dispatch } from 'react';
import styles from './taxidetails.module.css';
import Link from 'next/link';
import { iTaxiData } from '@/models/RankMapModels';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const TaxiDetails: React.FC<{
  TaxiData: iTaxiData | undefined;
  showTaxiDetails: Dispatch<React.SetStateAction<boolean>>;
  type?: string;
}> = ({ TaxiData, showTaxiDetails, type = 'popup' }) => {
  if (!TaxiData) return <></>;

  let clsName = '';
  if (type === 'fitted') {
    clsName = 'TaxiDetails';
  } else {
    clsName = 'TaxiDetailsPopUp';
  }

  const storeTripOnLocal = () => {
    sessionStorage.setItem('trip', JSON.stringify(TaxiData));
  };

  const formatDriverName = () => {
    return TaxiData?.driver
      ? TaxiData.driver.length === 42 && TaxiData.driver.startsWith('0x')
        ? `${TaxiData.driver.substring(0, 4)}...${TaxiData.driver.substring(
            TaxiData.driver.length - 4
          )}`
        : TaxiData.driver
      : '';
  };

  return (
    <>
      <div
        className={styles[clsName]}
        role="dialog"
        aria-modal="true"
        aria-labelledby="taxi-details-title"
      >
        <h2 id="taxi-details-title">Taxi Details</h2>

        <div className={styles.TaxiDetailsPopUpInfo}>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Driver:</span>
            <p>{formatDriverName()}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Rank:</span>
            <p>{TaxiData.rankName}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Route:</span>
            <p>{TaxiData.route}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Price:</span>
            <p>R{TaxiData.price.toString().substring(0, 4)}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Capacity:</span>
            <p>{TaxiData.capacity.toString()}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Verified:</span>
            <p>{TaxiData.verified ? <MdVerified /> : <FaQuestionCircle />}</p>
          </div>
          <div className={styles.TaxiDetailsPopUpInfoRow}>
            <span>Registration:</span>
            <p>{TaxiData.registration}</p>
          </div>
        </div>

        {type === 'popup' && (
          <div className={styles.TaxiDetailsPopUpButtons}>
            <button
              onClick={() => {
                showTaxiDetails(false);
              }}
              aria-label="Cancel"
            >
              Cancel
            </button>

            <Link href="/checkout" title="Continue">
              <button aria-label="Continue" onClick={storeTripOnLocal}>
                Continue
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default TaxiDetails;
