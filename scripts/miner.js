const {config, ethers, network} = require("hardhat");
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var mineOneBlock = async function() {
  console.log("Requesting node to mine one block");
  await network.provider.send("evm_mine");
}

async function main() {
  // block tick
  ethers.provider.on("block", (blockNumber) => {
    console.log("block", blockNumber, "mined at", new Date().getTime());
  });
  // Emitted when any new pending transaction is noticed
  ethers.provider.on("pending", (tx) => {
    console.log("pending tx", tx.hash);
    if (!config.networks.hardhat.mining.auto &&
      network.name == 'localhost') {
      setTimeout(mineOneBlock, config.networks.hardhat.mining.interval);
    }
  });
  process.stdin.on('keypress', (keystr, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      if (keystr == 'm') {
        mineOneBlock();
      }
    }
  });
}

main();
