import Button from "./Button";
import React, { useState } from "react";
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


function ThanksForDonating({ tokenId }) {

  const [loading, setLoading] = useState(false);

  const clicked = () => {
    setLoading(true);
    Router.push(`/donation/${tokenId}`);
  };
  return (
    <>
      <div className="donation-message">
        <div className="main-shape">
          <img src="/assets/img/shape/check-shape.svg" alt="success" />
        </div>
        <h4>Thanks for donating!</h4>
        <div className="hero-v1-btn">
          <Button
            href="#"
            text={"Go to your donation NFT"}
            isLoading={loading}
            onClick={clicked}
          />
        </div>
      </div>
    </>
  );
}

export default ThanksForDonating;
