import { useEffect, useState, useMemo } from 'react';

import axios from 'axios';
import { ethers } from 'ethers';
import styles from './create-trip.module.css';
import { abi, contractAddress } from '@/lib/contractConfig';
import { iRank, iRoute, iTaxi, iTaxiData } from '@/models/RankMapModels';
import TaxiDetails from '@/components/TaxiDetails';
import DriverLayout from '@/components/DriverLayout';
import PopUpLoader from '@/components/PopupLoader/';
import { QRCodeGenerator } from '@/components/QRCodeGenerator'; // Import the QRCodeGenerator component
import { constructRouteString, findRank, findRoute } from '@/lib/helpers';

const CreateTrip: React.FC = () => {
  const [driverName, setDriverName] = useState('');
  const [routeID, setRouteID] = useState('');
  const [registration, setRegistration] = useState('');
  const [filteredTaxis, setFilteredTaxis] = useState<iTaxi[]>([]);
  const [ranks, setRanks] = useState<iRank[]>([]);
  const [taxis, setTaxis] = useState<iTaxi[]>([]);
  const [routes, setRoutes] = useState<iRoute[]>([]);
  const [selectedTaxi, setSelectedTaxi] = useState<iTaxiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tripCode, setTripCode] = useState<string | null>(null);
  const [generateQRCode, setGenerateQRCode] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string | number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.brainiacwiz.com/api/taxicity/data'
        );
        const { ranks, taxis, routes } = response.data.data;

        // Process ranks
        const processedRanks = ranks.map((rank: any) => ({
          ...rank,
          routeIds: rank.routeIds
            .split(',')
            .map((id: string) => parseInt(id, 10)),
        }));

        // Update state with fetched data
        setRanks(processedRanks);
        setTaxis(taxis);
        setRoutes(routes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getFilteredTaxiData = (taxis: iTaxi[]): iTaxiData[] => {
    return taxis.map((taxi) => ({
      driver: taxi.driverName,
      route: constructRouteString(findRoute(taxi, routes), ranks),
      rankName: findRank(taxi, ranks).rankName,
      registration: taxi.registrationNumber,
      verified: taxi.isVerified,
      price:
        routes.find((route) => route.routeId === taxi.routeId)?.price || '0.00',
      capacity: taxi.capacity,
    }));
  };

  const handleSearchTaxi = () => {
    const regexDriver = new RegExp(driverName, 'i');
    const regexRegistration = new RegExp(registration, 'i');
    const foundTaxis = taxis.filter(
      (taxi) =>
        (driverName && regexDriver.test(taxi.driverName)) ||
        (routeID && taxi.routeId.toString() === routeID) ||
        (registration && regexRegistration.test(taxi.registrationNumber))
    );
    setFilteredTaxis(foundTaxis);
  };

  const handleSelectTaxi = (taxi: iTaxi) => {
    const taxiData = getFilteredTaxiData([taxi])[0];
    setSelectedPrice(taxiData.price);
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
        ethers.utils.parseEther(selectedPrice.toString()),
        route,
        selectedTaxi.rankName,
        selectedTaxi.registration,
        selectedTaxi.verified,
        selectedTaxi.capacity
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
      setGenerateQRCode(true); // Set generateQRCode to true to trigger QR code generation
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
                <div key={taxi.registrationNumber} className={styles.taxiItem}>
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
            {generateQRCode && (
              <QRCodeGenerator value={tripCode} generate={generateQRCode} />
            )}
          </div>
        )}
        {selectedTaxi && !tripCode && (
          <form className={styles.formDetails} onSubmit={handleCreateTrip}>
            <div className={styles.formGroup}>
              <label htmlFor="fare">Fare (ETH):</label>
              <input
                type="number"
                id="fare"
                step="0.1"
                onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}
                value={selectedPrice}
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
        {loading && <PopUpLoader />}
      </div>
    </DriverLayout>
  );
};

export default CreateTrip;
