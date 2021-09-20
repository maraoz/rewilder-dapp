const {ethers, network} = require("hardhat");

async function main() {

  if (network.name != "localhost") 
    return;
  
  let [deployer] = await ethers.getSigners();
  const addresses = [
    '0xd990C34872F94E5eD38BAe508A99E03032E5019f',
    '0x9EF87AeFA5A5354Eea6Eec59E595c4e5c8A8d60C'
  ];

  await Promise.all(addresses.map(async (address) => {
    console.log("Sending ETH to", address);
    const tx = await deployer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("150.0")
    });
    return await tx.wait();
  }));
  console.log("Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
