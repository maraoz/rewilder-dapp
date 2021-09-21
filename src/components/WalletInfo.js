import React from "react";
import Identicon from 'react-identicons';
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { Menu } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import truncateHash from "../lib/truncateHash";

function WalletInfo() {
  const { account, deactivate } = useEthers();
  const etherBalance  = useEtherBalance(account);
  const size = 15;
  // TODO: pick better colors
  const palette = ["#158D0C", "#3F6947", "#339645"];
  return (
    account && (
      <>
        <Menu as="span" className="connect-button disconnect-button">
          <Menu.Button as="a" href="#">
            <span className="balance">
              {etherBalance? parseFloat(formatEther(etherBalance)).toFixed(3):"0"}
              {" "}ETH{" "}
            </span>
            <span>
              <Identicon palette={palette} string={account} size={size} />
              {"  "}{truncateHash(account)}
            </span>
          </Menu.Button>
          <Menu.Items>
            <Menu.Item as="div" className="disconnect">
              {({ active }) => (
                <a href="#" onClick={deactivate}>
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
