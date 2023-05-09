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
import { useToken, useUpdatesForToken } from "../../lib/db";
import truncateHash from "../../lib/truncateHash";
import RewilderIdenticon from "../../components/RewilderIdenticon";

function DonationPage() {
  const router = useRouter();
  const { account } = useEthers();
  
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
  const youText = !isLoading && (isDonor?'You':truncateHash(attributes["donor"]));
  const yourText = !isLoading && (isDonor?'your':'their');
  const youOrDonor = !isLoading && (isDonor?'your':(truncateHash(attributes["donor"])+'\'s'));
  const thanksText = !isLoading && (isDonor?' - thank you so much! -':'');
  const creationDate = !isLoading && new Date(updateList[updateList.length-1].timestamp).toLocaleDateString(undefined, dateOptions);
  const parcelImageSrc = "/assets/img/2023-project/parcels/"+tokenId+".jpg"
  const MAY2023UPDATE_ID = 1;

  data.name = 'Cerro Negro Donation #'+tokenId;

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
                <span>Donation #{tokenId}</span>
                <span> - </span>
                <span>Tier: {attributes.tier}</span>
                <h2>{data.name}</h2>
              </div>
              <div className="info-container">
                <div className="flex">
                  <DonationInfo 
                    icon={<RewilderIdenticon size={24} account={attributes["donor"] || '0x0000000000000000000000000000000000000000'} />}
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
                    data={<>
                    <a href="https://www.google.com/maps/place/34%C2%B023'48.5%22S+54%C2%B028'23.7%22W/@-34.3970014,-54.4768913,1198m/data=!3m1!1e3!4m10!1m5!3m4!2zMzTCsDIzJzQ4LjUiUyA1NMKwMjgnMjMuNyJX!8m2!3d-34.396808!4d-54.473258!3m3!8m2!3d-34.396808!4d-54.473258" target="_blank">
                    Rocha, Uruguay
                    </a> 
                  </>}
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
                    key={new Date("9 May 2023").getTime()}
                    icon="/assets/img/icon/pin.svg"
                    iconalt="pin"
                    date={new Date("9 May 2023").toLocaleDateString(undefined, dateOptions)}
                    message={<>
                      {youOrDonor.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})} parcel allocation. {" "}
                      <div className="updates-images">
                        <a href={parcelImageSrc} target="_blank"><img src={parcelImageSrc}></img></a> 
                        <a href="/assets/img/2023-project/visit-a-full.jpg" target="_blank"><img src="/assets/img/2023-project/visit-a.jpg"></img></a>
                      </div>
                      </>}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("8 May 2023").getTime()}
                    icon="/assets/img/icon/sign.svg"
                    iconalt="signs deed title."
                    date={new Date("8 May 2023").toLocaleDateString(undefined, dateOptions)}
                    message={<>
                      Signing of the deed title between AMBÁ and previous owner. {" "}
                      <div className="updates-images">
                        <a href="/assets/img/2023-project/002-full.jpg" target="_blank"><img src="/assets/img/2023-project/002.jpg"></img></a> 
                      </div>
                      </>}
                    />
              }
              { updateList && updateList.length > MAY2023UPDATE_ID &&
                  <DonationUpdate
                    className="fade-in"
                    key={new Date("9 Feb 2023").getTime()}
                    icon="/assets/img/icon/sign.svg"
                    iconalt="signs land purchase agreement"
                    date={new Date("9 Feb 2023").toLocaleDateString(undefined, dateOptions)}
                    message={<>
                      AMBÁ signs land purchase offer. {" "}
                      <div className="updates-images">
                        <a href="/assets/img/2023-project/001-full.jpg" target="_blank"><img src="/assets/img/2023-project/001.jpg"></img></a> 
                      </div>
                      </>}
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
                      <a href="https://drive.google.com/file/d/1jhQXBrAX-LMxzpDcuM8fH7Uo9efMwm2A/view?usp=sharing" target="_blank">
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a> 
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
                    message={"Converted USDC to USD in Rewilder's bank account."}
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
                          Rewilder sold ETH for USDC. 
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
        
          <div class="map">
            {/* Logo */}
            <img className="donation-logo" src="/assets/img/logo/logo.svg" alt="logo"/>
            {/* Interactive map */}
            <svg viewBox="0 0 312 794" xmlns="http://www.w3.org/2000/svg">
              <Link href="/donation/1" className={tokenId==1?"selected":""}>
                <path d="M165.729 190.293L169.009 170.574L166.293 160.591L160.13 147.524L144.274 142.07L130.797 149.841L134.598 156.367L131.326 173.508L154.743 186.807L165.729 190.293Z" />
              </Link>
              <Link href="/donation/2" className={tokenId==2?"selected":""}>
                <path d="M123.103 175.287L131.41 173.542L134.683 156.399L126.786 142.839L113.378 138.307L108.119 132.863L101.955 179.321L119.395 181.182L123.103 175.287Z" />
              </Link>
              <Link href="/donation/3" className={tokenId==3?"selected":""}>
                <path d="M264.093 170.747L267.378 190.594L294.258 196.289L297.312 198.405L293.891 151.481L293.054 151.09L273.654 154.391L264.093 170.747Z" />
              </Link>
              <Link href="/donation/4" className={tokenId==4?"selected":""}>
                <path d="M267.352 190.66L254.3 196.323L257.674 219.414L270.591 215.267L286.435 223.873L297.763 220.716L298.922 221.293L297.255 198.464L294.205 196.35L267.352 190.66Z" />
              </Link>
              <Link href="/donation/5" className={tokenId==5?"selected":""}>
                <path d="M150.977 648.725L132.448 658.936L134.76 688.67L124.977 706.554L125.261 717.971C165.436 731.193 199.866 742.572 200.12 742.815C200.735 743.403 199.812 729.022 199.812 729.022C200.687 727.172 201.923 725.433 203.323 723.685L175.069 707.012L169.929 696.758L175.486 671.409L160.097 652.518L150.977 648.725Z" />
              </Link>
              <Link href="/donation/6" className={tokenId==6?"selected":""}>
                <path d="M230.973 211.635L237.74 220.277L245.344 223.456L257.739 219.472L254.363 196.369L244.584 186.98L228.735 184.105L219.641 193.317L219.561 194.382L218.731 205.214L230.973 211.635Z" />
              </Link>
              <Link href="/donation/7" className={tokenId==7?"selected":""}>
                <path d="M245.334 223.516L237.732 220.337L230.967 211.697L218.728 205.277L210.012 206.758L197.223 209.597L198.107 227.874L221.842 232.919L235.693 248.35L247.248 234.029L245.334 223.516Z" />
              </Link>
              <Link href="/donation/8" className={tokenId==8?"selected":""}>
                <path d="M224.372 299.964L212.104 292.311L206.622 283.918L196.58 280.982L185.438 290.509L186.647 301.441L194.698 316.452L204.127 320.955L214.223 322.919L229.966 322.614L224.372 299.964Z" />
              </Link>
              <Link href="/donation/9" className={tokenId==9?"selected":""}>
                <path d="M258.031 301.021L248.605 289.93L240.5 286.814L224.294 299.927L229.892 322.588L234.32 329.796L245.589 333.464L257.765 327.799L255.914 308.985L258.031 301.021Z" />
              </Link>
              <Link href="/donation/10" className={tokenId==10?"selected":""}>
                <path d="M285.062 315.697L296.678 309.938L286.133 297.393L273.531 301.095L257.953 300.984L255.836 308.944L257.686 327.749L263.878 331.917L277.362 336.753L285.191 321.467L285.062 315.697Z" />
              </Link>
              <Link href="/donation/11" className={tokenId==11?"selected":""}>
                <path d="M126.691 142.69L130.782 149.716L144.249 141.951L160.093 147.4L166.251 160.457L168.965 170.432L165.688 190.136L169.049 191.199L184.523 195.864L197.381 209.437L210.168 206.599L218.882 205.119L219.712 194.292L219.791 193.227L228.882 184.02L244.725 186.894L254.5 196.278L267.553 190.615L264.27 170.786L273.822 154.446L293.203 151.148L116.617 68.041L108.043 132.723L113.297 138.162L126.691 142.69Z" />
              </Link>
              <Link href="/donation/12" className={tokenId==12?"selected":""}>
                <path d="M277.279 380.149L268.119 376.517L252.973 376.811L240.649 362.647L222.004 353.844L209.927 359.321L196.549 390.082L207.151 397.251L198.878 426.517L216.227 424.241L228.537 434.235C232.441 426.729 238.559 419.446 241.219 416.284C244.498 412.383 251.5 400.89 254.589 395.634L283.238 392.642L283.497 391.831L277.274 380.159L277.279 380.149Z" />
              </Link>
              <Link href="/donation/13" className={tokenId==13?"selected":""}>
                <path d="M308 348.854L304.621 348.474L296.558 344.502L280.356 342.764L277.304 336.835L263.821 331.999L257.63 327.832L245.463 333.494L250.919 353.165L240.64 362.528L252.964 376.692L268.11 376.399L277.269 380.03L283.98 392.619L310.976 389.615L308 348.854Z" />
              </Link>
              <Link href="/donation/14" className={tokenId==14?"selected":""}>
                <path d="M198.456 460.589L188.836 445.009L198.927 426.83L167.409 404.561L152.428 405.1L140.697 409.502L117.7 408.565L109.565 397.182L96.7474 384.283L74.3357 384.718L71.9826 402.475L33.7695 550.422L46.085 550.521L61.7985 566.119L86.9402 578.222L94.6503 557.404L121.649 539.244L134.091 546.692L148.672 519.641L171.608 520.18L186.042 530.279L214.353 537.546C216.728 532.337 220.442 525.836 221.977 521.322C224.236 514.681 221.269 516.538 225.287 508.063C229.305 499.589 236.599 503.046 236.358 492.255C236.116 481.464 230.039 478.583 229.878 471.389L229.729 464.739L223.322 462.066L198.46 460.594L198.456 460.589Z" />
              </Link>
              <Link href="/donation/15" className={tokenId==15?"selected":""}>
                <path d="M285.015 315.691L285.145 321.463L277.312 336.756L280.365 342.688L296.576 344.426L304.642 348.4L308.024 348.78L305.391 312.69L296.637 309.93L285.015 315.691Z" />
              </Link>
              <Link href="/donation/16" className={tokenId==16?"selected":""}>
                <path d="M229.867 322.65L214.12 322.956L222.084 353.761L240.734 362.567L251.016 353.2L245.558 333.524L234.294 329.857L229.867 322.65Z" />
              </Link>
              <Link href="/donation/17" className={tokenId==17?"selected":""}>
                <path d="M108.781 367.437L107.289 357.723L90.6878 346.094L79.0485 350.697L74.5537 384.57L96.9752 384.135L108.781 367.437Z" />
              </Link>
              <Link href="/donation/18" className={tokenId==18?"selected":""}>
                <path d="M168.089 388.101L167.423 404.339L198.95 426.613L207.225 397.344L184.587 382.035L168.089 388.101Z" />
              </Link>
              <Link href="/donation/19" className={tokenId==19?"selected":""}>
                <path d="M198.854 426.647L188.762 444.827L198.382 460.409L223.246 461.881L229.653 464.555L229.601 462.213C229.373 452.02 225.26 456.299 225.032 446.107C224.952 442.533 226.416 438.413 228.521 434.357L216.209 424.361L198.859 426.638L198.854 426.647Z" />
              </Link>
              <Link href="/donation/20" className={tokenId==20?"selected":""}>
                <path d="M168.506 560.241L172.055 546.378L185.901 530.348L171.471 520.248L148.54 519.709L133.963 546.751L143.772 552.622L168.506 560.241Z" />
              </Link>
              <Link href="/donation/21" className={tokenId==21?"selected":""}>
                <path d="M286.383 223.979L270.525 215.365L245.196 223.502L247.111 234.022L235.548 248.352L232.197 273.286L240.504 286.719L248.609 289.834L258.035 300.926L273.622 301.036L286.232 297.332L296.782 309.883L305.537 312.643L298.881 221.397L297.72 220.82L286.383 223.979Z" />
              </Link>
              <Link href="/donation/22" className={tokenId==22?"selected":""}>
                <path d="M171.994 546.357L168.445 560.223L201.982 570.554C204.998 566.673 208.105 562.457 209.413 559.991C212.3 554.538 211.564 548.556 212.059 543.749C212.217 542.209 213.038 540.042 214.159 537.594L185.851 530.328L172.004 546.361L171.994 546.357Z" />
              </Link>
              <Link href="/donation/23" className={tokenId==23?"selected":""}>
                <path d="M130.842 574.458L143.802 552.73L121.556 539.416L94.567 557.571L86.8594 578.378L113.556 580.746L130.842 574.458Z" />
              </Link>
              <Link href="/donation/24" className={tokenId==24?"selected":""}>
                <path d="M61.8153 566.418L46.0971 550.816L33.7827 550.717L22.084 595.999L49.18 596.955L61.8153 566.418Z" />
              </Link>
              <Link href="/donation/25" className={tokenId==25?"selected":""}>
                <path d="M213.742 673.211L175.421 671.371L169.865 696.717L175.004 706.97L203.255 723.642C205.73 720.561 208.741 717.457 211.295 713.709C212.975 711.24 214.456 708.493 215.456 705.277C216.329 702.462 216.805 698.713 216.883 694.62C217.025 687.512 215.972 679.359 213.737 673.211L213.742 673.211Z" />
              </Link>
              <Link href="/donation/26" className={tokenId==26?"selected":""}>
                <path d="M115.638 285.039L130.267 294.748L153.101 289.391L186.806 301.377L185.598 290.448L196.737 280.924L206.778 283.858L212.258 292.25L224.525 299.901L240.717 286.798L232.416 273.374L235.765 248.457L221.914 233.027L198.18 227.983L197.296 209.706L184.437 196.131L168.961 191.465L154.621 186.918L131.219 173.627L122.919 175.371L119.215 181.261L101.79 179.402L88.0552 283.002L99.4932 287.254L115.638 285.039Z" />
              </Link>
              <Link href="/donation/27" className={tokenId==27?"selected":""}>
                <path d="M107.222 357.605L108.713 367.317L96.9106 384.009L109.728 396.907L117.861 408.283L140.856 409.22L152.59 404.818L167.57 404.279L168.236 388.047L184.728 381.983L196.757 390.118L210.134 359.359L222.211 353.882L214.249 323.087L204.154 321.123L194.727 316.621L186.676 301.611L152.97 289.624L130.134 294.981L115.504 285.272L99.3579 287.487L87.9192 283.234L78.9897 350.582L90.6253 345.98L107.222 357.605Z" />
              </Link>
              <Link href="/donation/28" className={tokenId==28?"selected":""}>
                <path d="M143.683 552.777L130.714 574.517L113.426 580.807L86.7154 578.439L84.0928 599.485L100.296 614.507L104.073 646.272L132.6 658.825L151.121 648.617L160.238 652.409L175.62 671.294L213.932 673.133C212.489 669.164 210.552 666.025 208.121 664.554C188.284 652.521 190.827 647.632 194.216 641.11L194.36 640.83C197.817 634.166 194.797 579.647 194.797 579.647C194.797 579.647 198.313 575.437 201.965 570.737L143.688 552.782L143.683 552.777Z" />
              </Link>
              <Link href="/donation/29" className={tokenId==29?"selected":""}>
                <path d="M135.022 688.731L132.711 659.001L104.175 646.445L100.398 614.671L84.1897 599.645L86.8131 578.592L61.6643 566.486L49.0292 597.027L21.9336 596.071L1 677.142C1 677.142 68.9558 699.414 125.524 718.03L125.241 706.614L135.022 688.731Z" />
              </Link>
            </svg>
            {/* Legal footer */}
            {/* <div className="footer donation-page">
              <p>© Rewilder Foundation, Inc.  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/terms-and-conditions">Terms of Service</a>  -  <a target="_blank" href="https://docs.rewilder.xyz/legal/privacy-policy">Privacy</a></p>
            </div> */}
          </div>
          
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
import { Link } from "@chakra-ui/react";

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
