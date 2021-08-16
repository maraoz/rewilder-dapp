const hre = require("hardhat");

async function main () {
  const accounts = await ethers.provider.listAccounts();
  const address = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
  const Box = await ethers.getContractFactory('Box');
  const box = await Box.attach(address);
  await box.store(50);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });