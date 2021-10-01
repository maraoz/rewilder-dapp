const { getToken } = require("./../../../lib/server/db.js");
import config from "../../../config"; 

export default async (req, res) => {
  const { tokenId } = req.query;
  
  const token = await getToken(tokenId);
  if (!token) {
    return res.send({
      status: "error",
      message: `Token with id ${tokenId} does not exist in ${config.networkName} network (id=${config.chainId})`,
    });
  }

  const host = req && req.headers.host;
  const protocol = host.includes('localhost')?'http':'https';
  const baseUrl = protocol + "://" + host;
  const updatesURL = baseUrl + `/api/v1/updates/${tokenId}`;

  // deterministic and safe responses
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
