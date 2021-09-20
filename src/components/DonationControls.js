import React, { useState , useContext, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { ethers } from 'ethers';

import Button from "../components/Button";
import InformationIcon from "../components/InformationIcon";
import networkMatches from "../lib/networkMatches";
import config from "../config";
import WalletModalContext from "../lib/walletModalContext";


function DonationControls({ amount, setAmount, tier, alreadyDonated, donateTx, requestDonationToWallet }) {
  
  const { account } = useEthers();
  const modalContext = useContext(WalletModalContext);
  const [walletOpened, setWalletOpened] = useState(false);
  const etherBalance  = useEtherBalance(account);
  const networkIncorrect = !networkMatches();

  const ethToUSD = 3500;
  const hectaresEstimation = amount*ethToUSD/8000;
  const insufficientBalance = amount > etherBalance/1e18;
  const clamp = (n, lower, upper) => Math.min(Math.max(n, lower), upper);


  const donateButtonText = networkIncorrect?
    `Change wallet network to ${config.networkName}`:
    !account?
      "Connect Wallet":
      alreadyDonated?
        "Thanks for donating!":
        insufficientBalance?
          "Insufficient Balance":
          "Donate and mint your NFT";

  
  const donateButtonLoadingText = !account?
    "Connecting Wallet":
    donateTx.status == 'Mining'?
      "Donation tx pending":
      "Sign Transaction in Wallet";

  const sliderMarks = [
    {
      value: 1,
    },
    {
      value: 33,
    },
    {
      value: 66,
    },
  ];

  const handleSliderChange = (event, newValue) => {
    setAmount(newValue);
  };

  const handleInputChange = (event) => {
    if (event.target.value == "") {
      setAmount("");
      return;
    }
    const value = clamp(event.target.value, 1, 100);
    setAmount(value);
  };

  useEffect(() => {
    if (donateTx.status == 'Exception' || 
        donateTx.status == 'Mining') {
      console.log('status=', donateTx.status);
      setWalletOpened(false);
    }
  }, [donateTx]);


  // call the campaign smart contract, send a donation
  const donate = () => {
    if (!account) {
      return modalContext.onOpen();
    }
    if (!amount) return;
    
    const donationAmountWEI = ethers.utils.parseEther(amount.toString());
    console.log(`${account} is about to donate`, donationAmountWEI/1e18, "ETH");
    requestDonationToWallet({value: donationAmountWEI});
    setWalletOpened(true);
  }

  return (<>
    <div className="tree-group">
      <div className="single-tree">
        <div className="tree-img small-tree">
          <img src={`assets/images/tree/tree-1-${tier=='cypress'?'green':'gray'}.png`} alt="tree"/>
        </div>
        <div className="tree-title">
          <h5 className="image-1 image-title">Cypress</h5>
        </div>
      </div>
      <div className="single-tree">
        <div className="tree-img medium-tree">
          <img src={`assets/images/tree/tree-2-${tier=='araucaria'?'green':'gray'}.png`} alt="tree"/>
        </div>
        <div className="tree-title">
          <h5 className="image-2 image-title">Araucaria</h5>
        </div>
      </div>
      <div className="single-tree">
        <div className="tree-img large-tree">
          <img src={`assets/images/tree/tree-3-${tier=='sequoia'?'green':'gray'}.png`} alt="tree"/>
        </div>
        <div className="tree-title">
          <h5 className="image-3 image-title">Sequoia</h5>
        </div>
      </div>
    </div>
    <div className="range-input">
        <input type="range" min="1" max="100" onChange={handleSliderChange} value={amount} step="0.1" list="tickmarks" id="rangeInput" />
        <div id="selector" style={{left: `${amount}%`}}>
          <div className="SelectBtn">
          </div>
        </div>
        <div id="Progressbar" style={{width: `${amount}%`}}></div>
        {/* <Slider 
          value={amount}
          min={1}
          step={1}
          max={100}
          disabled={alreadyDonated}
          marks={sliderMarks}
          onChange={handleSliderChange}
        /> */}
    </div>
    <div className="donating-value">
      <h4 className="view-amount">
        You are donating{" "}
        <input 
          className="selected-amount"
          type="number"
          value={amount}
          disabled={alreadyDonated}
          onChange={handleInputChange}
          />{" "} <img src="assets/img/icon/eth.svg" height="16" width="16" alt="ETH" /> ETH</h4>
      <span>
        We estimate this will help buy ~{hectaresEstimation.toFixed(2)} hectares. 
        <InformationIcon text={"This is our current best estimate based on early research."}/>
      </span>
    </div>
    <div className="hero-v1-btn">
      <Button 
        href="#"
        onClick={donate} 
        isLoading={walletOpened || donateTx.status=="Mining"}
        disabled={networkIncorrect || alreadyDonated || insufficientBalance}
        text={donateButtonText}
        loadingText={donateButtonLoadingText}
        />
    </div>
  </>);
}

export default DonationControls;
