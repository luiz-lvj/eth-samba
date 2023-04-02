import { WalletLocked } from "@fuel-ts/wallet";
import { getKeyPair } from "./account";

export async function getBalance(
    snap: any
  ): Promise<any> {

    const keyPair = await getKeyPair(snap);
    const address = keyPair.address;
    console.log(address)
    const wallet = new WalletLocked(address as any);
    console.log(wallet)
    const balance = await wallet.getBalance();
    return balance;
  }
  