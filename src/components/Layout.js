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
      <header>
      <section className="window-section">
        <div className="container-fluid">
          
          {
             <>
            <nav className="navbar navbar-expand-md nav-custom">
              <div className="d-flex d-sm-none w-50 order-0">
                  <a className="navbar-brand" href="#">
                    <img src="/assets/images/logo/logo-small-white.png" alt="Logo" height="18" />
                  </a>
              </div>
              <div className="navbar-collapse d-none d-sm-block collapse justify-content-center order-1">
                <NetworkErrorMessage />
                {
                  !incorrectNetwork && <a className="nav-link" href="#">
                    <img src="/assets/images/logo/logo-full-white.svg" alt="Logo" height="18" width="115" />
                  </a>
                }
              </div>
            </nav>
            <nav className="navbar navbar-expand-md nav-custom">
              <div className="d-flex d-sm-none w-50">
              </div>
              <div className="navbar-collapse">
              </div>
              <div className="order-2">
                {account ? (
                  <WalletInfo />
                ) : (
                  <ConnectWallet />
                )}
              </div>
              
            </nav>
          </>
          }

          {children}

          <div className="footer">
            <div className="text-center">
              © Rewilder Foundation, Inc.  -  Terms of use  -  Privacy
            </div>
          </div>
        </div>
      </section>
      </header>
    </>
  );
};

export default Layout;
