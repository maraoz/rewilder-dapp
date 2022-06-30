const {ethers} = require("hardhat");

const db = require('./lib/firestore');

const update = async function(tokenID, timestamp, txid) {
  console.log("ETH from donation", tokenID, "sold at", timestamp, "at tx", txid);

  // initialize updates for this token
  // const updates = {};
  // updates[0] = {
  //   timestamp: timestamp || new Date().getTime(),
  //   type: "creation", 
  //   info: {
  //     "txid": txid,
  //   }
  // }
  const snapshot = await db.collection(`updates-${network.name}`).doc(tokenID.toString()).get();
  const updates = snapshot.data();
  updates[1] = {
    timestamp: timestamp || new Date().getTime(),
    type: "eth-sale", 
    info: {
      "txid": txid,
    }
  }
  console.log(updates);
  await db.collection(`updates-${network.name}`).doc(tokenID.toString()).set(updates);
  console.log("NFT updates stored for", tokenID.toString(), "successfully!!");
}

async function main() {
  for (var tokenID = 1; tokenID <= 4; tokenID++) {
    console.log('processing single donation with tokenID', tokenID);
  
    const timestamp = 1656606971337; // 0xb4328dd417d7a4964365f714d03c6b33e3fc3a7f6de03f14211a2284685bbdfc
    await update(tokenID, timestamp, '0xb4328dd417d7a4964365f714d03c6b33e3fc3a7f6de03f14211a2284685bbdfc');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });