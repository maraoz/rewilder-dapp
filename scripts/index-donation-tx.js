const {ethers} = require("hardhat");

const processTransaction = require("./lib/process-transaction");

async function main() {
  const txid = "0xe2b62497141b753d73b38a13422093fa70fcae45139f673eba1cb4d992992634";
  
  const tx = await ethers.provider.getTransaction(txid);
  await processTransaction(tx)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });