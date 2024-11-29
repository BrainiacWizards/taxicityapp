'use client';
import styles from './rankLocator.module.css';
import GoogleMap from '../Map';
import React, { useState, useEffect } from 'react';
import { iRank, iRoute, iTaxi, iTaxiData } from '@/models/RankMapModels';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import TaxiDetails from '../TaxiDetails';
import Divider from '../Divider';

const RankLocator: React.FC = () => {
  const [ranks, setRanks] = useState<iRank[]>([]);
  const [taxis, setTaxis] = useState<iTaxi[]>([]);
  const [routes, setRoutes] = useState<iRoute[]>([]);
  const [filteredRanks, setFilteredRanks] = useState<iRank[]>([]);
  const [filteredTaxis, setFilteredTaxis] = useState<iTaxi[]>([]);
  const [showTaxiDetails, setShowTaxiDetails] = useState<boolean>(false);
  const [currentTaxiData, setCurrentTaxiData] = useState<iTaxiData | undefined>(
    undefined
  );
  const [visibleFields, setVisibleFields] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.brainiacwiz.com/api/taxicity/data'
        );
        const data = await response.json();
        setRanks(data.data.ranks);
        setTaxis(data.data.taxis);
        setRoutes(data.data.routes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateVisibleFields = () => {
      if (window.innerWidth < 600) {
        setVisibleFields(1);
      } else {
        setVisibleFields(3);
      }
    };

    updateVisibleFields();
    window.addEventListener('resize', updateVisibleFields);

    return () => {
      window.removeEventListener('resize', updateVisibleFields);
    };
  }, []);

  const provinces = Array.from(
    new Set(ranks.map((rank: iRank) => rank.province))
  );
  const cities = Array.from(new Set(ranks.map((rank: iRank) => rank.city)));
  const towns = Array.from(new Set(ranks.map((rank: iRank) => rank.town)));
  const toTowns = Array.from(
    new Set(routes.map((route: iRoute) => route.toTown))
  );
  const toCities = Array.from(
    new Set(routes.map((route: iRoute) => route.toCity))
  );

  // get filteredTaxi data
  const getFilteredTaxiData = React.useMemo(() => {
    const rankMap = ranks.reduce((map: { [key: number]: iRank }, rank) => {
      map[rank.rankId] = rank;
      return map;
    }, {} as { [key: number]: iRank });

    return (filteredTaxis: iTaxi[]) =>
      filteredTaxis.map((taxi: iTaxi) => {
        const route: iRoute | undefined = routes.find(
          (route) => route.routeId === taxi.routeId
        );
        const fromTown = route ? rankMap[taxi.rankId]?.town : 'N/A';

        return {
          rankName: rankMap[taxi.rankId]?.rankName,
          registration: taxi.registrationNumber,
          verified: taxi.isVerified ? true : false,
          route: route ? `${fromTown} - ${route.toTown}` : 'N/A',
          price: route ? route.price : 'N/A',
          capacity: taxi.capacity,
          driver: taxi.driverName,
        };
      });
  }, [ranks, routes]);

  const filterRanks = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const province = form.province?.value.trim().toLowerCase();
    const fromCity = form.fromCity?.value.trim().toLowerCase();
    const fromTown = form.fromTown?.value.trim().toLowerCase();
    const toCity = form.toCity?.value.trim().toLowerCase();
    const toTown = form.toTown?.value.trim().toLowerCase();

    const filtered = ranks.filter(
      (rank) =>
        (!province || rank.province.toLowerCase() === province) &&
        (!fromCity || rank.city.toLowerCase() === fromCity) &&
        (!fromTown || rank.town.toLowerCase() === fromTown) &&
        (!toCity ||
          routes.some(
            (route) =>
              route.toCity.toLowerCase() === toCity &&
              route.fromRankId === rank.rankId
          )) &&
        (!toTown ||
          routes.some(
            (route) =>
              route.toTown.toLowerCase() === toTown &&
              route.fromRankId === rank.rankId
          ))
    );

    setFilteredRanks(filtered);
  };

  useEffect(() => {
    const filtered = taxis.filter((taxi: iTaxi) =>
      filteredRanks.some((rank) => taxi.rankId === rank.rankId)
    );
    setFilteredTaxis(filtered);
  }, [filteredRanks, taxis]);

  const filteredTaxiData = getFilteredTaxiData(filteredTaxis);

  return (
    <>
      <div className={styles.rankLocator}>
        <form onSubmit={filterRanks} className={styles.rankLocatorForm}>
          {['province', 'fromCity', 'fromTown', 'toCity', 'toTown']
            .slice(0, visibleFields)
            .map((field: string) => (
              <div key={field} className={styles.formGroup}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className={styles.select}
                  list={`list_${field}`}
                  name={field}
                  id={field}
                  placeholder={
                    'select' + field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  aria-label={`Select ${field}`}
                />
                <datalist id={`list_${field}`}>
                  {(field === 'province'
                    ? provinces
                    : field === 'fromCity'
                    ? cities
                    : field === 'toCity'
                    ? toCities
                    : field === 'toTown'
                    ? toTowns
                    : towns
                  ).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </datalist>
              </div>
            ))}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setVisibleFields((prev) => Math.min(prev + 1, 5))}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setVisibleFields((prev) => Math.max(prev - 1, 1))}
            >
              -
            </button>
            <button className={styles.searchBtn} type="submit">
              Search
            </button>
          </div>
        </form>

        <div
          className={styles.rankLocatorMap}
          role="region"
          aria-label="Rank Locator Map"
        >
          <GoogleMap locations={filteredRanks} />
        </div>
      </div>

      <Divider />

      <div className={styles.availableTaxis}>
        <h2>Available Taxis</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Taxi Registration</th>
              <th>Verified</th>
              <th>Route</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxiData.map((taxiData: iTaxiData) => (
              <tr
                key={taxiData.registration}
                onClick={() => {
                  setCurrentTaxiData(taxiData);
                  setShowTaxiDetails(true);
                }}
                role="button"
                aria-label={`Taxi ${taxiData.registration}`}
              >
                <td>{taxiData.rankName}</td>
                <td>{taxiData.registration}</td>
                <td>
                  {taxiData.verified ? <MdVerified /> : <FaQuestionCircle />}
                </td>
                <td>{taxiData.route}</td>
                <td>R{taxiData.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTaxiDetails && (
        <TaxiDetails
          TaxiData={currentTaxiData}
          showTaxiDetails={setShowTaxiDetails}
        />
      )}
    </>
  );
};
export default RankLocator;
