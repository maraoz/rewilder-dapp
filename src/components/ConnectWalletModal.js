import { useEthers } from "@usedapp/core";
import { useEffect } from "react";
import { getWalletConnectConnector } from "../lib/connectors";

import RewilderModal from './RewilderModal';

function ConnectWalletModal({ onOpen, isOpen, onClose }) {
  const { activate, activateBrowserWallet, error } = useEthers();

  useEffect(() => {
    if (error) {
      if (error.name == 'UserRejectedRequestError' || 
        error.toString() == "e: The user rejected the request.") {
        onOpen();
      } else {
        console.log(`Unexpected error!! fix this:`, error.name, error);
        console.log(error.toString());
      }
    }
  }, [error]);

  const clickMetamask = async () => {
    // don't remove this await
    await activateBrowserWallet();
    if (error) {
      if (error.name == 'UserRejectedRequestError') {
        // user rejected connection, we want to leave modal open
        return;
      }
      console.log("Unexpected MetaMask error:", error);
    }
    onClose();
  };

  const clickWalletConnect = async () => {
    const wcc = getWalletConnectConnector();
    await activate(wcc);
    onClose();
  };

  return (
    <RewilderModal className="connect-wallet-popup" onOpen={onOpen} isOpen={isOpen} onClose={onClose} title={"Connect to a wallet"}>
      <div className="connect-option">
        <a href="#" onClick={clickMetamask} className="metamask">
          <img src="/assets/img/icon/metamask-icon.svg" alt="Metamask" />
          <span>Metamask</span>
        </a>
        <a href="#" onClick={clickWalletConnect} className="wallet-connect">
          <img src="/assets/img/icon/wallet-connect-icon.svg" alt="WalletConnect" />
          <span>WalletConnect</span>
        </a>
      </div>
      <p>
        By connecting a wallet, you agree to Rewilder’s 
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy.</a>
      </p>
    </RewilderModal>
  );
}

export default ConnectWalletModal;
