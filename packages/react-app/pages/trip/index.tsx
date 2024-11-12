import TaxiDetails from '@/components/TaxiDetails';
import { iTaxiData } from '@/models/RankMapModels';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUser, FaRoute } from 'react-icons/fa';
import { ethers } from 'ethers';
import styles from './trip.module.css';
import { abi, contractAddress } from '@/lib/contractConfig';

const dummyTaxiData: iTaxiData = {
  tripCode: 0,
  capacity: 0,
  driver: 'NA',
  price: 70,
  rankName: 'NA',
  registration: 'NA',
  route: 'NA',
  verified: false,
};

const TripPage: React.FC = () => {
  const [taxiData, setTaxiData] = useState<iTaxiData>(dummyTaxiData);
  const [passengers, setPassengers] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [tripStatus, setTripStatus] = useState<string>('not started');

  useEffect(() => {
    const fetchTripData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tripCode = taxiData.tripCode;
      const tripDetails = await contract.getTripDetails(tripCode);

      if (!tripDetails) {
        alert('Trip not found');
        return;
      }

      const {
        tripCode: code,
        rankName,
        registration,
        verified,
        route,
        price,
        capacity,
        driver,
        passengers,
        completed,
      } = tripDetails;

      setTaxiData({
        tripCode: code,
        rankName,
        registration,
        verified,
        route,
        price: price.toString(),
        capacity: capacity.toString(),
        driver,
      });

      setPassengers(
        passengers.map((address: string) => `Passenger: ${address}`)
      );
      setTripStatus(completed ? 'completed' : 'in progress');
    };

    // read taxiData from sessionStorage
    const taxiData: iTaxiData =
      typeof window !== 'undefined' && sessionStorage.getItem('trip')
        ? JSON.parse(sessionStorage.getItem('trip') || '')
        : dummyTaxiData;

    setTaxiData(taxiData);
    fetchTripData();
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
      <div className={styles.details}>
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
