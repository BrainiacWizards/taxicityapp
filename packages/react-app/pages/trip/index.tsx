import TaxiDetails from '@/components/TaxiDetails';
import { iTaxiData } from '@/models/RankMapModels';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUser, FaRoute } from 'react-icons/fa';
import { ethers } from 'ethers';
import styles from './trip.module.css';
import {
  abi,
  contractAddress,
  mainnetAbi,
  mainnetContractAddress,
} from '@/lib/contractConfig';
import { useAccount } from 'wagmi';

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
  const account = useAccount();

  useEffect(() => {
    const fetchTripData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const ABI = account?.chain?.testnet ? abi : mainnetAbi;
      const CONTRACT_ADDRESS = account?.chain?.testnet
        ? contractAddress
        : mainnetContractAddress;
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

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
          <h2>
            <FaUser /> Passengers
          </h2>
          <p>Passenger Count: {passengers.length}</p>
        </div>
        <div className={styles.tripStatusSection}>
          <h2>
            <FaRoute /> Trip Status
          </h2>
          <p>{tripStatus}</p>
        </div>
      </div>
      <div className={styles.ratingSection}>
        <h2>Rate Driver</h2>
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
