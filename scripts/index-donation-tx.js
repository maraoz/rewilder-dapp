const {ethers} = require("hardhat");

const indexDonation = require("./lib/index-donation");

async function main() {
  const txid = "0xbf8d07e3f7a0c2e177a864efedb1eaef1f2e6e3cbcc6a7c326a663dca62b9cdb";

  const receipt = await ethers.provider.getTransactionReceipt(txid);
  let abi = [ "event Donation(address indexed donor, uint256 value, uint256 indexed tokenID)" ];
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
