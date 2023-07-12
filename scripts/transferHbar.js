const { TransferTransaction, Client, PrivateKey } = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.DEPLOYER_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const amount = 1500;

  // const receiver = process.env.COMPANY_ADMIN_ID;
  const receiver = process.env.EMPLOYEE_ID;

  const transferTx = new TransferTransaction()
        .addHbarTransfer(treasuryAccountID, -amount)
        .addHbarTransfer(receiver, amount)
        .freezeWith(client);

    const transferSign = await transferTx.sign(treasuryPrivateKey);

    const transferSubmit = await transferSign.execute(client);

    const transferRx = await transferSubmit.getReceipt(client);

    console.log('🚀 ~ file: transferHbar.js:26 ~ main ~ transferRx:', transferRx);

    return transferRx;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

