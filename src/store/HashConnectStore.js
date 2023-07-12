import {
  AccountAllowanceApproveTransaction,
  AccountId,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  TokenId,
  TransferTransaction,
} from "@hashgraph/sdk";
import { BigNumber } from 'bignumber.js';
import { defineStore, acceptHMRUpdate} from "pinia";
import { HashConnect } from "hashconnect";
import HashConnectProxy from "../services/HashConnectProxy";
import SingingService from '../services/SigningService';
import ResponseDecoder from "../services/ResponseDecoder";
import { ref } from 'vue'

export const useHashConnectWallet = defineStore("hashConnectWallet", () => {
  let contractId = '0.0.15329244';
  const tokenId = import.meta.env.VITE_BARRAGE_TOKEN_ID;
  // eslint-disable-next-line no-unused-vars
  let availableExtension = null;
  let network = 'testnet';
  let accountId = ref("");
  let saveData = ref({
    topic: "",
    pairingString: "",
    pairedAccounts: [],
  });
  let appMetadata = ref({
    network,
    name: "Barrageongo",
    description: "An example Barrage-Hedera dApp",
  });
  let hashConnect = ref(new HashConnect());
  let signer = ref(null);

  async function connectWallet() {
    const initData = await hashConnect.value.init(appMetadata.value, network, false);
    saveData.value.pairingString = initData.pairingString;
    saveData.value.pairedAccounts = initData.savedPairings;
    await setUpHashConnectEvents();
    return hashConnect.value.connectToLocalWallet(saveData.value.pairingString);
  }

  // async function disconnectWallet() {
  //   if (!hashConnect.value) {
  //     return;
  //   }
  //   await hashConnect.value.disconnect(saveData.value.topic);
  //   hashConnect.value = null;
  //   signer.value = null;
  //   saveData.value = null;
  //   if(localStorage.getItem('hashconnectData')){
  //     localStorage.removeItem('hashconnectData');
  //   }
  // }


  async function setUpHashConnectEvents() {
    hashConnect.value.foundExtensionEvent.on((data) => {
      availableExtension = data;
    });

    hashConnect.value.pairingEvent.on((data) => {
      accountId.value = data.accountIds[0];
      saveData.value.topic = data.topic;
      const provider = hashConnect.value.getProvider(network, data.topic, accountId.value);
      signer.value = hashConnect.value.getSigner(provider);
    });

    hashConnect.value.connectionStatusChangeEvent.on((state) => {
      console.log("hashconnect state change event", state);
    });
  }

  async function sendTransaction(amount, accId) {
    if (!accountId.value) {
      throw "You must pair wallet with the APP first.";
    }
    const tx = await new TransferTransaction()
      .addTokenTransfer(tokenId, AccountId.fromString(accountId.value), -amount)
      .addTokenTransfer(tokenId, AccountId.fromString(accId), amount)
      .freezeWithSigner(signer);

    await tx.executeWithSigner(signer);
  }

  async function deposit(amount) {
    const fnName = 'deposit';

    let trans = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(15000000)
      .setFunction(fnName, new ContractFunctionParameters().addUint256(amount))
      .setMaxTransactionFee(new Hbar(0.75));

    let transactionBytes = await SingingService.makeBytes(trans, accountId.value);

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId.value);

    if (res.error) {
      console.log('## ERROR ##', res.error);
      return res.error;
    }

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('🚀 ~ file: index.js:129 ~ deposit ~ responseData.receipt:', receipt);

    return receipt;
  }

  async function getBalanceUSDC() {
    const fnName = 'getBalanceUSDC'
    let trans = new ContractCallQuery()
      .setGas(15000000)
      .setContractId(contractId)
      .setFunction(fnName)
      .setMaxQueryPayment(new Hbar(0.005));

    let transactionBytes = trans.toBytes();

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId);

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('🚀 ~ file: index.js:120 ~ associateSwapperWithToken ~ receipt:', receipt);

    const balance = new BigNumber(receipt);

    console.log('🚀 ~ file: index.js:124 ~ getBalanceUSDC ~ balance:', balance.toNumber());

    return balance.toNumber();
  }

  async function associateSwapperWithToken(tokenId) {
    const fnName = 'associateToken';
    const tokenAddr = TokenId.fromString(tokenId).toSolidityAddress();

    let trans = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(15000000)
      .setFunction(fnName, new ContractFunctionParameters().addAddress(tokenAddr))
      .setMaxTransactionFee(new Hbar(10));

    console.log('#1', trans, accountId);

    let transactionBytes = await SingingService.makeBytes(trans, accountId.value);

    console.log('#2 bytes')

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId.value);

    console.log('3 res')

    if (res.error) {
      console.log('🚀 ~ file: index.js:163 ~ associateSwapperWithToken ~ res.error:', res.error);
      return res.error;
    }

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('4')

    console.log('🚀 ~ file: index.js:169 ~ associateSwapperWithToken ~ receipt:', receipt);

    return receipt;
  }

  async function swap() {
    const fnName = 'swap';

    let trans = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(15000000)
      .setFunction(fnName)
      .setMaxTransactionFee(new Hbar(10));

    let transactionBytes = await SingingService.makeBytes(trans, accountId);

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId);

    console.log('🚀 ~ file: index.js:201 ~ swap ~ res:', res);

    if (res.error) {
      console.log('🚀 ~ file: index.js:205 ~ swap ~ res.error:', res.error);
      return false;
    }

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('🚀 ~ file: index.js:210 ~ swap ~ receipt:', receipt);

    return receipt;
  }

  async function whitelist() {
    const fnName = 'whitelistAddress';
    // TODO this should be passed to the method.
    const employeeAddr = AccountId.fromString('0.0.4066176').toSolidityAddress();

    let trans = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(15000000)
      .setFunction(fnName, new ContractFunctionParameters().addAddress(employeeAddr))
      .setMaxTransactionFee(new Hbar(10));

    let transactionBytes = await SingingService.makeBytes(trans, accountId);

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId);

    if (res.error) {
      console.log('🚀 ~ file: index.js:246 ~ whitelist ~ res.error:', res.error);
      return false;
    }

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('🚀 ~ file: index.js:251 ~ whitelist ~ receipt:', receipt);

    return receipt;
  }

  async function approveSpender(tokenId, amount) {
    let trans = new AccountAllowanceApproveTransaction()
      .approveTokenAllowance(tokenId, accountId, contractId, amount);

    let transactionBytes = await SingingService.makeBytes(trans, accountId);

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId);

    console.log('🚀 Approve spender response:', res);

    return { success: true };
  }

  async function getAmountForWithdraw() {
    const fnName = 'getAmountForWithdraw'
    let trans = new ContractCallQuery()
      .setGas(15000000)
      .setContractId(contractId)
      .setFunction(getAmountForWithdraw)
      .setMaxQueryPayment(new Hbar(0.005));

    let transactionBytes = trans.toBytes();

    const res = await HashConnectProxy
      .sendTrx(hashConnect.value, saveData.value.topic, transactionBytes, accountId);

    const receipt = await ResponseDecoder.decode(fnName, res.receipt);

    console.log('🚀 ~ file: index.js:120 ~ associateSwapperWithToken ~ receipt:', receipt);

    const balance = new BigNumber(receipt);

    console.log('🚀 ~ file: index.js:124 ~ getBalanceUSDC ~ balance:', balance.toNumber());

    return balance.toNumber();
  }

  return {
    accountId,
    approveSpender,
    associateSwapperWithToken,
    connectWallet,
    // disconnectWallet,
    deposit,
    getAmountForWithdraw,
    getBalanceUSDC,
    sendTransaction,
    swap,
    whitelist,
    saveData
  };
});



if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHashConnectWallet, import.meta.hot))
}
