import React from "react";
import Identicon from 'react-identicons';
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { Menu } from '@headlessui/react'

import truncateHash from "../lib/truncateHash";

function WalletInfo() {
  const { account, deactivate } = useEthers();
  const etherBalance  = useEtherBalance(account);
  const size = 15;
  const palette = ["#158D0C", "#3F6947", "#339645"];
  return (
    account && (
      <>
          <Menu as="span" className="text-right order-1 order-md-last mr-20 sm-corner">
            <Menu.Button as="div" className="amount-box">
              <p className="fs-16 lh-18 mb-0 amount-text">
                {etherBalance? parseFloat(formatEther(etherBalance)).toFixed(3):"0"} ETH{" "}

                <span className="amount-inner-box">
                  <span className="amount-inner-text">
                    <Identicon palette={palette} className="amount-inner-icon" string={account} size={size} />
                    {"  "}{truncateHash(account)}
                  </span>
                </span>
              </p>
            </Menu.Button>
            <Menu.Items>
              <Menu.Item>
                {({ active }) => (
                  <>
                    <a onClick={deactivate}>
                    <p className={`${
                      active ? '.active' : ''
                    }  disconnected text-right font-bold fs-14`}>
                      <i className="fas fa-sign-out-alt"></i>
                      Disconnect</p>
                  </a>
                  </>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
      </>
    )
  );
}

export default WalletInfo;
