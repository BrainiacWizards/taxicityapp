import TaxiDetails from '@/components/TaxiDetails/TaxiDetails';
import { iTaxiData } from '@/models/RankMapModels';
import React, { useEffect, useState } from 'react';

const dummyTaxiData: iTaxiData = {
  capacity: 0,
  driver: 'NA',
  price: 70,
  rankName: 'NA',
  registration: 'NA',
  route: 'NA',
  verified: false,
};

const TripPage: React.FC = () => {
  const [taxiData, setTaxiData] = useState<iTaxiData>(dummyTaxiData);

  useEffect(() => {
    const tripData = sessionStorage.getItem('trip');
    if (tripData) {
      setTaxiData(JSON.parse(tripData));
    }
  }, []);

  return (
    <div>
      <TaxiDetails
        TaxiData={taxiData}
        type="fitted"
        showTaxiDetails={() => {}}
      />
    </div>
  );
};

export default TripPage;
