import { useEthers } from "@usedapp/core";
import { useEffect } from "react";
import { walletconnect } from "../lib/connectors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function ConnectWalletModal({ isOpen, onClose }) {
  const { activate, activateBrowserWallet } = useEthers();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overlay');
    } else {
      document.body.classList.remove('overlay');
    }
  }, [isOpen]);

  const clickMetamask = () => {
    activateBrowserWallet();
    onClose();
  };

  const clickWalletConnect = () => {
    activate(walletconnect);
  };

  return (
    <div className="container">
    { 
      <div className={"connect-wallet-popup"+(isOpen?" active":"")}>
        <div className="connect-wallet-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <h4>Connect to a wallet</h4>
        <div className="connect-option">
          <a href="#" onClick={clickMetamask}>
            <img src="assets/img/icon/metamask-icon.svg" alt="Metamask" />
            <span>Metamask</span>
          </a>
          <a href="#" onClick={clickWalletConnect}>
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
