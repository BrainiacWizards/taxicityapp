<!-- TITLE -->

<h2 align="center">TaxiCity</h2>
<p align="center">A decentralized Taxi App built using Celo Composer, Next.js, TypeScript, and CSS.</p>

<p align="center">
  <a href="https://github.com/BrainiacWizards/taxicity/graphs/stars">
    <img alt="GitHub Contributors" src="https://img.shields.io/github/stars/BrainiacWizards/taxicity?color=FCFF52" />
  </a>
  <a href="https://github.com/BrainiacWizards/taxicity/graphs/contributors">
    <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/BrainiacWizards/taxicity?color=E7E3D4" />
  </a>
  <a href="https://github.com/BrainiacWizards/taxicity/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/BrainiacWizards/taxicity?color=E7E3D4" />
  </a>
  <a href="https://github.com/BrainiacWizards/taxicity/pulls">
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/BrainiacWizards/taxicity?color=E7E3D4" />
  </a>
  <a href="https://opensource.org/license/mit/">
    <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

TaxiCity is a decentralized Taxi App built using Celo Composer. It enables citizens to search for taxi ranks and taxis, start a taxi trip with a trip code from the driver, and pay using Celo. After the trip, users can view, report, and rate drivers. Drivers can view receipts, orders, transactions, and more.

You can visit the live application at [taxicity.vercel.app](https://taxicity.vercel.app).

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

TaxiCity is built using the following technologies:

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [wagmi](https://wagmi.sh/)
- [viem](https://viem.sh/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Hardhat](https://hardhat.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node (v20 or higher)
- Git (v2.38 or higher)

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/BrainiacWizards/taxicityapp.git
   ```

2. Install dependencies:

   ```bash
   cd taxicityapp
   yarn install --legacy-peer-deps
   ```

   or

   ```bash
   npm install --legacy-peer-deps
   ```

3. Rename the file:

   ```bash
   mv packages/react-app/.env.template packages/react-app/.env
   ```

4. Open the newly renamed `.env` file and add all the required environment variables.

### Faucet on Testnet

To get testnet funds, follow these steps:

1. Visit the [Celo Faucet](https://celo.org/developers/faucet).
2. Enter your wallet address.
3. Select the Alfajores testnet.
4. Click on "Get Started" to receive testnet funds.

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

To start the project, run the following commands from the `packages/react-app` folder:

```bash
yarn dev
```

or

```bash
npm run dev
```

Alternatively, run it from the root using these commands:

```bash
npm run react-app:dev
```

More commands are available in the `package.json` file in the project root folder.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/BrainiacWizards/taxicityapp/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

We welcome contributions from the community. To contribute, please fork the repository and create a pull request.

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

For more information, please contact us at [mptdevs@gmail.com](mailto:mptdevs@gmail.com).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [wagmi](https://wagmi.sh/)
- [viem](https://viem.sh/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Hardhat](https://hardhat.org/)

## Developers

- Palesa Hope Motaung
- Manelisi Mpotulo
- Sakhile Kgapola

<p align="right">(<a href="#top">back to top</a>)</p>
