import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import config from "../config";

const POLLING_INTERVAL = 12000;
export const walletconnect = new WalletConnectConnector({
  rpc: config.DAppProviderConfig.readOnlyUrls,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
