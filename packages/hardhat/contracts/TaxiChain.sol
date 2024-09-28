// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract TaxiService {
    uint256 public constant taxRate = 8; 

    struct Trip {
        address driver;                     
        uint256 fare;                       
        string details;                     
        bool completed;                     
        bytes32 transactionHash;            
        address[] passengers;               
    }

    mapping(uint256 => Trip) public trips;  
    uint256 public tripCounter;             

    event TripCreated(uint256 tripCode, address driver, uint256 fare, string details);
    event PassengerJoinedTrip(uint256 tripCode, address passenger);
    event PaymentMade(uint256 tripCode, address passenger, uint256 amount, uint256 tax, bytes32 transactionHash);

    constructor() {
        tripCounter = 0;  
    }

    
    function createTrip(uint256 _fare, string memory _details) public returns (uint256) {
        tripCounter++;  
        trips[tripCounter] = Trip({
            driver: msg.sender,
            fare: _fare,
            details: _details,
            completed: false,
            transactionHash: bytes32(0),  
            passengers: new address[](0)   
        });

        emit TripCreated(tripCounter, msg.sender, _fare, _details);
        return tripCounter;  
    }

    
    function joinTrip(uint256 _tripCode) public {
        Trip storage trip = trips[_tripCode];
        require(trip.driver != address(0), "Trip does not exist");  
        require(!trip.completed, "Trip already completed");         

        trip.passengers.push(msg.sender); 

        emit PassengerJoinedTrip(_tripCode, msg.sender);
    }

    
    function completeTrip(uint256 _tripCode) public payable {
        Trip storage trip = trips[_tripCode];
        require(!trip.completed, "Trip already completed");
        require(msg.value == trip.fare, "Exact fare required");

        uint256 taxAmount = (trip.fare * taxRate) / 100;  
        uint256 paymentAmount = trip.fare - taxAmount;

        payable(trip.driver).transfer(paymentAmount);  

        trip.completed = true;
        trip.transactionHash = blockhash(block.number - 1);  

        emit PaymentMade(_tripCode, msg.sender, paymentAmount, taxAmount, trip.transactionHash);
    }

    
    function getTripDetails(uint256 _tripCode) public view returns (address, uint256, string memory, bool, bytes32, address[] memory) {
        Trip memory trip = trips[_tripCode];
        return (trip.driver, trip.fare, trip.details, trip.completed, trip.transactionHash, trip.passengers);
    }
}
