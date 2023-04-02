import {
    getBIP44AddressKeyDeriver,
    JsonBIP44CoinTypeNode,
  } from "@metamask/key-tree";
import { ethers } from "ethers";


export async function getKeyPair(snap: any): Promise<any> {
    const coinType = "1179993420";
    const account = "0";
    const change = "0";
    const addressIndex = "0";

    const bip44Code = coinType.replace("'", "");
  
    const bip44Node = (await snap.request({
      method: "snap_getBip44Entropy",
      params: {
        coinType: Number(bip44Code),
      },
    })); ;
  
    const addressKeyDeriver = await getBIP44AddressKeyDeriver(bip44Node, {
      account: parseInt(account),
      change: parseInt(change),
    });
    const extendedPrivateKey = await addressKeyDeriver(Number(addressIndex));

    const privateKey = extendedPrivateKey.privateKeyBytes as ethers.utils.BytesLike;

    const wallet = new ethers.Wallet(privateKey);

    const address = wallet.address;
    const privateKey64 = ethers.utils.base64.encode(privateKey);
    const publicKey = wallet.publicKey;


    // get address from privateKey

    // const privateBase64 = privateKeyBuffer.toString("base64");
    // const publicKey = extendedPrivateKey.publicKeyBytes;
    // const publicKeyBuffer = Buffer.from(publicKey as any);
    // const publicHex = publicKeyBuffer.toString("hex");
    // const address = extendedPrivateKey.address;


    // const address: string = extendedPrivateKey.address;
    // //get private kry as base64
    // const privateHex: string = extendedPrivateKey.privateKey as string;
    // // get private key as base64 from privateHex
    // const privateBase64: string = Buffer.from(privateHex, 'hex').toString('base64');

    // const publicKey = extendedPrivateKey.publicKey;
    // const privateKeyBuffer = Buffer.from(privateKey as any).slice(0, 32);

    // const extendedKey = keyRecover(privateKeyBuffer, false);

  return {
    address,
    publicKey,
    privateKey64: privateKey64,
    privateKey: privateKey.toString(),
  };
  }

  export async function getAddress(snap: any): Promise<string> {
    const keyPair = await getKeyPair(snap);
    return keyPair;
  }