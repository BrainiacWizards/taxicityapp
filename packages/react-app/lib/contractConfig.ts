export const abi = [
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
      {
        internalType: 'uint256',
        name: '_capacity',
        type: 'uint256',
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
    name: 'joinTrip',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
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
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_transactionHash',
        type: 'bytes32',
      },
    ],
    name: 'getTransactionDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tripCode',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'passenger',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tax',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
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
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'getTripDetails',
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
    name: 'totalTaxCollected',
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
];

export const mainnetAbi = [
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
      {
        internalType: 'uint256',
        name: '_capacity',
        type: 'uint256',
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
    name: 'joinTrip',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
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
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_transactionHash',
        type: 'bytes32',
      },
    ],
    name: 'getTransactionDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tripCode',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'passenger',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tax',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
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
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'getTripDetails',
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
    name: 'totalTaxCollected',
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
];

export const contractAddress = '0xac4b339e53b6f49c89d28a642caa281457a19668';
export const mainnetContractAddress =
  '0xfe879e4804c04bcc78816677c3c34621a74e3fc9';
