import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { EmptyMetamaskState } from './utils/interfaces';
import { getBalance } from './utils/balance';
import { getAddress } from './utils/account';
import { signMessage } from './utils/sign';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }: { origin: any, request: any }) => {
  // const state = await snap.request({
  //   method: "snap_manageState",
  //   params: { operation: "get" },
  // });

  // if (!state) {
  //   // initialize state if empty and set default config
  //   await snap.request({
  //     method: "snap_manageState",
  //     params: { newState: EmptyMetamaskState(), operation: "update" },
  //   });
  // }


  switch (request.method) {
    case 'hello': {
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Confirmation',
          content: panel([
            text(`${Object.keys(request)}`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
          
        },
      });
    }

    case 'getAddress': {
      const data = await getAddress(snap);
      return {
        result: data,
      }
    }

    case 'signMessage':
      return await signMessage(snap, request.params.signedMEssage);
    
      
    default:
      throw new Error('Method not found.');
  }
};
