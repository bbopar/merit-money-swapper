# Merit Money Swapper

Merit Money Swapper is a project that explores the possibilities of Hedera smart contracts and contract interaction using Vue framework.

## Technologies and Languages

This project is built on the Hedera blockchain platform and is written in Solidity, JavaScript, and Vue.

## Dependencies

- `hashgraph/sdk`
- `hardhat`
- `nomiclabs/hardhat-ethers`
- `openzeppelin/contracts`
- `vue`

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

## Account & Token setup

1. Create `Deployer` account [here](https://portal.hedera.com/).

2. Add deployer keys to .env file.

3. Create `Admin` account using hashpack wallet and fund with hbar using `Deployer`.

4. Create `Employee` account using hashpack wallet and fund with hbar using `Deployer`.

5. Create both tokens on `testnet` with `Deployer` account.

Barrage token:

```
npm run create-barrage-token
```

output:

```
🚀 Created Barrage FT, BARRAGE_TOKEN_ID: 0.0.15073453
```

USDC token:

```
npm run create-usdc-token
```

output:

```
🚀 Created USDC FT, USDC_TOKEN_ID: 0.0.15073479
```

Add tokenIds to .env file.

Find contract addresses for both tokens [here](https://hashscan.io/testnet) and add to .env file.

6. Associate both `Admin` & `Employee` account with new tokens using hashpack wallet.

For the association you'll need to login into hashpask wallet for `admin` and `employee` and associate those accounts with new tokens.

7. Contract deployment

### Hardhat config

Setup the contract deployer in `hardhat.config.js`.

```
const PRIVATE_KEY = process.env.TREASURY_HEX_PRIVATE_KEY;
```

### Contract deployment

Script for `deploy` uses `hardhat` for contract deployment.

The complied contracts should be deployed with the command:

```
npm run deploy-contract
```

Script output:

```
Swapper contract address: 0x81c2e51a55f21b0246754C4e11C749F0f2C8d443
```
The recommendation is to off-load the deployment to backend service. The reason is that you can't deploy such large contract with hashpack wallet.

Because of that suggestion is to read `privKey` from `vault` or `.env` file and then deploy the contract using backend service.

## State changes necessary for COMPANY_ADMIN to deposit:

1. ### Grant Admin role

Has to be done using backend service as deployer must grant role to the ADMIN.

As the PRIVATE_KEY defined in `hardhat.config.js` is the contract `ADMIN` that account must grant role

to merit-money COMPANY_ADMIN which will be responsible for whitelisting `EMPLOYEES` to the `Swapper`, contract management, depositing etc.

The `EMPLOYEES` must be whitelisted so that have a right to `Swap` their bonus tokens with stablecoin.

Run command:

```
npm run grant-admin-role
```

From now on, everything can be approved by hashpack wallet.

2. ### Associate `Swapper` with `USDC`

3. ### Approve `Swapper` contract as spender on behalf of `Company Admin`

This will approve SC to transfer usdc tokens.

4. ### Admin can deposit now.

## State changes necessary for EMPLOYEE to swap:

1. ### Approve `Swapper` as spender on behalf of `Employee`

This will approve SC to transfer barrage tokens.

2. ### Employee is ready for `Swap`
