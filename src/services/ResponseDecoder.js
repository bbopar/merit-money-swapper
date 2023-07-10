import { abi } from '../../artifacts/contracts/Swapper.sol/Swapper.json';
import * as ethers from 'ethers';

export default class ResponseDecoder {
  static async decode(method, bytes) {
    const contractInterface = new ethers.utils.Interface(abi);

    return contractInterface.decodeFunctionResult(method, bytes);
  }
}