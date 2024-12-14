interface AbiInput {
  internalType: string;
  name: string;
  type: string;
}

interface AbiOutput {
  internalType: string;
  name: string;
  type: string;
}

interface AbiFunction {
  inputs: AbiInput[];
  name: string;
  outputs: AbiOutput[];
  stateMutability: string;
  type: 'function';
}

interface AbiEventInput {
  indexed: boolean;
  internalType: string;
  name: string;
  type: string;
}

interface AbiEvent {
  anonymous: boolean;
  inputs: AbiEventInput[];
  name: string;
  type: 'event';
}

interface AbiConstructor {
  inputs: AbiInput[];
  stateMutability: string;
  type: 'constructor';
}

type AbiItem = AbiFunction | AbiEvent | AbiConstructor;

export const abi: AbiItem[] = [
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
];
