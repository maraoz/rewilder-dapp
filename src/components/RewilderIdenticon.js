import React from "react";
import Blockies from "./Blockies";

function RewilderIdenticon({ account, size=16 }) {
  return (
    <Blockies className="identicon" 
      spotColor="#faf8f6" 
      bgColor="#6DD681"
      color="#12501E"
      seed={account.toLowerCase()} scale={size/8} size={8} />
  );
}

export default RewilderIdenticon;
