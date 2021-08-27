import { Box, Button, Divider, Input, Text } from "@chakra-ui/react";
import { ChainId, useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import React from "react";
import Layout from "./../components/Layout";
import { useItem } from "./../lib/db";

function IndexPage() {
  // Subscribe to data
  const { data, status, error } = useItem("2auVGLqbXx8mt04Wg4xk");

  return (
    <Layout>
      Data fetch test:
      <div style={{ marginBottom: "2rem" }}>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
      Start building Rewilder UI here ...
    </Layout>
  );
}

export default IndexPage;
