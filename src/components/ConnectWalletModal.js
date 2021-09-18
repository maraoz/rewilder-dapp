import { useEthers } from "@usedapp/core";
import React from "react";
import { walletconnect } from "../lib/connectors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function ConnectWalletModal({ isOpen, onClose }) {
  const { activate, activateBrowserWallet } = useEthers();
  return <div className="container"></div>;
  return (
    <div className="container">
    { 
      isOpen &&

      <div className="connect-wallet-popup active">
        <div className="connect-wallet-close">
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <h4>Connect to a wallet</h4>
        <div className="connect-option">
          <a href="#" onClick={activateBrowserWallet}>
            <img src="assets/img/icon/metamask-icon.svg" alt="Metamask" />
            <span>Metamask</span>
          </a>
          <a href="#" onClick={() => {activate(walletconnect)}}>
            <img src="assets/img/icon/wallet-connect-icon.svg" alt="WalletConnect" />
            <span>WalletConnect</span>
          </a>
        </div>
        <p>
          By connecting a wallet, you agree to Rewilder’s 
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy.</a>
        </p>
      </div>
    }
    </div>
  );
}

export default ConnectWalletModal;
