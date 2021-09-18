import { useEthers } from "@usedapp/core";
import React from "react";
import ConnectWallet from "./ConnectWallet";
import NetworkErrorMessage  from "./NetworkErrorMessage";
import WalletInfo from "./WalletInfo";
import Head from "./Head";
import networkMatches from "../lib/networkMatches";

const Layout = ({ children, ...customMeta }) => {
  const { account } = useEthers();
  const incorrectNetwork = !networkMatches();
  
  return (
    <>
      <Head {...customMeta} />
      <header class="header-area-v1">
        <div class="container-fluid">
          <div class="header-v1-wrapper">
            <div class="logo">
                <NetworkErrorMessage />
                {
                !incorrectNetwork &&
                  <a href="#">
                    <img class="big-logo" src="assets/img/logo/logo.svg" alt="logo" />
                    <img class="small-logo" src="assets/img/logo/small-logo.svg" alt="logo" />
                  </a>
                }
            </div>
              {account ? (
                  <WalletInfo />
                ) : (
                  <ConnectWallet />
              )}
          </div>
        </div>
      </header>
          
      {children}

      <div class="footer text-center">
        <p>© Rewilder Foundation, Inc.  -  Terms of use  -  Privacy</p>
      </div>
    </>
  );
};

export default Layout;
