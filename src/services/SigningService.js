import {
    AccountId,
    TransactionId,
} from "@hashgraph/sdk"

export default class SigningService {
    static async makeBytes(trans, signingAcctId) {
        let transId = TransactionId.generate(signingAcctId)
        console.log('transId', transId);
        trans.setTransactionId(transId);
        console.log('set transId');
        trans.setNodeAccountIds([new AccountId(3)]);
        console.log('setNodeAccountIds');

        await trans.freeze();

        console.log('freezed');

        let transBytes = trans.toBytes();

        console.log('bytes');

        return transBytes;
    }
}
