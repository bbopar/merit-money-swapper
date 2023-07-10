const { Client, PrivateKey, TokenCreateTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.DEPLOYER_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);
const treasuryPublicKey = treasuryPrivateKey.publicKey;
const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const transaction = new TokenCreateTransaction()
    .setTokenName("yUSDC")
    .setTokenSymbol("yUSDC")
    .setDecimals(0)
    .setInitialSupply(1000000)
    .setTreasuryAccountId(treasuryAccountID)
    .setAdminKey(treasuryPublicKey)
    .setWipeKey(treasuryPublicKey)
    .setSupplyKey(treasuryPublicKey);

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);
  const tokenId = receipt.tokenId.toString();

  console.log('🚀 Add tokenId to your .env file', tokenId);
  console.log('🚀 Created USDC FT, USDC_TOKEN_ID:', tokenId);

  process.exit();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

