import {
    AccountId,
    TransactionId,
} from "@hashgraph/sdk"

export default class SigningService {
    static async makeBytes(trans, signingAcctId) {
        let transId = TransactionId.generate(signingAcctId)
        trans.setTransactionId(transId);
        trans.setNodeAccountIds([new AccountId(3)]);

        await trans.freeze();

        let transBytes = trans.toBytes();

        return transBytes;
    }
}
