import React, { useState } from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import NextLink from "next/link";
import { Link, List, ListItem } from "@chakra-ui/react";
import Slider from "@material-ui/core/Slider";
import Layout from "./../components/Layout";
import { useAllTokens } from "./../lib/db";
import { getAllTokens as getAllTokensServer } from "./../lib/server/db";

function IndexPage() {
  const { data, status, error } = useAllTokens();
  const [amount, setAmount] = useState(0);

  const handleSliderChange = (event, newValue) => {
    setAmount(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setAmount(value);
  };

  const getImageIdByAmount = (value) => {
    return value < 33 ? "cypress" : value < 66 ? "araucaria" : "sequoia";
  };

  return (
    <Layout>
      Tokens from database:
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <List>
            {data.map((token) => (
              <ListItem key={token.id}>
                <NextLink href={`/nft/${token.id}`} passHref>
                  <Link color="teal.500">{token.name}</Link>
                </NextLink>
              </ListItem>
            ))}
          </List>
        )}
      </div>
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
            min={0}
            step={1}
            max={100}
            marks={[
              {
                value: 0,
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
            type="text"
            value={amount}
            onChange={handleInputChange}
          />{" "}
          ETH
        </div>
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

export default IndexPage;
