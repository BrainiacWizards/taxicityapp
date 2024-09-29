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

interface iTripCardProps {
  from: string;
  to: string;
  passengers: number;
  date: string;
  totalEarned: string;
  tripId: string;
  status: 'completed' | 'cancelled' | 'ongoing';
}

interface iTrip {
  from: string;
  to: string;
  passengers: number;
  date: string;
  totalEarned: string;
  tripId: string;
  status: 'completed' | 'cancelled' | 'ongoing';
}

const TripCard: React.FC<iTripCardProps> = React.memo(
  ({ from, to, passengers, date, totalEarned, tripId, status }) => (
    <div className={styles.tripCard}>
      <div className={styles.tripCardHeader}>
        <h3>
          <FaMapMarkerAlt />
          <span>{from}</span>
        </h3>
        <FaArrowRight />
        <h3>
          <FaMapMarkerAlt />
          <span>{to}</span>
        </h3>
      </div>
      <div className={styles.tripCardBody}>
        <p>
          Passengers: <span>{passengers}</span>
        </p>
        <p>
          Date: <span>{date}</span>
        </p>
        <p>
          Total Earned: <span>{totalEarned}</span>
        </p>
        <p>
          Trip ID: <span>{tripId}</span>
        </p>
        <p>
          Status: <span>{status}</span>
        </p>
      </div>
    </div>
  )
);

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
        const [, fare, details, completed, , passengers] = trip;
        const [from, to] = details
          ?.split(',')[0]
          ?.split(':')
          ?.map((s) => s.trim())[1]
          ?.split(' - ') || ['Unknown', 'Unknown'];
        const date = new Date().toISOString().split('T')[0]; // Placeholder for date
        const totalEarned = `$${fare.toString()}`;
        const status = completed ? 'completed' : 'ongoing';

        return {
          from,
          to,
          passengers: passengers.length,
          date,
          totalEarned,
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
              <option value="from">From</option>
              <option value="to">To</option>
              <option value="passengers">Passengers</option>
              <option value="date">Date</option>
              <option value="totalEarned">Total Earned</option>
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
            <TripCard key={index} {...trip} />
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
