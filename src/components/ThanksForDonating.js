import Button from "./Button";
import Link from "next/link";
import React from "react";

function ThanksForDonating({ tokenId }) {

  return (
    <>
      <div> Thanks for donating! </div>
      <Link href={`/nft/${tokenId}`} >
        <a>
          <Button
            text={"Go to your donation NFT"}
          />
        </a>
      </Link>
    </>
  );
}

export default ThanksForDonating;
