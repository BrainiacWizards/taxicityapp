import React, { useState, useMemo } from 'react';
import { ethers } from 'ethers';
import styles from './create-trip.module.css';
import { abi, contractAddress } from '@/lib/contractConfig';
import { taxis, ranks } from '@/lib/data';
import { iRank, iRoute, iTaxi, iTaxiData } from '@/models/RankMapModels';
import TaxiDetails from '@/components/TaxiDetails/TaxiDetails';
import DriverLayout from '@/components/DriverLayout/DriverLayout';

const CreateTrip: React.FC = () => {
  const [driverName, setDriverName] = useState('');
  const [routeID, setRouteID] = useState('');
  const [registration, setRegistration] = useState('');
  const [filteredTaxis, setFilteredTaxis] = useState<iTaxi[]>([]);
  const [selectedTaxi, setSelectedTaxi] = useState<iTaxiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tripCode, setTripCode] = useState<string | null>(null);

  const rankMap = useMemo(() => {
    return ranks.reduce((map: { [key: number]: iRank }, rank) => {
      map[rank.id] = rank;
      return map;
    }, {} as { [key: number]: iRank });
  }, []);

  const getFilteredTaxiData = useMemo(() => {
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
  }, [rankMap]);

  const handleSearchTaxi = () => {
    const regexDriver = new RegExp(driverName, 'i');
    const regexRegistration = new RegExp(registration, 'i');
    const foundTaxis = taxis.filter(
      (taxi) =>
        (driverName && regexDriver.test(taxi.driver)) ||
        (routeID && taxi.routeId.toString() === routeID) ||
        (registration && regexRegistration.test(taxi.registration))
    );
    setFilteredTaxis(foundTaxis);
  };

  const handleSelectTaxi = (taxi: iTaxi) => {
    const taxiData = getFilteredTaxiData([taxi])[0];
    setSelectedTaxi(taxiData);
  };

  const handleCreateTrip = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTaxi) return;

    setLoading(true);
    setMessage('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const route = selectedTaxi.route;
      if (!route) throw new Error('Route not found');

      const tx = await contract.createTrip(
        ethers.utils.parseEther(selectedTaxi.price.toString()),
        route,
        selectedTaxi.rankName,
        selectedTaxi.registration,
        selectedTaxi.verified
      );
      setMessage('decoding transaction');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt); // Log the receipt to debug

      // Parse the TripCreated event from the receipt
      const event = receipt.events?.find(
        (event: any) => event.event === 'TripCreated'
      );
      const tripCounter = event?.args.tripCounter?.toString();

      if (!tripCounter) {
        throw new Error('Trip counter is undefined');
      }
      setTripCode(tripCounter);
      setMessage('Trip created successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DriverLayout>
      <div className={styles.createTrip}>
        <h1>Create a New Trip</h1>
        {!tripCode ? (
          <>
            <div className={styles.searchTaxi}>
              <input
                type="text"
                placeholder="Enter driver name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter route ID"
                value={routeID}
                onChange={(e) => setRouteID(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter registration"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
              />
              <button onClick={handleSearchTaxi}>Search Taxi</button>
            </div>
            <div className={styles.taxiList}>
              {filteredTaxis.map((taxi) => (
                <div key={taxi.registration} className={styles.taxiItem}>
                  <TaxiDetails
                    type="fitted"
                    TaxiData={getFilteredTaxiData([taxi])[0]}
                    showTaxiDetails={() => {}}
                  />
                  <button onClick={() => handleSelectTaxi(taxi)}>
                    Select Taxi
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.tripDetails}>
            <h2>Trip Created Successfully!</h2>
            <p>Trip Code: {tripCode}</p>
          </div>
        )}
        {selectedTaxi && !tripCode && (
          <form className={styles.formDetails} onSubmit={handleCreateTrip}>
            <div className={styles.formGroup}>
              <label htmlFor="fare">Fare (ETH):</label>
              <input
                type="text"
                id="fare"
                value={selectedTaxi.price}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="details">Details:</label>
              <input
                type="text"
                id="details"
                value={selectedTaxi.route}
                readOnly
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </form>
        )}
        {message && <p>{message}</p>}
      </div>
    </DriverLayout>
  );
};

export default CreateTrip;
