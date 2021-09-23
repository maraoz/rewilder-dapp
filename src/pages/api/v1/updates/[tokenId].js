const { getUpdatesForToken } = require("./../../../../lib/server/db.js");
import config from "../../../../config"; 

export default async (req, res) => {
  const { tokenId } = req.query;
  
  const updates = await getUpdatesForToken(tokenId);
  
  if (!updates) {
    return res.send({
      status: "error",
      message: `No updates found for token with id ${tokenId} in ${config.networkName} network (id=${config.chainId})`,
    });
  }
  const deterministicUpdates = {};
  deterministicUpdates.id = updates.id;
  Object.keys(updates)
    .filter((key)=> key != 'id' )
    .map((i) => {
      console
      const update = updates[i];
      deterministicUpdates[i] = {
        timestamp: update.timestamp,
        type: update.type,
        info: update.info,
      };
    });
  res.send(deterministicUpdates);
};
