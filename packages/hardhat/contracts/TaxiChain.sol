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

  mapping(uint256 => Trip) public trips;
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
    uint256 _tripCode
  ) public payable tripExists(_tripCode) tripNotCompleted(_tripCode) {
    Trip storage trip = trips[_tripCode];
    require(msg.value == trip.price, 'Exact fare required');

    uint256 taxAmount = (trip.price * taxRate) / 100;
    uint256 paymentAmount = trip.price - taxAmount;

    payable(trip.driver).transfer(paymentAmount);

    trip.passengers.push(msg.sender);
    trip.transactionHash = blockhash(block.number - 1);

    emit PassengerJoinedTrip(
      _tripCode,
      msg.sender,
      paymentAmount,
      taxAmount,
      trip.transactionHash
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

  function getTripDetails(uint256 _tripCode) public view returns (Trip memory) {
    return trips[_tripCode];
  }
}
