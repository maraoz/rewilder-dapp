import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import config from "../config";

const POLLING_INTERVAL = 12000;

export const getWalletConnectConnector = () => {
  return new WalletConnectConnector({
    rpc: config.DAppProviderConfig.readOnlyUrls,
    infuraId: config.INFURA_ID,
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  });
} 
