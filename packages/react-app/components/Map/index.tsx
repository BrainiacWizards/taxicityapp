'use client';

import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from '@vis.gl/react-google-maps';
import styles from './map.module.css';
import { iRank } from '@/models/RankMapModels';

const GoogleMap: React.FC<{ locations: iRank[] }> = ({ locations }) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // get users current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // If user denies permission, use the first location in the locations array
        if (locations.length > 0) {
          setCurrentLocation({
            lat: locations[0].latitude,
            lng: locations[0].longitude,
          });
        }
      }
    );
  }, [locations]);

  console.log('current loc', currentLocation);

  const PoiMarkers = (props: { pois: iRank[] }) => {
    return (
      <>
        {props.pois.map((poi: iRank, index: number) => (
          <AdvancedMarker
            key={index}
            position={{
              lat: poi.latitude,
              lng: poi.longitude,
            }}
            clickable
            title={poi.rankName}
          >
            <Pin
              background={'#b90000'}
              glyphColor={'#ffffff'}
              borderColor={'#000'}
            />
            <div className={styles.label}>{poi.rankName}</div>
          </AdvancedMarker>
        ))}
      </>
    );
  };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      {currentLocation && (
        <Map
          mapId={'609184b6d45dfcf6'}
          className={styles.map}
          defaultCenter={currentLocation}
          colorScheme="dark"
          defaultZoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <PoiMarkers pois={locations} />
        </Map>
      )}
    </APIProvider>
  );
};

export default GoogleMap;
