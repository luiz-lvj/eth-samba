import { Message } from "@fuel-ts/providers/*";
import { SignedMessage } from "./sign";
import { ethers } from "ethers";

export async function showConfirmationDialog(
    snap: any,
    message: any
  ): Promise<boolean> {
    return (await snap.request({
      method: "snap_confirm",
      params: [message],
    })) as boolean;
  }

  export const messageCreator = (messages: any[]): any =>
  messages
    .map(({ message, value }) => message + " " + String(value))
    .join("\n");


    export async function transactionSign(
        unsignedMessage: Message,
        privateKey: string
      ): Promise<SignedMessage> {

        const wallet = new ethers.Wallet(privateKey);
        const signature = await wallet.signMessage(String(unsignedMessage));
        return {
            message: unsignedMessage,
            signature: {
                data: signature,
                type: 0,
            },
        }
}

  