export interface iRank {
	id: number;
	name: string;
	town: string;
	city: string;
	province: string;
	location: {
		lat: number;
		lng: number;
	};
	routes: iRoute[];
}

export interface iRoute {
	routeId: number;
	toTown: string;
	toCity: string;
	price: number;
	destinationId: number;
}

export interface iTaxi {
	id: number;
	driver: string;
	rankId: number;
	routeId: number;
	registration: string;
	capacity: number;
	verified: boolean;
}

export interface iTaxiData {
	rankName: string | undefined;
	registration: string;
	verified: boolean;
	route: string;
	price: string | number;
	capacity: number;
	driver: string;
}
