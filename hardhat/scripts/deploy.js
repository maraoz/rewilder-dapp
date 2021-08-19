const hre = require("hardhat");
const fs = require("fs");

async function main() {
  fs.unlinkSync(`${hre.config.paths.artifacts}/contracts/contractAddress.js`);

  // greeter
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  saveFrontendFiles(greeter, "Greeter");
  console.log("Greeter deployed to:", greeter.address);

  // box
  const Box = await hre.ethers.getContractFactory("Box");
  console.log("Deploying Box...");
  const box = await Box.deploy();
  await box.deployed();
  saveFrontendFiles(box, "BoxContract");
  console.log("Box deployed to:", box.address);

  // multicall
  const MulticallContract = await hre.ethers.getContractFactory("Multicall");
  const multicallContract = await MulticallContract.deploy();
  await multicallContract.deployed();
  saveFrontendFiles(multicallContract, "MulticallContract");
  console.log("Multicall deployed to:", multicallContract.address);

  // rewilder
  const RewilderNFT = await hre.ethers.getContractFactory("RewilderNFT");
  const rewilderNFT = await RewilderNFT.deploy();
  await rewilderNFT.deployed();
  saveFrontendFiles(rewilderNFT, "RewilderNFT");
  console.log("RewilderNFT deployed to:", rewilderNFT.address);
}

// Save the contract address so our frontend can read it
// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(contract, contractName) {
  fs.appendFileSync(
    `${hre.config.paths.artifacts}/contracts/contractAddress.js`,
    `export const ${contractName} = '${contract.address}'\n`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
