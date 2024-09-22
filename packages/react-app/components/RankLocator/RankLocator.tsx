'use client';
import { ranks, taxis } from '@/lib/data';
import styles from './rankLocator.module.css';
import GoogleMap from '../Map/Map';
import React, { useState, useEffect } from 'react';
import { iRank, iRoute, iTaxi, iTaxiData } from '@/models/RankMapModels';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import TaxiDetails from '../TaxiDetails/TaxiDetails';
import Divider from '../Divider/Divider';

const RankLocator: React.FC = () => {
  const [filteredRanks, setFilteredRanks] = useState<iRank[]>([]);
  const [filteredTaxis, setFilteredTaxis] = useState<iTaxi[]>([]);
  const [showTaxiDetails, setShowTaxiDetails] = useState<boolean>(false);
  const [currentTaxiData, setCurrentTaxiData] = useState<iTaxiData | undefined>(
    undefined
  );
  const [visibleFields, setVisibleFields] = useState<number>(1);

  const provinces = Array.from(
    new Set(ranks.map((rank: iRank) => rank.province))
  );
  const cities = Array.from(new Set(ranks.map((rank: iRank) => rank.city)));
  const towns = Array.from(new Set(ranks.map((rank: iRank) => rank.town)));
  const toTowns = Array.from(
    new Set(
      ranks
        .map((rank: iRank) => rank.routes.map((route) => route.toTown))
        .flat()
    )
  );
  const toCities = Array.from(
    new Set(
      ranks
        .map((rank: iRank) => rank.routes.map((route) => route.toCity))
        .flat()
    )
  );

  // get filteredTaxi data
  const getFilteredTaxiData = React.useMemo(() => {
    const rankMap = ranks.reduce((map: { [key: number]: iRank }, rank) => {
      map[rank.id] = rank;
      return map;
    }, {} as { [key: number]: iRank });

    return (filteredTaxis: iTaxi[]) =>
      filteredTaxis.map((taxi: iTaxi) => {
        const route: iRoute | undefined = rankMap[taxi.rankId]?.routes.find(
          (route) => route.routeId === taxi.routeId
        );
        const fromTown = route ? rankMap[taxi.rankId]?.town : 'N/A';

        return {
          rankName: rankMap[taxi.rankId]?.name,
          registration: taxi.registration,
          verified: taxi.verified,
          route: route ? `${fromTown} - ${route.toTown}` : 'N/A',
          price: route ? route.price : 'N/A',
          capacity: taxi.capacity,
          driver: taxi.driver,
        };
      });
  }, [ranks]);

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
        (!province || rank.province.toLowerCase() == province) &&
        (!fromCity || rank.city.toLowerCase() == fromCity) &&
        (!fromTown || rank.town.toLowerCase() == fromTown) &&
        (!toCity ||
          rank.routes.some((route) => route.toCity.toLowerCase() == toCity)) &&
        (!toTown ||
          rank.routes.some((route) => route.toTown.toLowerCase() === toTown))
    );

    setFilteredRanks(filtered);
  };

  useEffect(() => {
    const filtered = taxis.filter((taxi: iTaxi) =>
      filteredRanks.some((rank) => taxi.rankId === rank.id)
    );
    setFilteredTaxis(filtered);
  }, [filteredRanks]);

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
