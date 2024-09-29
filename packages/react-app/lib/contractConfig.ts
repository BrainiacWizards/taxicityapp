export const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tripCode',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'passenger',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tax',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transactionHash',
        type: 'bytes32',
      },
    ],
    name: 'PassengerJoinedTrip',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tripCode',
        type: 'uint256',
      },
    ],
    name: 'TripCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tripCounter',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'driver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fare',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'details',
        type: 'string',
      },
    ],
    name: 'TripCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'completeTrip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fare',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_details',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_rankName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_registration',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '_verified',
        type: 'bool',
      },
    ],
    name: 'createTrip',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'getTripDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tripCode',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'rankName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'registration',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'verified',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'route',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'capacity',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'driver',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'passengers',
            type: 'address[]',
          },
          {
            internalType: 'bytes32',
            name: 'transactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct TaxiService.Trip',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'joinTrip',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'taxRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tripCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'trips',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tripCode',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'rankName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'registration',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'verified',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'route',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'capacity',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'driver',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'transactionHash',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const contractAddress = '0x2C1742fcEb9c07e1b2ea41d16fF79713FD85DcE5';
