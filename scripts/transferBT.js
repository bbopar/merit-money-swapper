const { Client, PrivateKey, TransferTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.DEPLOYER_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const tokenId = process.env.BARRAGE_TOKEN_ID;
  const accountId = process.env.EMPLOYEE_ID;

  const amount = 1000;

  const tx = await new TransferTransaction()
    .addTokenTransfer(tokenId, treasuryAccountID, -amount)
    .addTokenTransfer(tokenId, accountId, amount)
    .execute(client);

  const receiptTx = await tx.getReceipt(client);

  console.log(
    `Your FT Manual Transaction: ${receiptTx.status.toString()} \n`
  );

  console.log(`Trx: ${accountId} with the tokenId: ${tokenId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
