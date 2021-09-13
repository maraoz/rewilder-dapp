import React, { useState, useEffect } from "react";
import Router from 'next/router'
import { Link, List, ListItem, Button } from "@chakra-ui/react";
import { useEthers, useContractFunction } from "@usedapp/core";
import Slider from "@material-ui/core/Slider";
import Layout from "./../components/Layout";
import { addressFor } from "../lib/addresses";
import { ethers } from 'ethers';
import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";

function IndexPage() {
  const { account, error, library } = useEthers();
  
  const [amount, setAmount] = useState(1);
  const [walletOpened, setWalletOpened] = useState(false);

  const clamp = (n, lower, upper) => Math.min(Math.max(n, lower), upper);
  
  const RewilderDonationCampaignInterface = new ethers.utils.Interface(RewilderDonationCampaign.abi)
  const campaignAddress = addressFor("RewilderDonationCampaign");
  const campaign = new ethers.Contract(
    campaignAddress,
    RewilderDonationCampaignInterface,
  );
  const { state: donateTx , events, send: requestDonateToWallet } = useContractFunction(campaign, "donate", { transactionName: 'Donate' });

  useEffect(() => {
    if (error) {
      console.log(`error`, error);
    }
  }, [error]);

  useEffect(() => {
    if (events) {
      const tokenId = events[0].args[2].toNumber();
      const redirectDelayMS = 2000;
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      setTimeout(() => {
        Router.push(`/nft/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [events]);
  useEffect(() => {
    if (donateTx.status == 'Exception' || 
        donateTx.status == 'Mining'
        ) {
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

  const getImageIdByAmount = (value) => {
    return value < 33 ? "cypress" : value < 66 ? "araucaria" : "sequoia";
  };

  // call the campaign smart contract, send a donation
  const donate = async () => {
    if (!amount || !account) return;
    const donationAmountWEI = ethers.utils.parseEther(amount.toString());

    if (library) {
      //const signer = library.getSigner();
      //console.log("signer", signer.address, "account", account);
      console.log(`${account} is about to donate`, donationAmountWEI/1e18, "ETH");
      //const transaction = await campaign.connect(signer)
      //        .donate({value: donationAmountWEI});
      //console.log("Transaction sent", transaction.hash);
      //await transaction.wait();
      requestDonateToWallet({value: donationAmountWEI});
      setWalletOpened(true);
    }
  }

  return (
    <Layout>
      <div
        style={{
          marginTop: "3rem",
          border: "1px solid #efefef",
          padding: "1rem 2rem",
          maxWidth: "700px",
        }}
      >
        <div style={{ margin: "1rem 2rem" }}>
          Display <strong>{getImageIdByAmount(amount)}.jpg</strong>
          <Slider
            value={amount}
            min={1}
            step={1}
            max={100}
            marks={[
              {
                value: 1,
                label: "Cypress",
              },
              {
                value: 33,
                label: "Araucaria",
              },
              {
                value: 66,
                label: "Sequoia",
              },
            ]}
            valueLabelDisplay="off"
            onChange={handleSliderChange}
          />
        </div>
        <div style={{ marginTop: "2rem" }}>
          You are donating{" "}
          <input
            style={{ border: "1px solid #efefef" }}
            type="number"
            value={amount}
            onChange={handleInputChange}
          />{" "}
          ETH
        </div>
        <Button mt="2" colorScheme="teal" 
          onClick={donate} 
          isLoading={walletOpened || donateTx.status=="Mining"}
          isDisabled={!account || donateTx.status=="Success"}
        >
            {!account?
              "Please connect wallet":
              donateTx.status=="Success"?
              "✔️":
              "Donate and mint your NFT"
            }
        </Button>
        <div>tx: {donateTx.status}, {donateTx.transaction?donateTx.transaction.hash:"-" }</div>
      </div>
    </Layout>
  );
}

export default IndexPage;
