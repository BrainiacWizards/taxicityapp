import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('TaxiService', function () {
  let TaxiService;
  let taxiService;
  let driver;
  let passenger;
  const fare = ethers.utils.parseEther('1');
  const tripDetails = 'Trip from A to B';

  beforeEach(async function () {
    [driver, passenger] = await ethers.getSigners();
    TaxiService = await ethers.getContractFactory('TaxiService');
    taxiService = await TaxiService.deploy();
    await taxiService.deployed();
  });

  it('should create a trip', async function () {
    const tx = await taxiService.connect(driver).createTrip(fare, tripDetails);
    const receipt = await tx.wait();
    const tripCode = receipt.events[0].args.tripCode.toNumber();
    const trip = await taxiService.trips(tripCode);

    expect(trip.driver).to.equal(driver.address);
    expect(trip.fare).to.equal(fare);
    expect(trip.details).to.equal(tripDetails);
    expect(trip.completed).to.equal(false);
    expect(trip.passengers.length).to.equal(0);

    expect(receipt.events[0].event).to.equal('TripCreated');
    expect(receipt.events[0].args.tripCode.toNumber()).to.equal(tripCode);
    expect(receipt.events[0].args.driver).to.equal(driver.address);
    expect(receipt.events[0].args.fare).to.equal(fare);
    expect(receipt.events[0].args.details).to.equal(tripDetails);
  });
});
