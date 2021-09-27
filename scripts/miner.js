const {config, ethers, network} = require("hardhat");
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var mineOneBlock = async function() {
  console.log("Requesting node to mine one block");
  await network.provider.send("evm_mine");
}

var getPendingTransactions = async () => {
  const pendingBlock = await network.provider.send("eth_getBlockByNumber", [
    "pending",
    false,
  ]);
  console.log('pending txs', pendingBlock.transactions);
};

async function main() {
  // block tick
  ethers.provider.on("block", (blockNumber) => {
    console.log("block", blockNumber, "mined at", new Date().getTime());
  });

  let autoMine = false;
  // Emitted when any new pending transaction is noticed
  ethers.provider.on("pending", (tx) => {
    console.log("pending tx", tx.hash);
    if (!config.networks.hardhat.mining.auto &&
      network.name == 'localhost' &&
      autoMine) {
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
      if (keystr == 'p') {
        getPendingTransactions();
      }
      if (keystr == 'a') {
        autoMine = !autoMine;
        console.log("automine", autoMine?"activated":"deactivated");
      }
    }
  });
  console.log("press M to mine one block, P to see pending txs, and A to toggle automining");
}

main();
