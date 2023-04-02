import { fuelNetworkConfiguration } from "./config";

export const EmptyMetamaskState: () => Object = () => ({
    fuel: { config: fuelNetworkConfiguration , messages: [] },
  });