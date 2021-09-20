import React, { useState, useEffect } from "react";

import { useEthers } from "@usedapp/core";
import Router from 'next/router'

import { Layout } from "./../components/Layout";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import { useDonation } from "../lib/rewilderDonationCampaign";
import ThanksForDonating from "../components/ThanksForDonating";
import DonationControls from "../components/DonationControls";
import PendingDonation from "../components/PendingDonation";
import FLAVOR_TEXT from "../lib/flavorText";

function IndexPage() {
  const { account, error } = useEthers();
  
  const [amount, setAmount] = useState(1);
  
  const maybeNFTBalance = useBalanceOf(account);
  const nftBalance = maybeNFTBalance && maybeNFTBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, nftBalance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  
  
  const getTierForAmount = (amount) => {
    return amount < 33 ? "cypress" : amount < 66 ? "araucaria" : "sequoia";
  };
  
  const tier = getTierForAmount(amount);
  const flavorText = FLAVOR_TEXT[tier]; 
  
  const { donateTx , donationEvents, requestDonationToWallet } = useDonation();
    
  const alreadyDonated = donateTx.status=="Success" || tokenId > 0;
  // TODO: remove this debugging effect
  useEffect(() => {
    if (error) {
      console.log(`error!! fix this:`, error);
    }
  }, [error]);
  useEffect(() => {
    const redirectDelayMS = 2000;
    if (donationEvents) {
      const tokenId = donationEvents[0].args[2].toNumber();
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      setTimeout(() => {
        Router.push(`/donation/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [donationEvents]);
  
  return (
    <Layout>
      <section className="hero-v1-area">
        <div className="container">
          <div className="hero-v1-wrapper">
            <div className="hero-v1-thumb">
              <img src={`assets/img/donation/${tier}.jpg`} className="banner-image" />
              <p>“{flavorText}”</p>
            </div>
            <div className="hero-v1-content">
              <div className="shape">
                <img src="assets/img/shape/stamp.png" alt="shape" />
              </div>
              <div className="title">
                <img src="assets/img/logo/hero-logo.svg" alt="logo" />
                <h2>Edition 001: Origin</h2>
              </div>
              {
                alreadyDonated?
                  <ThanksForDonating tokenId={tokenId}/>:
                  donateTx.status == 'Mining'?
                    <PendingDonation {...{donateTx}} />:
                    <DonationControls {...{amount, setAmount, tier, alreadyDonated, donateTx, requestDonationToWallet}}/>
              }
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default IndexPage;
