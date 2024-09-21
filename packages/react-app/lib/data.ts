// rank data
export const ranks = [
	{
		id: 105,
		name: 'Bellville Rank',
		town: 'bellville',
		city: 'cape town',
		province: 'western cape',
		location: { lat: -33.904139, lng: 18.630222 },
		routes: [
			{ routeId: 1, toTown: 'cape town', toCity: 'cape town', price: 50, destinationId: 106 },
			{ routeId: 2, toTown: 'cape town', toCity: 'cape town', price: 60, destinationId: 106 },
		],
	},
	{
		id: 106,
		name: 'Cape Town Rank',
		town: 'cape town',
		city: 'cape town',
		province: 'western cape',
		location: { lat: -33.918861, lng: 18.4233 },
		routes: [
			{ routeId: 3, toTown: 'cape town', toCity: 'cape town', price: 70, destinationId: 106 },
			{ routeId: 4, toTown: 'durban', toCity: 'durban', price: 80, destinationId: 107 },
		],
	},
	{
		id: 107,
		name: 'Durban Rank',
		town: 'durban',
		city: 'durban',
		province: 'kwazulu-natal',
		location: { lat: -29.85868, lng: 31.02184 },
		routes: [
			{ routeId: 5, toTown: 'durban', toCity: 'durban', price: 90, destinationId: 107 },
			{
				routeId: 6,
				toTown: 'johannesburg',
				toCity: 'johannesburg',
				price: 100,
				destinationId: 108,
			},
		],
	},
	{
		id: 108,
		name: 'Johannesburg Rank',
		town: 'johannesburg',
		city: 'johannesburg',
		province: 'gauteng',
		location: { lat: -26.204103, lng: 28.047304 },
		routes: [
			{
				routeId: 7,
				toTown: 'johannesburg',
				toCity: 'johannesburg',
				price: 110,
				destinationId: 109,
			},
			{ routeId: 8, toTown: 'pretoria', toCity: 'pretoria', price: 120, destinationId: 109 },
		],
	},
	{
		id: 109,
		name: 'Pretoria Rank',
		town: 'pretoria',
		city: 'pretoria',
		province: 'gauteng',
		location: { lat: -25.747868, lng: 28.229271 },
		routes: [
			{ routeId: 9, toTown: 'pretoria', toCity: 'pretoria', price: 130, destinationId: 110 },
			{
				routeId: 10,
				toTown: 'port elizabeth',
				toCity: 'port elizabeth',
				price: 140,
				destinationId: 110,
			},
		],
	},
	{
		id: 110,
		name: 'Port Elizabeth Rank',
		town: 'port elizabeth',
		city: 'port elizabeth',
		province: 'eastern cape',
		location: { lat: -33.960837, lng: 25.602242 },
		routes: [
			{
				routeId: 11,
				toTown: 'port elizabeth',
				toCity: 'port elizabeth',
				price: 150,
				destinationId: 111,
			},
			{
				routeId: 12,
				toTown: 'bloemfontein',
				toCity: 'bloemfontein',
				price: 160,
				destinationId: 111,
			},
		],
	},
	{
		id: 111,
		name: 'Bloemfontein Rank',
		town: 'bloemfontein',
		city: 'bloemfontein',
		province: 'free state',
		location: { lat: -29.085214, lng: 26.159576 },
		routes: [
			{
				routeId: 13,
				toTown: 'bloemfontein',
				toCity: 'bloemfontein',
				price: 170,
				destinationId: 112,
			},
			{
				routeId: 14,
				toTown: 'kimberley',
				toCity: 'kimberley',
				price: 180,
				destinationId: 112,
			},
		],
	},
	{
		id: 112,
		name: 'Kimberley Rank',
		town: 'kimberley',
		city: 'kimberley',
		province: 'northern cape',
		location: { lat: -28.72823, lng: 24.74986 },
		routes: [
			{
				routeId: 15,
				toTown: 'kimberley',
				toCity: 'kimberley',
				price: 190,
				destinationId: 113,
			},
			{
				routeId: 16,
				toTown: 'polokwane',
				toCity: 'polokwane',
				price: 200,
				destinationId: 113,
			},
		],
	},
	{
		id: 113,
		name: 'Polokwane Rank',
		town: 'polokwane',
		city: 'polokwane',
		province: 'limpopo',
		location: { lat: -23.896973, lng: 29.448143 },
		routes: [
			{
				routeId: 17,
				toTown: 'polokwane',
				toCity: 'polokwane',
				price: 210,
				destinationId: 114,
			},
			{
				routeId: 18,
				toTown: 'nelspruit',
				toCity: 'nelspruit',
				price: 220,
				destinationId: 114,
			},
		],
	},
	{
		id: 114,
		name: 'Nelspruit Rank',
		town: 'nelspruit',
		city: 'nelspruit',
		province: 'mpumalanga',
		location: { lat: -25.474482, lng: 30.97033 },
		routes: [
			{
				routeId: 19,
				toTown: 'nelspruit',
				toCity: 'nelspruit',
				price: 230,
				destinationId: 105,
			},
			{
				routeId: 20,
				toTown: 'bellville',
				toCity: 'cape town',
				price: 240,
				destinationId: 105,
			},
		],
	},
];

