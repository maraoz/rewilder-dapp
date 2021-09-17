import React from "react";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import Layout from "./../../components/Layout";
import { useToken } from "./../../lib/db";
import {
  getToken as getTokenServer,
  getAllTokens as getAllTokensServer,
} from "./../../lib/server/db";

function NftPage(props) {
  const router = useRouter();

  // Subscribe to data
  const { data, status } = useToken(router.query.id);

  return (
    <div
      {...(data && {
        title: data.name,
        image: data.image,
      })}
    >
      {/* Token data:
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div> */}

      <section class="window-section">
        <div class="container-fluid">
          <div class="row min-vh-100 align-items-center mb-2 mb-sm-0">
            <div class="col-md-6 text-center">
              <div class="header-sticky">
                <div class="text-center">
                  <a class="navbar-brand" href="#">
                    <img src="/assets/images/logo/logo-full-white.svg" alt="Logo not found" height="18"/>
                  </a>
                </div>
              </div>

              <div class="sticky-banner">
                <img src="/assets/images/stamp.svg" height="446" width="390" alt="" className="stamp"/>
                <p class="mt-3 mt-sm-5 sticky-banner-text">“In the shadow of your roots, I am born again”</p>
              </div>

              <div class="footer-sticky d-none d-sm-block">
                <div class="text-center">
                  © Rewilder   -  Terms of use  -  Privacy
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="notification">
                <div class="d-flex justify-content-between mt-3">
                  <div>
                    <h2 class="fs-14 font-bold color-green">Tier: Sequoia</h2>
                    <h2 class="mt-2 text-header">Edition 001: Origin</h2>
                  </div>
                  <div>
                    <img src="/assets/images/icon/sticky-corner-logo.svg" alt="" width="90" srcset=""/>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6 col-sm-3">
                    <div class="tag d-flex justify-content-start">
                      <div class="icon-donation mr-2">
                        <img src="/assets/images/icon/donation.svg" height="20"/>
                      </div>
                      <div class="content">
                        <h5 class="fs-12 font-bold text">donation</h5>
                        <h3 class="fs-18 font-bold">37.2 ETH</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-5">
                    <div class="tag d-flex justify-content-start">
                      <div class="icon-rewilding mr-2">
                        <img src="/assets/images/icon/rewilder-logo.svg" height="20"/>
                      </div>
                      <div class="content">
                        <h5 class="fs-12 font-bold text">rewilding</h5>
                        <h3 class="fs-18 font-bold">Location TBD</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 mt-4">
                    <div class="tag d-flex justify-content-start">
                      <div class="icon-owner mr-2">
                        <img src="/assets/images/icon/amount-icon.svg" height="20"/>
                      </div>
                      <div class="content">
                        <h5 class="fs-12 font-bold text">owner</h5>
                        <h3 class="fs-18 font-medium d-none d-sm-block">0xeC7100ABDbCf922f975148C6516BC95696cA0eF6</h3>
                        <h3 class="fs-18 font-medium d-sm-none">0xec71...0eF6</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="hr-sticky "></hr>
                <h4 class="fs-16 font-bold color-white mt-5 mb-2">Updates</h4>

                <div class="row">
                  <div class="col-12">
                    <div class="notification-card">
                      <div class="tag d-flex justify-content-start">
                        <div class="icon-avatar mr-2">
                          <img src="/assets/images/icon/avatar-icon.svg" height="20"/>
                        </div>
                        <div class="content">
                          <h5 class="fs-12 font-bold text">Aug 15, 2021</h5>
                          <h3 class="fs-14 font-book">You donated 37.2 ETH. <i class="fas fa-external-link-alt fs-9 color-light"></i></h3>
                          <h3 class="fs-14 font-book">Your unique NFT is yours. <i class="fas fa-external-link-alt fs-9 color-light"></i></h3>
                        </div>
                      </div>
                    </div>
                    <div class="notification-card">
                      <div class="tag d-flex justify-content-start">
                        <div class="icon-avatar mr-2">
                          <img src="/assets/images/icon/info.svg" height="20"/>
                        </div>
                        <div class="content d-flex justify-content-between">
                          <div>
                            <h5 class="fs-12 font-bold text">Aug 15, 2021</h5>
                            <h3 class="fs-14 font-book">You will be able to see future updates about your donation here (for example, when we buy the land or make a payment).</h3>
                            <a href="#">
                              <h3 class="fs-14 font-book color-green text-decoration-underline">Subscribe here to also receive email notifications.</h3>
                            </a>
                          </div>
                          <div>
                            <button class="btn text"><i class="fas fa-times"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer d-sm-none">
            <div class="text-center">
              © Rewilder   -  Terms of use  -  Privacy
            </div>
          </div>

        </div>

      </section>
    </div>
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

export default NftPage;

