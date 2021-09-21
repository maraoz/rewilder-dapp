const {ethers} = require("hardhat");

const indexDonation = require("./lib/index-donation");

async function main() {
  const txid = "0x6e2061e70be72f2065640b6a2c4751220b89f35c767e4e1f66a8b17a46d7b601";

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
