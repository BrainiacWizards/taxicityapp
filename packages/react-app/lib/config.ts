import { http } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { createConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  binanceWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  valoraWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        valoraWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
        binanceWallet,
        braveWallet,
      ],
    },
  ],
  {
    appName: 'Celo Composer',
    projectId: process.env.WC_PROJECT_ID ?? '044601f65212332475a09bc14ceb3c34',
  }
);

export const config = createConfig({
  connectors,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});
