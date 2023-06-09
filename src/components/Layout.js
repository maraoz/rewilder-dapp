import { useEthers } from "@usedapp/core";
import React, { useContext } from "react";
import Head from "./Head";
import networkMatches from "../lib/networkMatches";
import NetworkErrorMessage  from "./NetworkErrorMessage";
import WalletInfo from "./WalletInfo";
import WalletModalContext from "../lib/walletModalContext";

export const Layout = ({ children, ...customMeta }) => {
  const { account } = useEthers();
  const incorrectNetwork = !networkMatches();
  const modalContext = useContext(WalletModalContext);

  return (
    <>
      <Head {...customMeta} />
      <div className="noise"></div>  
      {account ? (
        <WalletInfo />
        ) : (
        <div className="header-button">
          <a href="#" onClick={modalContext.onOpen}>Connect wallet</a>
        </div>
      )}
      <div className="header-v1-wrapper">
        <div className="logo"> 
            <NetworkErrorMessage />
            {
            !incorrectNetwork &&
              <a href="#">
                <img className="big-logo" src="/assets/img/logo/logo.svg" alt="Rewilder logo" />
                <img className="small-logo" src="/assets/img/logo/small-logo.svg" alt="Rewilder logo" />
              </a>
            }
        </div>
        {children}
        <div className="footer text-center">
          <p>© Rewilder Foundation, Inc.  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/terms-and-conditions">Terms of Service</a>  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/privacy-policy">Privacy</a></p>
        </div>
      </div>
      
      {modalContext.modalComponent}

    </>
  );
};
