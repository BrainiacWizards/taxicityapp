import React, { useState, useCallback, useMemo } from 'react';
import UserLayout from '@/components/UserLayout/UserLayout';
import styles from './trip-history.module.css';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';

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
  const [sortCriteria, setSortCriteria] = useState<keyof iTrip>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const trips: iTrip[] = useMemo(
    () => [
      {
        from: 'New York',
        to: 'Boston',
        passengers: 3,
        date: '2023-01-15',
        totalEarned: '$150',
        tripId: 'TRIP1234',
        status: 'completed',
      },
      {
        from: 'San Francisco',
        to: 'Los Angeles',
        passengers: 2,
        date: '2023-02-20',
        totalEarned: '$100',
        tripId: 'TRIP5678',
        status: 'completed',
      },
      {
        from: 'Chicago',
        to: 'Detroit',
        passengers: 4,
        date: '2023-03-10',
        totalEarned: '$160',
        tripId: 'TRIP9101',
        status: 'cancelled',
      },
      {
        from: 'Houston',
        to: 'Dallas',
        passengers: 1,
        date: '2023-04-05',
        totalEarned: '$60',
        tripId: 'TRIP2345',
        status: 'ongoing',
      },
      {
        from: 'Miami',
        to: 'Orlando',
        passengers: 5,
        date: '2023-05-12',
        totalEarned: '$225',
        tripId: 'TRIP6789',
        status: 'completed',
      },
      {
        from: 'Seattle',
        to: 'Portland',
        passengers: 3,
        date: '2023-06-18',
        totalEarned: '$165',
        tripId: 'TRIP3456',
        status: 'completed',
      },
    ],
    []
  );

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
    <UserLayout>
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
    </UserLayout>
  );
};

export default UserTripHistoryPage;
