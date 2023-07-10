# Merit Money Swapper

Merit Money Swapper is a project that explores the possibilities of Hedera smart contracts. Its primary contract, `Swapper`, enables the exchange of ERC20 tokens (awarded to employees as bonuses) for the USDC stablecoin. The company admin is responsible for deploying the contract and depositing USDC into it. Once approved, employees can withdraw their bonuses in USDC.

## Technologies and Languages

This project is built on the Hedera blockchain platform and is written in Solidity and JavaScript.

## Dependencies

- `hashgraph/sdk`
- `hardhat`
- `nomiclabs/hardhat-ethers`
- `openzeppelin/contracts`

## Installation

To install the project, run:

```
npm install
```

## Build

To compile the contracts run:

```
npx hardhat compile
```

## Contract artifacts

The contract artifacts should be located in the project root under `artifacts` directory.

Loading `Swapper` abi:

```
import { abi } from '../artifacts/contracts/Swapper.sol/Swapper.json';
```

## Example usage with hashpack:

### Hardhat config

Setup the contract deployer in `hardhat.config.js`.

```
const PRIVATE_KEY = process.env.TREASURY_HEX_PRIVATE_KEY;
```

## Contract deployment

Script for `deploy` uses `hardhat` for contract deployment.

The complied contracts should be deployed with the command:

```
node scripts/swapper/deploy.js
```

Script output:

```
Swapper contract address: 0x81c2e51a55f21b0246754C4e11C749F0f2C8d443
```
The recommendation is to off-load the deployment to backend service.

The reason is that you can't deploy such large contract with hashpack wallet.

Because of that suggestion is to read `privKey` from `vault` or `.env` file

and then deploy the contract using backend.

## State changes necessary for COMPANY_ADMIN to deposit:

1. ## Grant Admin role

Note: this must be done 

As the PRIVATE_KEY defined in `hardhat.config.js` is the contract `ADMIN` we want him to grant role

to merit-money COMPANY_ADMIN which will be responsible for whitelisting `EMPLOYEES` to the `Swapper`.

The `EMPLOYEES` must be whitelisted so that have a right to `Swap` their bonus tokens with stablecoin.

Note: this scripts for granting role uses `@hashgraph/sdk`.

Run command:

```
node scripts/swapper-sdk/grantAdminRole.js
```

From now on everything else can be done with hashpack wallet so the integration can be in the browser.

2. ## Associate `Swapper` with `USDC` & `BT`

