import TaxiDetails from '@/components/TaxiDetails/TaxiDetails';
import { iTaxiData } from '@/models/RankMapModels';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUser, FaRoute } from 'react-icons/fa';
import styles from './trip.module.css';

const dummyTaxiData: iTaxiData = {
  capacity: 0,
  driver: 'NA',
  price: 70,
  rankName: 'NA',
  registration: 'NA',
  route: 'NA',
  verified: false,
};

const dummyPassengers = ['Passenger 1', 'Passenger 2', 'Passenger 3'];

const TripPage: React.FC = () => {
  const [taxiData, setTaxiData] = useState<iTaxiData>(dummyTaxiData);
  const [passengers, setPassengers] = useState<string[]>(dummyPassengers);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [tripStatus, setTripStatus] = useState<string>('not started');

  useEffect(() => {
    const tripData = sessionStorage.getItem('trip');
    if (tripData) {
      setTaxiData(JSON.parse(tripData));
    }

    setPassengers(dummyPassengers);
  }, []);

  const handleRateDriver = () => {
    // Implement rate driver logic here
    alert(`Rated driver with ${rating} stars`);
  };

  return (
    <div className={styles.tripPage}>
      <TaxiDetails
        TaxiData={taxiData}
        type="fitted"
        showTaxiDetails={() => {}}
      />
      <div className={styles.passengersSection}>
        <h3>
          <FaUser /> Passengers
        </h3>
        <p>Passenger Count: {passengers.length}</p>
      </div>
      <div className={styles.tripStatusSection}>
        <h3>
          <FaRoute /> Trip Status
        </h3>
        <p>{tripStatus}</p>
      </div>
      <div className={styles.ratingSection}>
        <h3>
          <FaStar /> Rate Driver
        </h3>
        <div className={styles.stars}>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  style={{ display: 'none' }}
                />
                <FaStar
                  size={30}
                  color={
                    ratingValue <= (hover || rating)
                      ? '#ffc107'
                      : 'var(--prim-color)'
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                />
              </label>
            );
          })}
        </div>
        <button
          className={styles.submitRatingButton}
          onClick={handleRateDriver}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default TripPage;
