import React from "react";
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { Menu } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import RewilderIdenticon from "./RewilderIdenticon";
import truncateHash from "../lib/truncateHash";


function WalletInfo() {
  const { account, deactivate, library } = useEthers();
  const etherBalance  = useEtherBalance(account);
  const disconnectWallet = () => {
    if (library.connection.url !== "metamask") {
      library.provider.disconnect();
    }
    deactivate();
  };

  return (
    account && (
      <>
        <Menu as="div" className="connect-button disconnect-button">
          <Menu.Button as="a" href="#">
            <span className="balance">
              {etherBalance? parseFloat(formatEther(etherBalance)).toFixed(3):"0"}
              {" "}ETH{" "}
            </span>
            <span className="address">
              <RewilderIdenticon account={account} />
              {"  "}{truncateHash(account)}
            </span>
          </Menu.Button>
          <Menu.Items>
            <Menu.Item as="div" className="disconnect">
              {({ active }) => (
                <a href="#" onClick={disconnectWallet}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Disconnect
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </>
    )
  );
}

export default WalletInfo;
