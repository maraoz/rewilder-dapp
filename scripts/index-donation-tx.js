const {ethers} = require("hardhat");

const indexDonation = require("./lib/index-donation");

async function main() {
  const txid = "0xc7495c4d762db9d1d8c1f2e4b3843624a8bfead3f88e415fe6ee6c0d4a26ea17";

  const receipt = await ethers.provider.getTransactionReceipt(txid);
  let abi = [ "event DonationReceived(address indexed donor, uint256 value, uint256 indexed tokenID)" ];
  let iface = new ethers.utils.Interface(abi);
  let log = iface.parseLog(receipt.logs[1]);
  const {donor, value: amount, tokenID} = log.args;
  await indexDonation(donor, amount, tokenID, txid);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });