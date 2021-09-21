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
      <div className="pending-donation">
        <FontAwesomeIcon icon={faCheckCircle} />
        <h4>Thanks for donating!</h4>
        <a href={getExplorerTransactionLink(donateTx.transactionHash, config.chainId)??"#"} target="_blank">
          View on etherscan{" "}
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>
        <div className="hero-v1-btn">
          <Button
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
