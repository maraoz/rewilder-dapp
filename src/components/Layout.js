import { useEthers } from "@usedapp/core";
import React from "react";
import ConnectWallet from "./ConnectWallet";
import NetworkErrorMessage  from "./NetworkErrorMessage";
import WalletInfo from "./WalletInfo";
import Head from "./Head";

const Layout = ({ children, ...customMeta }) => {
  const { account } = useEthers();
  
  return (
    <>
      <Head {...customMeta} />
      <header>
      <section className="window-section">
        <div className="container-fluid">
          <NetworkErrorMessage />
          <nav className="navbar navbar-expand-md nav-custom">
            <div className="d-flex d-sm-none w-50 order-0">
                <a className="navbar-brand" href="#">
                  <img src="/assets/images/logo/logo-small-white.png" alt="Logo" height="18" />
                </a>
            </div>
            <div className="navbar-collapse d-none d-sm-block collapse justify-content-center order-2 ml-header-6">
              <a className="nav-link" href="#">
                <img src="/assets/images/logo/logo-full-white.svg" alt="Logo" height="18" width="115" />
              </a>
            </div>
            {account ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
            
          </nav>

          {children}

          <div className="footer">
            <div className="text-center">
              © Rewilder   -  Terms of use  -  Privacy
            </div>
          </div>
        </div>
      </section>
      </header>
    </>
  );
};

export default Layout;
