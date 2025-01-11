const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "No authorization provided!" });
  }
  const tokenType = authorization?.split(" ")[0];
  const token = authorization?.split(" ")[1];

  if (tokenType != "Bearer") {
    return res.status(403).send({ message: "Invalid authorization!" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    next();
  });
};

module.exports = { isAuthenticated };