// taxi data
export const taxis = [
	{
		id: 201,
		driver: 'John Doe',
		rankId: 105,
		routeId: 1,
		registration: 'CA 123-456',
		capacity: 16,
		verified: true,
	},
	{
		id: 202,
		driver: 'Jane Doe',
		rankId: 105,
		routeId: 2,
		registration: 'CA 789-101',
		capacity: 16,
		verified: false,
	},
	{
		id: 203,
		driver: 'John Smith',
		rankId: 106,
		routeId: 3,
		registration: 'CA 111-222',
		capacity: 16,
		verified: true,
	},
	{
		id: 204,
		driver: 'Jane Smith',
		rankId: 106,
		routeId: 4,
		registration: 'CA 333-444',
		capacity: 16,
		verified: false,
	},
	{
		id: 205,
		driver: 'John Johnson',
		rankId: 107,
		routeId: 5,
		registration: 'CA 555-666',
		capacity: 16,
		verified: true,
	},
	{
		id: 206,
		driver: 'Jane Johnson',
		rankId: 107,
		routeId: 6,
		registration: 'CA 777-888',
		capacity: 16,
		verified: false,
	},
	{
		id: 207,
		driver: 'John Williams',
		rankId: 108,
		routeId: 7,
		registration: 'CA 999-000',
		capacity: 16,
		verified: true,
	},
	{
		id: 208,
		driver: 'Jane Williams',
		rankId: 108,
		routeId: 8,
		registration: 'CA 101-112',
		capacity: 16,
		verified: false,
	},
	{
		id: 209,
		driver: 'John Brown',
		rankId: 109,
		routeId: 9,
		registration: 'CA 113-114',
		capacity: 16,
		verified: true,
	},
	{
		id: 210,
		driver: 'Jane Brown',
		rankId: 109,
		routeId: 10,
		registration: 'CA 115-116',
		capacity: 16,
		verified: false,
	},
	{
		id: 211,
		driver: 'John Davis',
		rankId: 110,
		routeId: 11,
		registration: 'CA 117-118',
		capacity: 16,
		verified: true,
	},
	{
		id: 212,
		driver: 'Jane Davis',
		rankId: 110,
		routeId: 12,
		registration: 'CA 119-120',
		capacity: 16,
		verified: false,
	},
	{
		id: 213,
		driver: 'John Miller',
		rankId: 111,
		routeId: 13,
		registration: 'CA 121-122',
		capacity: 16,
		verified: true,
	},
	{
		id: 214,
		driver: 'Jane Miller',
		rankId: 111,
		routeId: 14,
		registration: 'CA 123-124',
		capacity: 16,
		verified: false,
	},
];