import { useEthers } from "@usedapp/core";
import React from "react";
import {
  useDisclosure,
} from "@chakra-ui/react";

import Head from "./Head";
import networkMatches from "../lib/networkMatches";
import ConnectWalletModal from "./ConnectWalletModal";
import NetworkErrorMessage  from "./NetworkErrorMessage";
import WalletInfo from "./WalletInfo";

const Layout = ({ children, ...customMeta }) => {
  const { account } = useEthers();
  const incorrectNetwork = !networkMatches();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const openWalletModal = function() {
    onOpen();
  }
  return (
    <>
      <Head {...customMeta} />
      <header className="header-area-v1">
        <div className="container-fluid">
          <div className="header-v1-wrapper">
            <div className="logo">
                <NetworkErrorMessage />
                {
                !incorrectNetwork &&
                  <a href="#">
                    <img className="big-logo" src="assets/img/logo/logo.svg" alt="logo" />
                    <img className="small-logo" src="assets/img/logo/small-logo.svg" alt="logo" />
                  </a>
                }
            </div>
              {account ? (
                  <WalletInfo />
                ) : (
                  <div className="header-button">
                      <a href="#" onClick={openWalletModal}>Connect wallet</a>
                  </div>
              )}
          </div>
        </div>
      </header>
          
      {children}

      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>

      <div className="footer text-center">
        <p>© Rewilder Foundation, Inc.  -  Terms of use  -  Privacy</p>
      </div>
    </>
  );
};

export default Layout;
