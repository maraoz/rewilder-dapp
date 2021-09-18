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
import { useToken } from "./../../lib/db";
import {
  getToken as getTokenServer,
  getAllTokens as getAllTokensServer,
} from "./../../lib/server/db";

function NftPage(props) {
  const router = useRouter();

  const tokenId = router.query.id;
  const { data, status } = useToken(tokenId);
  console.log(data.attributes);
  const attributes = {};
  data.attributes.map(({trait_type, value}) => { attributes[trait_type] = value;});
  console.log(attributes);
  const openseaURL = "https://" + 
    (config.networkName=='mainnet'?'':'testnets.')+
    'opensea.io/assets/'+addressFor("RewilderNFT")+
    "/"+tokenId;

  return (
    <>
      <Head { ...{ title: data.name } } />
      <div
        {...(data && {
          title: data.name,
          image: data.image,
        })}
      >

      <section className="window-section">
        <div className="container-fluid">
          <div className="row min-vh-100 align-items-center mb-2 mb-sm-0">
            <div className="col-md-6 text-center">
              <div className="header-sticky">
                <div className="text-center">
                  <a className="navbar-brand" href="#">
                    <img src="/assets/images/logo/logo-full-white.svg" alt="Logo not found" height="18"/>
                  </a>
                </div>
              </div>

              <div>
                <img src="/assets/images/stamp.svg" height="446" width="390" alt="" className="stamp"/>
                <p className="mt-3 mt-sm-5 sticky-banner-text">“{attributes["flavor text"]}”</p>
              </div>

              <div className="footer-sticky d-none d-sm-block">
                <div className="text-center">
                  © Rewilder   -  Terms of use  -  Privacy
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="notification">
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <h2 className="fs-14 font-bold color-green">Tier: {attributes.tier}</h2>
                    <h2 className="mt-2 text-header">{data.name}</h2>
                  </div>
                  <div>
                    <img src="/assets/images/icon/sticky-corner-logo.svg" alt={attributes.tier + " stamp"} width="90"/>
                  </div>
                </div>
                
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
                <DonationInfo 
                  image="/assets/images/icon/amount-icon.svg"
                  label="donor"
                  data={attributes["donor"]}
                />
              
                <hr className="hr-sticky "></hr>

                <h4 className="fs-16 font-bold color-white mt-5 mb-2">Updates</h4>
                <DonationUpdate 
                  icon="/assets/images/icon/avatar-icon.svg"
                  iconalt="alt name"
                  date="Aug 15, 2021" 
                  message={<>
                    You donated {attributes["amount donated"]}. 
                    <a href={getExplorerTransactionLink(attributes["mint transaction"], config.chainId)??"#"} target="_blank">
                      <FontAwesomeIcon className="icon-color" icon={faExternalLinkAlt} />
                    </a>
                    <br />
                    Your unique NFT is yours.
                    <a href={openseaURL} target="_blank">
                      <FontAwesomeIcon className="icon-color" icon={faExternalLinkAlt} />
                    </a>
                  </>}
                />
                <DonationUpdate 
                  icon="/assets/images/icon/info.svg"
                  iconalt="alt name"
                  date="Aug 15, 2021" 
                  message="You will be able to see future updates about your donation here (for example, when we buy the land or make a payment)."
                  linkText="Subscribe here to also receive email notifications."
                  linkHref="https://rewilder.substack.com"
                />
              </div>
            </div>
          </div>

          <div className="footer d-sm-none">
            <div className="text-center">
              © Rewilder   -  Terms of use  -  Privacy
            </div>
          </div>

        </div>

      </section>
      </div>
    </>
  );
}

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

export default NftPage;

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
