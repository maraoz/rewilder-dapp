import Button from "./Button";
import React, { useState } from "react";
import Router from 'next/router'


function ThanksForDonating({ tokenId }) {

  const [redirecting, setRedirecting] = useState(false);

  const clicked = () => {
    setRedirecting(true);
    Router.push(`/donation/${tokenId}`);
  };
  return (
    <>
      <div className="donation-message">
        <div className="main-shape">
          <img src="/assets/img/shape/check-shape.svg" alt="success" />
        </div>
        <h4>Thanks for donating!</h4>
      </div>
      <div className="hero-v1-btn">
        <Button
          disabled={!tokenId}
          text={!tokenId?"Minting NFT, hang tight!":"Go to your donation NFT"}
          isLoading={!tokenId || redirecting}
          onClick={clicked}
        />
      </div>
    </>
  );
}

export default ThanksForDonating;
