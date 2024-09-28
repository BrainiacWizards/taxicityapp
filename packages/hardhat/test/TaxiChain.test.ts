const { expect } = require('chai');
const { ethers } = require('hardhat');

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

  it('should allow a passenger to join a trip', async function () {
    const txCreate = await taxiService
      .connect(driver)
      .createTrip(fare, tripDetails);
    const receiptCreate = await txCreate.wait();
    const tripCode = receiptCreate.events[0].args.tripCode.toNumber();

    const txJoin = await taxiService.connect(passenger).joinTrip(tripCode);
    const receiptJoin = await txJoin.wait();
    const trip = await taxiService.trips(tripCode);

    expect(trip.passengers.length).to.equal(1);
    expect(trip.passengers[0]).to.equal(passenger.address);

    expect(receiptJoin.events[0].event).to.equal('PassengerJoinedTrip');
    expect(receiptJoin.events[0].args.tripCode.toNumber()).to.equal(tripCode);
    expect(receiptJoin.events[0].args.passenger).to.equal(passenger.address);
  });

  it('should complete a trip', async function () {
    const txCreate = await taxiService
      .connect(driver)
      .createTrip(fare, tripDetails);
    const receiptCreate = await txCreate.wait();
    const tripCode = receiptCreate.events[0].args.tripCode.toNumber();

    const initialDriverBalance = await ethers.provider.getBalance(
      driver.address
    );
    const txComplete = await taxiService
      .connect(passenger)
      .completeTrip(tripCode, { value: fare });
    const receiptComplete = await txComplete.wait();
    const trip = await taxiService.trips(tripCode);

    expect(trip.completed).to.equal(true);
    expect(trip.transactionHash).to.not.equal(ethers.constants.HashZero);

    const finalDriverBalance = await ethers.provider.getBalance(driver.address);
    const taxAmount = fare.mul(8).div(100);
    const paymentAmount = fare.sub(taxAmount);
    expect(finalDriverBalance.sub(initialDriverBalance)).to.equal(
      paymentAmount
    );

    expect(receiptComplete.events[0].event).to.equal('PaymentMade');
    expect(receiptComplete.events[0].args.tripCode.toNumber()).to.equal(
      tripCode
    );
    expect(receiptComplete.events[0].args.passenger).to.equal(
      passenger.address
    );
    expect(receiptComplete.events[0].args.amount).to.equal(paymentAmount);
    expect(receiptComplete.events[0].args.tax).to.equal(taxAmount);
  });

  it('should get trip details', async function () {
    const txCreate = await taxiService
      .connect(driver)
      .createTrip(fare, tripDetails);
    const receiptCreate = await txCreate.wait();
    const tripCode = receiptCreate.events[0].args.tripCode.toNumber();

    const trip = await taxiService.getTripDetails(tripCode);

    expect(trip[0]).to.equal(driver.address);
    expect(trip[1]).to.equal(fare);
    expect(trip[2]).to.equal(tripDetails);
    expect(trip[3]).to.equal(true);
    expect(trip[4]).to.not.equal(ethers.constants.HashZero);
    expect(trip[5].length).to.equal(1);
    expect(trip[5][0]).to.equal(passenger.address);
  });
});
