export async function signMessage(
    snap:any,
    api: LotusRpcApi,
    messageRequest: MessageRequest
  ): Promise<SignMessageResponse> {
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
      const nonce =
        messageRequest.nonce ?? Number(await api.mpoolGetNonce(keypair.address));
      const params = messageRequest.params || "";
      const method = messageRequest.method || 0;
  
      // create message object
      const message: Message = {
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
        const messageEstimate = await api.gasEstimateMessageGas(
          message,
          { MaxFee: "0" },
          null
        );
        message.gaslimit = messageEstimate.GasLimit;
        message.gaspremium = messageEstimate.GasPremium;
        message.gasfeecap = messageEstimate.GasFeeCap;
      }
  
      // show confirmation
      const confirmation = await showConfirmationDialog(snap, {
        description: `It will be signed with address: ${message.from}`,
        prompt: `Do you want to sign this message?`,
        textAreaContent: messageCreator([
          { message: "to:", value: message.to },
          { message: "from:", value: message.from },
          {
            message: "value:",
            value: `${new FilecoinNumber(message.value, "attofil").toFil()} FIL`,
          },
          { message: "method:", value: message.method },
          { message: "params:", value: message.params },
          { message: "gas limit:", value: `${message.gaslimit} aFIL` },
          { message: "gas fee cap:", value: `${message.gasfeecap} aFIL` },
          { message: "gas premium:", value: `${message.gaspremium} aFIL` },
        ]),
      });
  
      let sig: SignedMessage = null;
      if (confirmation) {
        sig = transactionSign(message, keypair.privateKey);
      }
  
      return { confirmed: confirmation, error: null, signedMessage: sig };
    } catch (e: unknown) {
      return { confirmed: false, error: e as Error, signedMessage: null };
    }
  }