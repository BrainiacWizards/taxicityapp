// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TaxiService {
  uint256 public constant taxRate = 8;

  struct Trip {
    uint256 tripCode;
    string rankName;
    string registration;
    bool verified;
    string route;
    uint256 price;
    uint256 capacity;
    address driver;
    address[] passengers;
    bytes32 transactionHash;
    bool completed;
  }

  struct Transaction {
    uint256 tripCode;
    address passenger;
    uint256 amount;
    uint256 tax;
    bytes32 transactionHash;
    uint256 timestamp;
  }

  mapping(uint256 => Trip) private trips;
  mapping(bytes32 => Transaction) private transactions;
  uint256 public tripCounter;

  event TripCreated(
    uint256 tripCounter,
    address driver,
    uint256 fare,
    string details
  );
  event PassengerJoinedTrip(
    uint256 tripCode,
    address passenger,
    uint256 amount,
    uint256 tax,
    bytes32 transactionHash
  );
  event TripCompleted(uint256 tripCode);

  constructor() {
    tripCounter = 0;
  }

  modifier onlyDriver(uint256 _tripCode) {
    require(
      trips[_tripCode].driver == msg.sender,
      'Only the driver can perform this action'
    );
    _;
  }

  modifier tripExists(uint256 _tripCode) {
    require(trips[_tripCode].driver != address(0), 'Trip does not exist');
    _;
  }

  modifier tripNotCompleted(uint256 _tripCode) {
    require(!trips[_tripCode].completed, 'Trip already completed');
    _;
  }

  function createTrip(
    uint256 _fare,
    string memory _details,
    string memory _rankName,
    string memory _registration,
    bool _verified
  ) public returns (uint256) {
    tripCounter++;
    trips[tripCounter] = Trip({
      tripCode: tripCounter,
      rankName: _rankName,
      registration: _registration,
      verified: _verified,
      route: _details,
      price: _fare,
      capacity: 0,
      driver: msg.sender,
      passengers: new address[](0),
      transactionHash: bytes32(0),
      completed: false
    });

    emit TripCreated(tripCounter, msg.sender, _fare, _details);
    return tripCounter;
  }

  function joinTrip(
    uint256 _tripCode,
    bytes32 _transactionHash
  ) public tripExists(_tripCode) tripNotCompleted(_tripCode) {
    Trip storage trip = trips[_tripCode];
    require(trip.passengers.length < trip.capacity, 'Trip is full');
    trip.passengers.push(msg.sender);
    trip.transactionHash = _transactionHash;

    transactions[_transactionHash] = Transaction({
      tripCode: _tripCode,
      passenger: msg.sender,
      amount: trip.price,
      tax: (trip.price * taxRate) / 100,
      transactionHash: _transactionHash,
      timestamp: block.timestamp
    });

    emit PassengerJoinedTrip(
      _tripCode,
      msg.sender,
      trip.price,
      (trip.price * taxRate) / 100,
      _transactionHash
    );
  }

  function completeTrip(
    uint256 _tripCode
  )
    public
    tripExists(_tripCode)
    tripNotCompleted(_tripCode)
    onlyDriver(_tripCode)
  {
    Trip storage trip = trips[_tripCode];
    trip.completed = true;

    emit TripCompleted(_tripCode);
  }

  function getTripDetails(
    uint256 _tripCode
  )
    public
    view
    returns (
      uint256 tripCode,
      string memory rankName,
      string memory registration,
      bool verified,
      string memory route,
      uint256 price,
      uint256 capacity,
      address driver,
      address[] memory passengers,
      bytes32 transactionHash,
      bool completed
    )
  {
    Trip storage trip = trips[_tripCode];
    return (
      trip.tripCode,
      trip.rankName,
      trip.registration,
      trip.verified,
      trip.route,
      trip.price,
      trip.capacity,
      trip.driver,
      trip.passengers,
      trip.transactionHash,
      trip.completed
    );
  }

  function getTransactionDetails(
    bytes32 _transactionHash
  )
    public
    view
    returns (
      uint256 tripCode,
      address passenger,
      uint256 amount,
      uint256 tax,
      uint256 timestamp
    )
  {
    Transaction storage txn = transactions[_transactionHash];
    return (txn.tripCode, txn.passenger, txn.amount, txn.tax, txn.timestamp);
  }
}
