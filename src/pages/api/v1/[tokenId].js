const { getToken } = require("./../../../lib/server/db.js");

export default async (req, res) => {
  const { tokenId } = req.query;

  const token = await getToken(tokenId);

  if (!token) {
    return res.send({
      status: "error",
      message: "Token does not exist",
    });
  }

  res.send(token);
};
