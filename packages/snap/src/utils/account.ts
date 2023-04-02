import {
    getBIP44AddressKeyDeriver,
    JsonBIP44CoinTypeNode,
  } from "@metamask/key-tree";

export async function getKeyPair(snap: any): Promise<any> {
    const snapState = (await snap.request({
      method: "snap_manageState",
      params: { operation: "get" },
    }));
    const { derivationPath } = snapState.filecoin.config;
    const [, , coinType, account, change, addressIndex] =
      derivationPath.split("/");
    const bip44Code = coinType.replace("'", "");
    const isFilecoinMainnet = bip44Code === "461";
  
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
  
    const privateKey = extendedPrivateKey.privateKeyBytes as WithImplicitCoercion<ArrayBuffer>;
    const privateKeyBuffer = Buffer.from(privateKey).slice(0, 32);
  
    const extendedKey = keyRecover(privateKeyBuffer);
  
    return {
      address: extendedKey.address,
      privateKey: extendedKey.private_base64,
      publicKey: extendedKey.public_hexstring,
    };
  }