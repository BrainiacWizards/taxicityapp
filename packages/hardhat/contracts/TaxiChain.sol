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
    bool _verified,
    uint256 _capacity
  ) public returns (uint256) {
    tripCounter++;
    _initializeTrip(
      tripCounter,
      _fare,
      _details,
      _rankName,
      _registration,
      _verified,
      _capacity
    );
    emit TripCreated(tripCounter, msg.sender, _fare, _details);
    return tripCounter;
  }

  function _initializeTrip(
    uint256 _tripCode,
    uint256 _fare,
    string memory _details,
    string memory _rankName,
    string memory _registration,
    bool _verified,
    uint256 _capacity
  ) internal {
    trips[_tripCode] = Trip({
      tripCode: _tripCode,
      rankName: _rankName,
      registration: _registration,
      verified: _verified,
      route: _details,
      price: _fare,
      capacity: _capacity,
      driver: msg.sender,
      passengers: new address[](0),
      transactionHash: bytes32(0),
      completed: false
    });
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

  function joinTrip(
    uint256 _tripCode
  ) public payable tripExists(_tripCode) tripNotCompleted(_tripCode) {
    Trip storage trip = trips[_tripCode];
    require(trip.passengers.length < trip.capacity, 'Trip is full');
    require(msg.value == trip.price, 'Incorrect payment amount');

    uint256 taxAmount = (msg.value * taxRate) / 100;
    uint256 netAmount = msg.value - taxAmount;

    trip.passengers.push(msg.sender);

    bytes32 transactionHash = keccak256(
      abi.encodePacked(_tripCode, msg.sender, block.timestamp)
    );
    transactions[transactionHash] = Transaction({
      tripCode: _tripCode,
      passenger: msg.sender,
      amount: netAmount,
      tax: taxAmount,
      transactionHash: transactionHash,
      timestamp: block.timestamp
    });

    emit PassengerJoinedTrip(
      _tripCode,
      msg.sender,
      netAmount,
      taxAmount,
      transactionHash
    );
  }
}
