export default class HashConnectProxy {
  // Must inject hashConnect into the method.
  static async sendTrx(hashConnect, topic, transBytes, accountId) {
    const transaction = {
      topic: topic,
      byteArray: transBytes,

      metadata: {
          accountToSign: accountId,
          returnTransaction: false,
          hideNft: false,
      }
    };


    return hashConnect.sendTransaction(topic, transaction);
  }
}
