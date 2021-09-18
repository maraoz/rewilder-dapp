import { ethers } from "ethers";
import { useContractCall, useContractFunction } from "@usedapp/core";
import RewilderNFT from "../artifacts/contracts/RewilderNFT.sol/RewilderNFT.json";
import { addressFor } from "./addresses";
const RewilderNFTInterface = new ethers.utils.Interface(RewilderNFT.abi)
const nftAddress = addressFor("RewilderNFT");
// const nft = new ethers.Contract(
//   nftAddress,
//   RewilderNFTInterface,
// );


export function useBalanceOf(address) {
  const [balance] = useContractCall(
    address && {
      abi: RewilderNFTInterface,
      address: nftAddress,
      method: "balanceOf",
      args: [address],
    }
  ) ?? [];
  return balance;
}
export function useTokenOfOwner(address, balance) {
  const [tokenId] = useContractCall(
    address && balance && {
      abi: RewilderNFTInterface,
      address: nftAddress,
      method: "tokenOfOwnerByIndex",
      args: [address, 0],
    }
  ) ?? [];
  return tokenId;
}