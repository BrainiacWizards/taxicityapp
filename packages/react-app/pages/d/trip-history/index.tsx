import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './trip-history.module.css';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import DriverLayout from '@/components/DriverLayout/DriverLayout';
import { abi, contractAddress } from '@/lib/contractConfig';

// interface iTripCardProps {
//   rankName: string;
//   registration: string;
//   route: string;
//   price: string;
//   capacity: number;
//   date: string;
//   tripId: string;
//   status: 'completed' | 'ongoing';
// }

interface iTrip {
  rankName: string;
  registration: string;
  route: string;
  price: string;
  capacity: number;
  date: string;
  tripId: string;
  status: 'completed' | 'ongoing';
}

const TripCard: React.FC<{ trip: iTrip }> = React.memo(({ trip }) => (
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
      <p>{/* Capacity: <span>{trip.capacity}</span> */}</p>
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
        Status: <span>{trip.status}</span>
      </p>
    </div>
  </div>

  // <div className={styles.tripCard}>{JSON.stringify(trip)}</div>
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

  useEffect(() => {
    const fetchTrips = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const tripCounter = await contract.tripCounter();
      const tripPromises: Promise<any>[] = [];

      for (let i = 1; i <= tripCounter; i++) {
        tripPromises.push(contract.getTripDetails(i));
      }

      const tripResults = await Promise.all(tripPromises);
      const fetchedTrips: iTrip[] = tripResults.map((trip, index) => {
        const { rankName, registration, route, price, capacity, completed } =
          trip;
        const date = new Date().toISOString().split('T')[0]; // Placeholder for date
        const status = completed ? 'completed' : 'ongoing';

        return {
          rankName,
          registration,
          route,
          price: `$${price.toString()}`,
          capacity,
          date,
          tripId: (index + 1).toString(),
          status,
        };
      });

      setTrips(fetchedTrips);
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
              <option value="capacity">Capacity</option>
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
            <TripCard key={index} trip={trip} />
            // <>{JSON.stringify(trip)}</>
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
      </div>
    </DriverLayout>
  );
};

export default UserTripHistoryPage;
