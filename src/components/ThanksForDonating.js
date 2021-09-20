import Button from "./Button";
import React, { useState } from "react";
import Router from 'next/router'


function ThanksForDonating({ tokenId }) {

  const [loading, setLoading] = useState(false);

  const clicked = () => {
    setLoading(true);
    Router.push(`/donation/${tokenId}`);
  };

  return (
    <>
      <div> Thanks for donating! </div>
      <div className="hero-v1-btn">
        <Button
          text={"Go to your donation NFT"}
          isLoading={loading}
          onClick={clicked}
        />
      </div>
    </>
  );
}

export default ThanksForDonating;
