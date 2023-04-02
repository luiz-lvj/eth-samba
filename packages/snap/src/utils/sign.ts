import { Message } from "@fuel-ts/providers/*";
import { getKeyPair } from "./account";
import { messageCreator, showConfirmationDialog, transactionSign } from "./confirmation";

export interface SignedMessage {
    message: Message;
    signature: {
      data: string;
      type: number;
    };
  }

export async function signMessage(
    snap:any,
    messageRequest: any
  ): Promise<any> {
    try {
      const keypair = await getKeyPair(snap);
      // extract gas params
      const gl =
        messageRequest.gaslimit && messageRequest.gaslimit !== 0
          ? messageRequest.gaslimit
          : 0;
      const gp =
        messageRequest.gaspremium && messageRequest.gaspremium !== "0"
          ? messageRequest.gaspremium
          : "0";
      const gfc =
        messageRequest.gasfeecap && messageRequest.gasfeecap !== "0"
          ? messageRequest.gasfeecap
          : "0";
      const nonce = messageRequest.nonce || 0;
      const params = messageRequest.params || "";
      const method = messageRequest.method || 0;
  
      // create message object
      const message: any = {
        from: keypair.address,
        gasfeecap: gfc,
        gaslimit: gl,
        gaspremium: gp,
        method,
        nonce,
        params,
        to: messageRequest.to,
        value: messageRequest.value,
      };
      // estimate gas usage if gas params not provided
      if (
        message.gaslimit === 0 &&
        message.gasfeecap === "0" &&
        message.gaspremium === "0"
      ) {
        const messageEstimate =  {}
        message.gaslimit = 0;
        message.gaspremium = 0;
        message.gasfeecap = 0;
      }
  
      // show confirmation
      const confirmation = await showConfirmationDialog(snap, {
        description: `Address signing: ${message.from}`,
        prompt: `Do you want to sign this message?`,
        textAreaContent: messageCreator([
          { message: "to:", value: message.to },
          { message: "from:", value: message.from },
          {
            message: "value:",
            value: `${message.value} ETH`,
          },
          { message: "method:", value: message.method },
          { message: "params:", value: message.params },
          { message: "gas limit:", value: `${message.gaslimit} aFIL` },
          { message: "gas fee cap:", value: `${message.gasfeecap} aFIL` },
          { message: "gas premium:", value: `${message.gaspremium} aFIL` },
        ]),
      });
  
      let sig = null;
      if (confirmation) {
        sig = await transactionSign(message, keypair.privateKey);
      }
  
      return { confirmed: confirmation, error: null, signedMessage: sig };
    } catch (e: unknown) {
      return { confirmed: false, error: e as Error, signedMessage: null };
    }
  }