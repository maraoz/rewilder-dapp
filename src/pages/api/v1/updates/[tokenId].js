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
  res.send(updates);
  return 
  // TODO: deterministic and safe responses
  token.attributes.sort();
  res.send({
    id: token.id,
    name: token.name || "Rewilder",
    description: token.description || "",
    external_url: token.external_url,
    updates: updatesURL,
    image: token.image || "https://rewilder.xyz/assets/img/social/avatar.png",
    attributes: token.attributes.map(
      (attribute) => {
        return {"trait_type": attribute.trait_type, "value": attribute.value};
      }
    ),
  });
};
