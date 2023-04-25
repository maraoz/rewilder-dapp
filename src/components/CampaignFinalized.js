import Button from "./Button";
import React, { useState } from "react";
import Router from 'next/router'

function CampaignFinalized({ tokenId }) {

  const [loading, setLoading] = useState(false);

  const clicked = () => {
    setLoading(true);
    if (!tokenId) {
      tokenId = 1;
    }
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
        {" "}ETH were donated in {371} days.
        </h4>
        <br />
        <p>Thanks to everyone for participating!</p>
      </div>

      {
        tokenId &&
          <div className="hero-v1-btn">
            <Button
              text={"See map and your donation NFT"}
              isLoading={loading}
              onClick={clicked}
            />
          </div>
      }
      {
        !tokenId &&
          <div className="hero-v1-btn">
            <Button
              text={"See map"}
              isLoading={loading}
              onClick={clicked}
            />
          </div>
      }
    </>
  );
}

export default CampaignFinalized;
