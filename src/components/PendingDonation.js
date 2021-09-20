import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { getExplorerTransactionLink } from "@usedapp/core";

import config from "../config";

function PendingDonation({ donateTx }) {

  return (
    <div className="pending-donation">
      <div className="circle-shape">
          <img src="/assets/img/shape/circle-shape.svg" alt="loading" />
      </div>
      <h4>Donation transaction pending</h4>
      <a href={getExplorerTransactionLink(donateTx.transactionHash, config.chainId)??"#"} target="_blank">
        View on etherscan{" "}
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </a>
    </div>
  );
}

export default PendingDonation;
