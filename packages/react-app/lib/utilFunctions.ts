// import { newKit } from '@celo/contractkit';
// import BigNumber from 'bignumber.js';
// import { toWei } from 'web3-utils';

// const kit = newKit('https://alfajores-forno.celo-testnet.org');

// const payWithCelo = async (amountInRands: number, recipientAddress: string) => {
//  try {
//   // Convert Rands to Celo (assuming 1 Rand = 0.1 Celo for this example)
//   const amountInCelo = new BigNumber(amountInRands).multipliedBy(0.1);

//   // Get the user's account
//   const accounts = await kit.web3.eth.getAccounts();
//   const userAccount = accounts[0];

//   // Estimate gas fees and gas price
//   const gasPrice = await kit.web3.eth.getGasPrice();
//   const txObject = {
//    from: userAccount,
//    to: recipientAddress,
//    value: toWei(amountInCelo.toString(), 'ether'),
//    gasPrice,
//   };
//   const gasEstimate = await kit.web3.eth.estimateGas(txObject);

//   // Send the transaction
//   const tx = await kit.web3.eth.sendTransaction({
//    ...txObject,
//    gas: gasEstimate,
//   });

//   // Check if the transaction succeeded
//   if (tx.status) {
//    return { status: 'success', transactionHash: tx.transactionHash };
//   } else {
//    return { status: 'failed', error: 'Transaction failed' };
//   }
//  } catch (error) {
//   return { status: 'error', error: (error as Error).message };
//  }
// };

// export default payWithCelo;
