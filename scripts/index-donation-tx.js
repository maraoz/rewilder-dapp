const {ethers} = require("hardhat");

const indexDonation = require("./lib/index-donation");

async function main() {
  
  const receipt = await ethers.provider.getTransactionReceipt("0x0c8300a14a08fffe209dfe5961b3027b1321428184365751b89c4ac6056c28e4");
  let abi = [ "event Donation(address donor, uint256 value, uint256 tokenID)" ];
  let iface = new ethers.utils.Interface(abi);
  let log = iface.parseLog(receipt.logs[1]);
  const {donor, value: amount, tokenID} = log.args;
  await indexDonation(donor, amount, tokenID);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
