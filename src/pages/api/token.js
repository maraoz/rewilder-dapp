const { getToken } = require("./../../lib/server/db.js");

export default async (req, res) => {
  const { id } = req.query;

  const token = await getToken(id);

  if (!token) {
    return res.send({
      status: "error",
      message: "Token does not exist",
    });
  }

  res.send({
    status: "success",
    data: token,
  });
};
