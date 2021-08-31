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
  const { data, status, error } = useToken(router.query.id);

  return (
    <Layout
      // Pass head data once it's loaded
      {...(data && {
        title: data.name,
        image: data.image,
      })}
    >
      Token data:
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </Layout>
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
