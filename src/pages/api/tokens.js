const { getAllTokens } = require("./../../lib/server/db.js");

export default async (req, res) => {
  const tokens = await getAllTokens();

  res.send({
    status: "success",
    data: tokens,
  });
};
