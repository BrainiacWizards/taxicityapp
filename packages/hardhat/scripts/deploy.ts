import { ethers } from 'hardhat';

async function main() {
  // Get the contract factory
  const TaxiService = await ethers.getContractFactory('TaxiService');

  // Deploy the contract
  const taxiService = await TaxiService.deploy();

  // Wait for the deployment to be mined and confirmed
  await taxiService.deployTransaction.wait(5); // Wait for 5 confirmations

  // Log the contract address
  console.log('TaxiService deployed to:', taxiService.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
