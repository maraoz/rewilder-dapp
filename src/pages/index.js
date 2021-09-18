import React, { useState, useEffect } from "react";
import Router from 'next/router'

import { useDisclosure } from "@chakra-ui/react";
import Slider from "@material-ui/core/Slider";
import { useEthers, useContractFunction, useEtherBalance } from "@usedapp/core";
import { ethers } from 'ethers';

import Layout from "./../components/Layout";
import { addressFor } from "../lib/addresses";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import ConnectWalletModal from "../components/ConnectWalletModal";
import ThanksForDonating from "../components/ThanksForDonating";
import Button from "../components/Button";
import InformationIcon from "../components/InformationIcon";
import FLAVOR_TEXT from "../lib/flavorText";

import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";

function IndexPage() {
  const { account, error, library } = useEthers();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const etherBalance  = useEtherBalance(account);
  
  const [amount, setAmount] = useState(1);
  const [walletOpened, setWalletOpened] = useState(false);
  
  const clamp = (n, lower, upper) => Math.min(Math.max(n, lower), upper);
  
  // TODO: move this to rewilderNFT.js :: useDonate or something
  const RewilderDonationCampaignInterface = new ethers.utils.Interface(RewilderDonationCampaign.abi)
  const campaignAddress = addressFor("RewilderDonationCampaign");
  const campaign = new ethers.Contract(
    campaignAddress,
    RewilderDonationCampaignInterface,
  );
  
  const { state: donateTx , events, send: requestDonateToWallet } =
    useContractFunction(campaign, "donate", { transactionName: 'Donate' });
    
  const maybeNFTBalance = useBalanceOf(account);
  const nftBalance = maybeNFTBalance && maybeNFTBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, nftBalance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  
  const alreadyDonated = donateTx.status=="Success" || tokenId > 0;
  const insufficientBalance = amount > etherBalance/1e18;
  
  const getTierForAmount = (amount) => {
    return amount < 33 ? "cypress" : amount < 66 ? "araucaria" : "sequoia";
  };
  
  const ethToUSD = 3500;
  const hectaresEstimation = amount*ethToUSD/8000;
  const tier = getTierForAmount(amount);
  const flavorText = FLAVOR_TEXT[tier]; 

  const donateButtonText = !account?
    "Connect Wallet":
    alreadyDonated?
      "Thanks for donating!":
      insufficientBalance?
        "Insufficient Balance":
        "Donate and mint your NFT";

  const donateButtonLoadingText = !account?
    "Connecting Wallet":
    "Sign Transaction in Wallet"

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
    
  useEffect(() => {
    if (error) {
      console.log(`error`, error);
    }
  }, [error]);
  
  const redirectDelayMS = 2000;
  useEffect(() => {
    if (events) {
      const tokenId = events[0].args[2].toNumber();
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      setTimeout(() => {
        Router.push(`/nft/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [events]);
  useEffect(() => {
    if (donateTx.status == 'Exception' || 
        donateTx.status == 'Mining') {
      console.log('status=', donateTx.status);
      setWalletOpened(false);
    }
  }, [donateTx]);
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


  // call the campaign smart contract, send a donation
  const donate = () => {
    if (!account) {
      return onOpen();
    }
    if (!amount) return;
    const donationAmountWEI = ethers.utils.parseEther(amount.toString());

    if (library) {
      console.log(`${account} is about to donate`, donationAmountWEI/1e18, "ETH");
      requestDonateToWallet({value: donationAmountWEI});
      setWalletOpened(true);
    }
  }

  return (
    <Layout>
      <div>
        <div className="d-flex flex-row min-vh-100 justify-content-center align-items-center">
          <div className="card card-style">
            <div className="card-body no-paddings">
              <div className="row no-gutters">

                <div className="col-md-6 no-paddings no-gutters">
                  <img src={`assets/images/card-image-${tier}.jpg`} className="banner-image" />
                  <div className="banner-image-footer">
                    <p className="text-center bannar-text">“{flavorText}”</p>
                  </div>
                </div>

                <div className="col-md-6 text-color px-4">

                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <img src="assets/images/logo/logo-full-green.svg" alt="" height="14" />
                      <h2 className="mt-3 text-header">Edition 001: Origin</h2>
                    </div>
                    <div>
                      <img src="assets/images/triangle.png" alt="" width="60" />
                    </div>
                  </div>
                  {
                    !alreadyDonated?
                    <>
                      <div className="d-flex justify-content-between mt-5">
                        <div className="mt-5 text-center">
                          <img src={`assets/images/tree/tree-1-${tier=='cypress'?'green':'gray'}.png`}
                            id="image-1" style={{height:"40px"}} />
                          <h5 className="image-1 image-title">Cypress</h5>
                        </div>
                        <div className="mt-3 text-center">
                          <img src={`assets/images/tree/tree-2-${tier=='araucaria'?'green':'gray'}.png`}
                            id="image-2" style={{height:"70px"}} />
                          <h5 className="image-2 image-title">Araucaria</h5>
                        </div>
                        <div className="text-center">
                          <img src={`assets/images/tree/tree-3-${tier=='sequoia'?'green':'gray'}.png`}
                            id="image-3" style={{height:"90px"}} />
                          <h5 className="image-3 image-title">Sequoia</h5>
                        </div>
                      </div>

                        
                      <div className="range-input">
                        <Slider 
                          value={amount}
                          min={1}
                          step={1}
                          max={100}
                          disabled={alreadyDonated}
                          marks={sliderMarks}
                          onChange={handleSliderChange}
                        />
                        {/* <input type="range"
                        value={amount}
                        className="mt-1" className="rangeInput"/> */}
                        <div className="selector" style={{left: `${amount}%`}}>
                          <div className="SelectBtn">
                          </div>
                        </div>
                        <div id="Progressbar" style={{width: `${amount}%`}}></div>
                      </div>

                      <div className="text-center my-5">
                        <h4 className="view-amount">
                          You are donating{" "} <br className="d-sm-none" /> 
                          <input 
                            className="selected-amount"
                            type="number"
                            value={amount}
                            onChange={handleInputChange}
                            />{" "}
                          <img src="assets/images/icon/eth.svg" height="16" width="16" className="mb-1"/>ETH
                        </h4>
                        <div className="mt-3 mt-sm-1 estimate-text">We estimate this will help buy ~{hectaresEstimation.toFixed(2)} hectares. 
                          <InformationIcon text={"This is our current best estimate based on early research."}/>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={donate} 
                        isLoading={walletOpened || donateTx.status=="Mining"}
                        disabled={alreadyDonated || insufficientBalance}
                        text={donateButtonText}
                        loadingText={donateButtonLoadingText}
                        />
                    </>:
                    <ThanksForDonating tokenId={tokenId}/>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>
    </Layout>
  );
}

export default IndexPage;
