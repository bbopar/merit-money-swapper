const hre = require("hardhat");
require('dotenv').config();
const { TokenId } = require('@hashgraph/sdk');

async function main() {
  const USDC_ADDRESS = TokenId.fromString(process.env.USDC_TOKEN_ID).toSolidityAddress();
  const BT_ADDRESS = TokenId.fromString(process.env.BARRAGE_TOKEN_ID).toSolidityAddress();

  const BarrageTokenSwap = await hre.ethers.getContractFactory("Swapper");
  const barrageTokenSwap = await BarrageTokenSwap
    .deploy(USDC_ADDRESS, BT_ADDRESS);

  const contractAddress = (await barrageTokenSwap.deployTransaction.wait()).contractAddress;

  console.log("Swapper contract address:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
