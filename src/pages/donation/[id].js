import React from "react";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import DonationUpdate from "../../components/DonationUpdate";
import DonationInfo from "../../components/DonationInfo";
import Head from "../../components/Head";
import config from "../../config";
import { addressFor } from "../../lib/addresses";
import { getExplorerTransactionLink } from "@usedapp/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useToken } from "../../lib/db";
import {
  getToken as getTokenServer,
  getAllTokens as getAllTokensServer,
} from "../../lib/server/db";

function DonationPage(props) {
  const router = useRouter();

  const tokenId = router.query.id;
  const { data, status } = useToken(tokenId);
  const attributes = {};
  if (status == 'loading') {
    return "";
  }
  data.attributes.map(({trait_type, value}) => { attributes[trait_type] = value;});
  const openseaURL = "https://" + 
    (config.networkName=='mainnet'?'':'testnets.')+
    'opensea.io/assets/'+addressFor("RewilderNFT")+
    "/"+tokenId;
  // const imageSource = data.image;
  // TODO: use above in production
  const imageSource = `/assets/img/donation/${attributes.tier}.jpg`

  return (
    <>
      <Head { ...{ title: data.name } } />
      <div className="description-area">
        <div className="container-fluid">
          <div className="description-wrapper">
            <div className="description-thumbnial">
              <div className="donation-logo">
                <img src="/assets/img/logo/logo.svg" alt="logo"/>
              </div>
              <div className="thumb">
                <img src={imageSource} className="nft-image" alt="nft"/>
                <img src="/assets/images/stamp.svg" height="446" width="390" alt="decorative stamp frame" className="frame"/>
                <figcaption>“{attributes["flavor text"]}”</figcaption>
              </div>
            </div>

            <div className="donation">
              <div className="header">
                <img src={"/assets/img/stamp_" + attributes.tier + ".svg"} alt={attributes.tier + " stamp"} className="stamp"/>
                <div className="title">
                  <span>Tier: {attributes.tier}</span>
                  <h2>{data.name}</h2>
                </div>
                <div className="info-container">
                  <div className="flex">
                    <DonationInfo 
                      image="/assets/images/icon/donation.svg"
                      label="donation"
                      data={attributes["amount donated"]}
                    />
                    <DonationInfo 
                      image="/assets/images/icon/rewilder-logo.svg"
                      label="rewilding"
                      data="Location TBD"
                    />
                  </div>
                  <DonationInfo 
                    image="/assets/images/icon/amount-icon.svg"
                    label="donor"
                    data={attributes["donor"]}
                  />
                </div>
              </div>
            
              <div className="updates">
                <h5>Updates</h5>
                <DonationUpdate 
                  icon="/assets/images/icon/info.svg"
                  iconalt="alt name"
                  date="Aug 15, 2021" 
                  message="If you want your donation to be 501(c)(3) tax deductible, send us an email to "
                  linkText="receipts@rewilder.xyz"
                  linkHref="#"
                />
                <DonationUpdate 
                  icon="/assets/images/icon/info.svg"
                  iconalt="alt name"
                  date="Aug 15, 2021" 
                  message="You will be able to see future updates about your donation here (for example, when we buy the land or make a payment)."
                  linkText="Subscribe here to also receive email notifications."
                  linkHref="https://rewilder.substack.com"
                />
                <DonationUpdate 
                  icon="/assets/images/icon/avatar-icon.svg"
                  iconalt="alt name"
                  date="Aug 15, 2021" 
                  message={<>
                    You donated {attributes["amount donated"]} {" "}
                    <a href={getExplorerTransactionLink(attributes["mint transaction"], config.chainId)??"#"} target="_blank">
                      <FontAwesomeIcon className="icon-color" icon={faExternalLinkAlt} />
                    </a>
                    <br />
                    Your unique NFT is yours {" "}
                    <a href={openseaURL} target="_blank">
                      <FontAwesomeIcon className="icon-color" icon={faExternalLinkAlt} />
                    </a>
                  </>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default DonationPage;

// Pre-render pages at build-time
export async function getStaticProps(context) {
  const { id } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["token", { id }], () => getTokenServer(id));

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
    // TODO: Not sure if "blocking" is supported by Netlify, but not a big deal since client-side will
    // still take over and fetch data from `/api/token`.
    fallback: "blocking",
  };
}
