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
    inputs: [
      {
        internalType: 'uint256',
        name: '_tripCode',
        type: 'uint256',
      },
    ],
    name: 'completeTrip',
    outputs: [],
    stateMutability: 'payable',
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
    stateMutability: 'nonpayable',
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
    name: 'PaymentMade',
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
    name: 'getTripDetails',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
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
        internalType: 'address',
        name: 'driver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fare',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'details',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bytes32',
        name: 'transactionHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
