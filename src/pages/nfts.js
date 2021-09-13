import React, { useState, useEffect } from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import NextLink from "next/link";
import { Link, List, ListItem, Button } from "@chakra-ui/react";
import Layout from "./../components/Layout";
import { useAllTokens } from "./../lib/db";
import { getAllTokens as getAllTokensServer } from "./../lib/server/db";

function AllPage() {
  const { data, status, error } = useAllTokens();
  
  return (
    <Layout>
      All tokens from database:
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <List>
            {data.map((token) => (
              <ListItem key={token.id}>
                <NextLink href={`/nft/${token.id}`} passHref>
                  <Link color="teal.500">{token.name}</Link>
                </NextLink> - 
                <NextLink href={`/api/v1/${token.id}`} passHref>
                  <Link color="teal.500"> API</Link>
                </NextLink>

              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Layout>
  );
}

// Pre-render pages at build-time
export async function getStaticProps(context) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["tokens"], () => getAllTokensServer());

  return {
    props: {
      reactQueryState: dehydrate(queryClient),
    },
  };
}

export default AllPage;
