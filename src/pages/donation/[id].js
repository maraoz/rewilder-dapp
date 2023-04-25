import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { getExplorerTransactionLink, useEthers } from "@usedapp/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import DonationUpdate from "../../components/DonationUpdate";
import DonationInfo from "../../components/DonationInfo";
import Head from "../../components/Head";
import config from "../../config";
import { addressFor } from "../../lib/addresses";
import useStoredState  from "../../lib/storedState";
import { useToken, useUpdatesForToken } from "../../lib/db";
import truncateHash from "../../lib/truncateHash";
import RewilderIdenticon from "../../components/RewilderIdenticon";

function DonationPage() {
  const router = useRouter();
  const { account } = useEthers();
  const [taxInfoDismissed, setTaxInfoDismissed] = useStoredState(false, "info.tax.dismissed");
  const [taxInfoShown, setTaxInfoShown] = useStoredState(false, "info.tax.shown");
  const [futureUpdatesInfoDismissed, setFutureUpdatesInfoDismissed] = useStoredState(false, "info.updates.dismissed");
  const [futureUpdatesInfoShown, setFutureUpdatesInfoShown] = useStoredState(false, "info.updates.shown");
  
  const tokenId = router.query.id;
  let data = {};
  const { data: tokenData, status } = useToken(tokenId);
  const { data: updates, status: updatesStatus} = useUpdatesForToken(tokenId);

  const isLoading = (status == 'loading' || updatesStatus == 'loading') ||
    ((tokenData == null || updates == null))
  const attributes = {};

  if (!isLoading) {
    tokenData.attributes.map(({trait_type, value}) => { attributes[trait_type] = value;});
    data = tokenData;
  } else {
    // loading placeholder data
    data = {
      "name": "Loading...",
      "image": `/assets/img/donation/cypress-web.jpg`,
    }
    attributes["flavor"] = "Loading...";
    attributes["amount"] = "...";
    attributes["tier"] = "loading...";
    attributes["donor"] = "...";
  }
  const openseaURL = "https://" + 
    (config.networkName=='mainnet'?'':'testnets.')+
    'opensea.io/assets/'+addressFor("RewilderNFT")+
    "/"+tokenId;
  
  const imageSource = `/assets/img/donation/${attributes.tier}-web.jpg`;

  const parseUpdates = (updates) => {
    if (!updates) return [];
    return Object.keys(updates)
      .filter((key)=> key != 'id' )
      .map((i) => updates[i])
      .reverse();
  };
  const updateList = parseUpdates(updates);
  const dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
  
  const isDonor = !isLoading && account == attributes["donor"];
  const youLongText = !isLoading && (isDonor?'You':attributes["donor"]);
  const youText = !isLoading && (isDonor?'You':truncateHash(attributes["donor"]));
  const yourText = !isLoading && (isDonor?'your':'their');
  const thanksText = !isLoading && (isDonor?' - thank you so much! -':'');
  const creationDate = !isLoading && new Date(updateList[updateList.length-1].timestamp).toLocaleDateString(undefined, dateOptions);
  const MAY2023UPDATE_ID = 2;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFutureUpdatesInfoShown(true);
    }, 3000);
    const timer2 = setTimeout(() => {
      setTaxInfoShown(true);
    }, 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2)
    };
  }, []);

  return (
    <>
      <Head { ...{ title: data.name } } />
      <div className="noise"></div>    
      <div className="description-area">
        <div className="description-wrapper">
          {/* Donation Updates */}
          <div className="donation">
            <div className="header">
              <img src={isLoading?"/assets/img/shape/stamp_blank.svg":("/assets/img/shape/stamp-" + attributes.tier + ".svg")} alt={attributes.tier + " stamp"} className="stamp"/>
              <div className="title">
                <span>Tier: {attributes.tier}</span>
                <h2>{data.name}</h2>
              </div>
              <div className="info-container">
                <div className="flex">
                  <DonationInfo 
                    icon={<RewilderIdenticon size={24} account={attributes["donor"]} />}
                    label="donor"
                    data={youText}
                    />
                  <DonationInfo 
                    icon={<img src="/assets/img/icon/donation.svg" alt="donation"/>}
                    label="donation"
                    data={attributes["amount"]}
                    />
                </div>
                <div className="flex">
                <DonationInfo 
                    icon={<img src="/assets/img/icon/location.svg" alt="location"/>}
                    label="location"
                    data="Rocha, Uruguay"
                    />
                  <DonationInfo 
                    icon={<img src="/assets/img/icon/rewilder-logo.svg" alt="rewilding"/>}
                    label="rewilding"
                    data={"~"+(parseInt(attributes["amount"])*0.5)+" hectares"}
                    />
                </div>
              </div>
            </div>
          
            <h5>Updates</h5>
            <div className="updates">
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("2 May 2023").getTime()}
                    icon="/assets/img/icon/pin.svg"
                    iconalt="pin"
                    date={new Date("2 May 2023").toLocaleDateString(undefined, dateOptions)}
                    message={"Your parcel allocation."}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("1 May 2023").getTime()}
                    icon="/assets/img/icon/sign.svg"
                    iconalt="signs deed title"
                    date={new Date("1 May 2023").toLocaleDateString(undefined, dateOptions)}
                    message={"Signing of the deed title."}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("9 Feb 2023").getTime()}
                    icon="/assets/img/icon/sign.svg"
                    iconalt="signs land purchase agreement"
                    date={new Date("9 Feb 2023").toLocaleDateString(undefined, dateOptions)}
                    message={"AMBÁ signs land purchase agreement."}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("30 Jan 2023").getTime()}
                    icon="/assets/img/icon/out.svg"
                    iconalt="outgoing transaction"
                    date={new Date("30 Jan 2023").toLocaleDateString(undefined, dateOptions)}
                    message={"USD sent to AMBÁ for land purchase."}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("28 Jan 2023").getTime()}
                    icon="/assets/img/icon/sign.svg"
                    iconalt="sign contract with AMBA"
                    date={new Date("28 Jan 2023").toLocaleDateString(undefined, dateOptions)}
                    message={<>
                      Signed contract with {" "}
                      <a href="https://amba.org.uy/en/" target="_blank">AMBÁ</a>,
                      our local rewilding partner in Uruguay.
                      </>}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("25 Jan 2023").getTime()}
                    icon="/assets/img/icon/swap.svg"
                    iconalt="swap"
                    date={new Date("25 Jan 2023").toLocaleDateString(undefined, dateOptions)}
                    message={"Converted USDC to USD in Rewilder bank account."}
                    />
              }
              { updateList && updateList.length > 0 && updateList.map((update) => {
                  if (update.type == 'creation') {
                    return <DonationUpdate 
                      className="fade-in"
                      key={update.timestamp}
                      icon="/assets/img/icon/in.svg"
                      iconalt="creation"
                      date={creationDate}
                      message={
                        <>
                          {youText} donated {attributes["amount"]} {" "}
                          <a href={getExplorerTransactionLink(update.info.txid, config.chainId)??"#"} target="_blank">
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </a> 
                          {thanksText}
                          <br />
                          and minted {yourText} unique NFT donation receipt{" "}
                          <a href={openseaURL} target="_blank">
                            <FontAwesomeIcon className="icon-color" icon={faExternalLinkAlt} />
                          </a>
                        </>
                      }>
                      </DonationUpdate>
                  }
                  if (update.type == 'eth-sale') {
                    return <DonationUpdate 
                      className="fade-in"
                      key={update.timestamp}
                      icon="/assets/img/icon/swap.svg"
                      iconalt="eth sale"
                      date={new Date(update.timestamp).toLocaleDateString(undefined, dateOptions)}
                      message={
                        <>
                          Rewilder sold donated ETH for USDC. 
                          <a href={getExplorerTransactionLink(update.info.txid, config.chainId)??"#"} target="_blank">
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </a> 
                        </>
                      }>
                      </DonationUpdate>
                  }
                  return <></>
                })
              }
            </div>
          </div>

          {/* Map */}
          <div className="nft">
            <div className="donation-logo">
              <img src="/assets/img/logo/logo.svg" alt="logo"/>
            </div>
            
          </div>
        </div>
        <div className="footer text-center donation-page">
          <p>© Rewilder Foundation, Inc.  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/terms-and-conditions">Terms of Service</a>  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/privacy-policy">Privacy</a></p>
        </div>
      </div>
      
    </>
  );
}
export default DonationPage;


import {
  getToken as getTokenServer,
  getAllTokens as getAllTokensServer,
  getUpdatesForToken as getUpdatesForTokenServer,
} from "../../lib/server/db";

// Pre-render pages at build-time
export async function getStaticProps(context) {
  const { id } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`${id}`], () => getTokenServer(id));
  await queryClient.prefetchQuery([`updates/${id}`], () => getUpdatesForTokenServer(id))

  return {
    props: {
      reactQueryState: dehydrate(queryClient),
    },
  };
}
// Generates routes for all pages we want to pre-render
export async function getStaticPaths() {
  // Get all tokens
  const tokens = await getAllTokensServer();
  // Generate page path params for all tokens
  const paths = tokens.map((token) => ({
    params: { id: token.id },
  }));
  return {
    paths,
    // Server-render on demand if page does't exist yet
    fallback: "blocking",
  };
}
