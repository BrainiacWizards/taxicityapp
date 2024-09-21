import React, { Dispatch } from 'react';
import styles from './taxidetails.module.css';
import Link from 'next/link';
import { iTaxiData } from '@/models/RankMapModels';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const TaxiDetails: React.FC<{
	TaxiData: iTaxiData | undefined;
	showTaxiDetails: Dispatch<React.SetStateAction<boolean>>;
}> = ({ TaxiData, showTaxiDetails }) => {
	// component popup with taxi information
	// should show taxi information, route info, price, rank, time, and payment options
	// should include a button to start continue to trip page, where the user will be able to scan
	// a QR code to pay and checking for the trip
	// should include a button to cancel the trip, thus cancelling the taxi booking and closing the popup

	if (!TaxiData) return <></>;

	return (
		<>
			<div
				className={styles.TaxiDetailsPopUp}
				role='dialog'
				aria-modal='true'
				aria-labelledby='taxi-details-title'>
				<h2 id='taxi-details-title'>Taxi Details</h2>

				<div className={styles.TaxiDetailsPopUpInfo}>
					<div className={styles.TaxiDetailsPopUpInfoRow}>
						<span>Driver:</span>
						<p>{TaxiData?.driver}</p>
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
						<p>R{TaxiData.price}</p>
					</div>
					<div className={styles.TaxiDetailsPopUpInfoRow}>
						<span>Capacity:</span>
						<p>{TaxiData.capacity}</p>
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

				<div className={styles.TaxiDetailsPopUpButtons}>
					<button
						onClick={() => {
							showTaxiDetails(false);
						}}
						aria-label='Cancel'>
						Cancel
					</button>

					<Link href='/' title='Continue'>
						<button aria-label='Continue'>Continue</button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default TaxiDetails;
