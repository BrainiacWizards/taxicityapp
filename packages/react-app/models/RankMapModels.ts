export interface iRank {
  rankId: number;
  rankName: string;
  town: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  routeIds: string;
}

export interface iRoute {
  routeId: number;
  fromRankId: number;
  toTown: string;
  toCity: string;
  price: string;
  destinationRankId: number;
}

export interface iTaxi {
  taxiId: number;
  driverName: string;
  rankId: number;
  routeId: number;
  registrationNumber: string;
  capacity: number;
  isVerified: boolean;
}

export interface iTaxiData {
  tripCode?: number;
  rankName: string | undefined;
  registration: string;
  verified: boolean;
  route: string;
  price: string | number;
  capacity: number;
  driver: string;
}
