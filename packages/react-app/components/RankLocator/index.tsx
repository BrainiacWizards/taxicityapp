'use client';
import styles from './rankLocator.module.css';
import GoogleMap from '../Map';
import React, { useState, useEffect, FormEvent } from 'react';
import { iRank, iRoute, iTaxi, iTaxiData } from '@/models/RankMapModels';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import TaxiDetails from '../TaxiDetails';
import Divider from '../Divider';
import { constructRouteString, findRank, findRoute } from '@/lib/helpers';
import { toast } from 'react-toastify';

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
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
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
        toast.error(
          'Unable to load data. Please refresh the page or try again later.'
        );
      } finally {
        setIsFetching(false);
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
    toast.info('We use your location to help you navigate the map easily.');

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

  useEffect(() => {
    const filtered = taxis.filter((taxi: iTaxi) =>
      filteredRanks.some((rank) => taxi.rankId === rank.rankId)
    );
    setFilteredTaxis(filtered);
  }, [filteredRanks, taxis]);

  const filterRanks = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const selectedProvince = formData.get('province') as string;
    const selectedFromCity = formData.get('fromCity') as string;
    const selectedFromTown = formData.get('fromTown') as string;
    const selectedToCity = formData.get('toCity') as string;
    const selectedToTown = formData.get('toTown') as string;

    console.log(selectedProvince, selectedFromCity, selectedFromTown);

    console.log(ranks);

    const filtered = ranks.filter((rank: iRank) => {
      return (
        (!selectedProvince ||
          rank.province.toLowerCase() === selectedProvince) &&
        (!selectedFromCity || rank.city.toLowerCase() === selectedFromCity) &&
        (!selectedFromTown || rank.town.toLowerCase() === selectedFromTown) &&
        (!selectedToCity ||
          routes.some(
            (route) =>
              route.toCity.toLowerCase() === selectedToCity &&
              route.destinationRankId === rank.rankId
          )) &&
        (!selectedToTown ||
          routes.some(
            (route) =>
              route.toTown.toLowerCase() === selectedToTown &&
              route.destinationRankId === rank.rankId
          ))
      );
    });

    setFilteredRanks(filtered);
  };

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
                  disabled={isFetching}
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
              disabled={isFetching}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setVisibleFields((prev) => Math.max(prev - 1, 1))}
              disabled={isFetching}
            >
              -
            </button>
            <button
              className={styles.searchBtn}
              type="submit"
              disabled={isFetching}
            >
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
              <th>Taxi Reg</th>
              <th>Verified</th>
              <th>Route</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxis.map((taxi: iTaxi) => (
              <tr
                key={taxi.registrationNumber}
                onClick={() => {
                  const taxiData: iTaxiData = {
                    driver: taxi.driverName,
                    rankName: findRank(taxi, ranks)?.rankName,
                    route: constructRouteString(findRoute(taxi, routes), ranks),
                    registration: taxi.registrationNumber,
                    verified: taxi.isVerified,
                    price: (
                      routes.find(
                        (route) => route.routeId === taxi.routeId
                      ) as iRoute
                    ).price,
                    capacity: taxi.capacity,
                  };
                  setCurrentTaxiData(taxiData);
                  setShowTaxiDetails(true);
                }}
                role="button"
                aria-label={`Taxi ${taxi.registrationNumber}`}
              >
                <td>
                  {ranks.find((rank) => rank.rankId === taxi.rankId)?.rankName}
                </td>
                <td>{taxi.registrationNumber}</td>
                <td>
                  {taxi.isVerified ? <MdVerified /> : <FaQuestionCircle />}
                </td>
                <td>{constructRouteString(findRoute(taxi, routes), ranks)}</td>
                <td>R{findRoute(taxi, routes).price}</td>
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
