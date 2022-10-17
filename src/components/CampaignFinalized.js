import Button from "./Button";
import React, { useState } from "react";
import Router from 'next/router'
import { useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { addressFor } from '../lib/addresses';


function CampaignFinalized({ tokenId }) {

  const [loading, setLoading] = useState(false);
  const rewilderWalletBalance  = useEtherBalance(addressFor("wallet"));
  const now = new Date().getTime();
  const oct12 = new Date("Tue Oct 12 2021 00:00:00 GMT+0000");
  const daysSinceStart = Math.abs((now - oct12) / (1000 * 3600 * 24));


  const clicked = () => {
    setLoading(true);
    Router.push(`/donation/${tokenId}`);
  };
  return (
    <>
      <div className="donation-message">
        <div className="main-shape">
          <img src="/assets/img/shape/finalized.svg" alt="campaign finalized" />
        </div>
        <h4>Donation Campaign Ended
        <br />
        {102.87} 
        <img src="/assets/img/icon/eth.svg" height="16" width="16" alt="ETH" />
        {" "}ETH were donated in {parseFloat(daysSinceStart).toFixed(0)} days.
        </h4>
        <br />
        <p>Thanks to everyone for participating!</p>
        <a href="https://rewilder.substack.com/subscribe" target="_blank" className="subscribe">
          Subscribe to our newsletter to receive future updates.
        </a>
      </div>

      {
        tokenId &&
          <div className="hero-v1-btn">
            <Button
              text={"Go to your donation NFT"}
              isLoading={loading}
              onClick={clicked}
            />
          </div>
      }
    </>
  );
}

export default CampaignFinalized;
