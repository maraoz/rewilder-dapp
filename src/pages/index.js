import React, { useState, useEffect } from "react";

import { useEthers } from "@usedapp/core";
import Router from 'next/router'

import { Layout } from "./../components/Layout";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import { useDonation, useCampaignFinalized } from "../lib/rewilderDonationCampaign";
import ThanksForDonating from "../components/ThanksForDonating";
import DonationControls from "../components/DonationControls";
import PendingDonation from "../components/PendingDonation";
import LoadingCampaign from "../components/LoadingCampaign";
import CampaignFinalized from "../components/CampaignFinalized";

import FLAVOR_TEXT from "../lib/flavorText";
import TIER_MARKERS from "../lib/tierMarkers";

function IndexPage() {
  const { account } = useEthers();
  
  const [amount, setAmount] = useState(1);
  const { donateTx , donationEvents, requestDonationToWallet } = useDonation();
  const finalized = useCampaignFinalized();
  
  const maybeNFTBalance = useBalanceOf(account);
  const nftBalance = maybeNFTBalance && maybeNFTBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, nftBalance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  const isLoading = account && (
    maybeNFTBalance === undefined || 
    (nftBalance && maybeTokenId === undefined) ||
    finalized === undefined
    );
  const alreadyDonated = donateTx.status=="Success" || tokenId > 0;

  const getTierForAmount = (amount) => {
    return amount < TIER_MARKERS['araucaria'] ?
      "cypress" :
      amount < TIER_MARKERS['sequoia'] ?
        "araucaria":
        "sequoia";
  };
  
  const tier = getTierForAmount(amount);
  const flavorText = FLAVOR_TEXT[tier]; 
    

  useEffect(() => {
    const redirectDelayMS = 5000;
    if (donationEvents) {
      const tokenId = donationEvents[0].args[2].toNumber();
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      if (tokenId) {
        setTimeout(() => {
          Router.push(`/donation/${tokenId}`);
        }, redirectDelayMS);
      }
    }
  }, [donationEvents]);
  
  return (
    <Layout>
      <div className="container">
        <div className="hero-v1-wrapper">
          <div className="hero-v1-thumb">
            <img src={`assets/img/donation/${tier}.png`} className="banner-image" />
            <p>“{flavorText}”</p>
          </div>
          <div className="hero-v1-content">
            <div className="shape">
              <img src="/assets/img/shape/stamp.png" alt="shape" />
            </div>
            <div className="title">
              <img src="/assets/img/logo/hero-logo.svg" alt="logo" />
              <h2>Edition 001: Origin</h2>
            </div>
            {
              isLoading?
                <LoadingCampaign />:
                finalized?
                <CampaignFinalized tokenId={tokenId}/>:
                  alreadyDonated?
                    <ThanksForDonating tokenId={tokenId}/>:
                    donateTx.status == 'Mining'?
                      <PendingDonation {...{donateTx}} />:
                      <DonationControls {...{amount, setAmount, tier, alreadyDonated, donateTx, requestDonationToWallet}}/>
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;
