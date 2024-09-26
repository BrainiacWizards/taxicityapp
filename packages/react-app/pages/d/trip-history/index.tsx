import React, { useState, useCallback, useMemo } from 'react';
import UserLayout from '@/components/UserLayout/UserLayout';
import styles from './trip-history.module.css';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { iTripCardProps, iTrip } from '@/models/UserModels';

const TripCard: React.FC<iTripCardProps> = React.memo(
  ({ from, to, driver, reg, price, date }) => (
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
          Driver: <span>{driver}</span>
        </p>
        <p>
          Registration: <span>{reg}</span>
        </p>
        <p>
          Price: <span>{price}</span>
        </p>
        <p>
          Date: <span>{date}</span>
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

  const trips = useMemo(
    () => [
      {
        from: 'New York',
        to: 'Boston',
        driver: 'John Doe',
        reg: 'ABC1234',
        price: '$50',
        date: '2023-01-15',
      },
      {
        from: 'San Francisco',
        to: 'Los Angeles',
        driver: 'Jane Smith',
        reg: 'XYZ5678',
        price: '$75',
        date: '2023-02-20',
      },
      {
        from: 'Chicago',
        to: 'Detroit',
        driver: 'Mike Johnson',
        reg: 'LMN9101',
        price: '$40',
        date: '2023-03-10',
      },
      {
        from: 'Houston',
        to: 'Dallas',
        driver: 'Emily Davis',
        reg: 'QRS2345',
        price: '$60',
        date: '2023-04-05',
      },
      {
        from: 'Miami',
        to: 'Orlando',
        driver: 'Chris Brown',
        reg: 'TUV6789',
        price: '$45',
        date: '2023-05-12',
      },
      {
        from: 'Seattle',
        to: 'Portland',
        driver: 'Patricia Wilson',
        reg: 'WXY3456',
        price: '$55',
        date: '2023-06-18',
      },
    ],
    []
  );

  const sortedTrips = useMemo(() => {
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
              <option value="driver">Driver</option>
              <option value="reg">Registration</option>
              <option value="price">Price</option>
              <option value="date">Date</option>
            </select>
          </label>
          <label>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as 'asc' | 'desc')
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
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
