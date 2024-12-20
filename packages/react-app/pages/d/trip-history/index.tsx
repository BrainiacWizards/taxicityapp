import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './trip-history.module.css';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import DriverLayout from '@/components/DriverLayout';
import {
  abi,
  contractAddress,
  mainnetAbi,
  mainnetContractAddress,
} from '@/lib/contractConfig';
import PopUpLoader from '@/components/PopupLoader';
import { useAccount } from 'wagmi';
import { Account } from 'viem';

interface iTrip {
  rankName: string;
  registration: string;
  route: string;
  price: string;
  passengers: any[]; //TODO: Replace 'any' with the actual type if known
  date: string;
  tripId: string;
  status: 'completed' | 'ongoing' | 'not started';
}

const updateTripStatus = async (
  tripId: string,
  newStatus: 'completed' | 'ongoing' | 'not started',
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTrips: React.Dispatch<React.SetStateAction<iTrip[]>>,
  account: any
) => {
  try {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ABI = account?.chain?.testnet ? abi : mainnetAbi;
    const CONTRACT_ADDRESS = account?.chain?.testnet
      ? contractAddress
      : mainnetContractAddress;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    await contract.updateTripStatus(tripId, newStatus === 'completed');

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.tripId === tripId ? { ...trip, status: newStatus } : trip
      )
    );
  } catch (error) {
    console.error('Error updating trip status:', error);
  } finally {
    setLoading(false);
  }
};

const TripCard: React.FC<{
  trip: iTrip;
  handleStatusChange: (
    tripId: string,
    newStatus: 'completed' | 'ongoing' | 'not started'
  ) => void;
}> = React.memo(({ trip, handleStatusChange }) => (
  <div className={styles.tripCard}>
    <div className={styles.tripCardHeader}>
      <h3>
        <FaMapMarkerAlt />
        <span>{trip.route.split(' - ')[0]}</span>
      </h3>
      <FaArrowRight />
      <h3>
        <FaMapMarkerAlt />
        <span>{trip.route.split(' - ')[1]}</span>
      </h3>
    </div>
    <div className={styles.tripCardBody}>
      <p>
        Registration: <span>{trip.registration}</span>
      </p>
      <p>
        Passengers: <span>{trip.passengers.length}</span>
      </p>
      <p>
        Date: <span>{trip.date}</span>
      </p>
      <p>
        Price: <span>{trip.price}</span>
      </p>
      <p>
        Trip ID: <span>{trip.tripId}</span>
      </p>
      <p>
        Status:
        <select
          className={styles.statusSelect}
          value={trip.status}
          onChange={(e) =>
            handleStatusChange(
              trip.tripId,
              e.target.value as 'completed' | 'ongoing' | 'not started'
            )
          }
        >
          <option value="not started">Not Started</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </p>
    </div>
  </div>
));

const usePagination = (items: iTrip[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, items, itemsPerPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
};

const UserTripHistoryPage: React.FC = () => {
  const [trips, setTrips] = useState<iTrip[]>([]);
  const [sortCriteria, setSortCriteria] = useState<keyof iTrip>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const account = useAccount();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const ABI = account?.chain?.testnet ? abi : mainnetAbi;
        const CONTRACT_ADDRESS = account?.chain?.testnet
          ? contractAddress
          : mainnetContractAddress;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const tripCount = await contract.tripCounter();

        const tripPromises = Array.from(
          { length: tripCount.toNumber() },
          (_, i) => contract.getTripDetails(i + 1)
        );

        const tripResults = await Promise.all(tripPromises);

        const fetchedTrips: iTrip[] = tripResults.map((trip, index) => {
          const {
            rankName,
            registration,
            route,
            price,
            passengers,
            completed,
          } = trip;
          const date = new Date().toLocaleDateString();
          const status = completed ? 'completed' : 'ongoing';

          return {
            rankName,
            registration,
            route,
            price: `$${price.toString()}`,
            passengers,
            date,
            tripId: (index + 1).toString(),
            status,
          };
        });

        setTrips(fetchedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const sortedTrips: iTrip[] = useMemo(() => {
    return [...trips].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
      } else {
        return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
      }
    });
  }, [trips, sortCriteria, sortDirection]);

  const {
    currentItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  } = usePagination(sortedTrips, 4);

  const handleStatusChange = (
    tripId: string,
    newStatus: 'completed' | 'ongoing' | 'not started'
  ) => {
    updateTripStatus(tripId, newStatus, setLoading, setTrips, account);
  };

  return (
    <DriverLayout>
      <div className={styles.userTripPage}>
        <h1>Trip History</h1>
        <div className={styles.sortOptions}>
          <label>
            Sort by:
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value as keyof iTrip)}
            >
              <option value="rankName">Rank Name</option>
              <option value="registration">Registration</option>
              <option value="route">Route</option>
              <option value="price">Price</option>
              <option value="passengers">Passengers</option>
              <option value="date">Date</option>
              <option value="tripId">Trip ID</option>
              <option value="status">Status</option>
            </select>
          </label>
          <label>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as 'asc' | 'desc')
              }
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </label>
        </div>
        <div className={styles.userTripContent}>
          {currentItems.map((trip, index) => (
            <TripCard
              key={index}
              trip={trip}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <FaAngleDoubleLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        {loading && <PopUpLoader />}
      </div>
    </DriverLayout>
  );
};

export default UserTripHistoryPage;
