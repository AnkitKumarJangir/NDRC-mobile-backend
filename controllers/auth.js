const login = require("../models/login");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {
    login.findOne({ username: req.body.username.trim() }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = req.body.password === user.password ? true : false;

      if (!passwordIsValid) {
        return res.status(400).send({ message: "Invalid Password!" });
      }
      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        ...user,
        token: token,
      });
    });
  }
};
async function getUserBytoken(token) {
  let userId;
  let doc;
  if (!token) {
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return;
    }
    userId = decoded.id;
    return decoded.id;
  }),
    (doc = await login
      .findOne(
        {
          _id: userId,
        },
        (err, doc) => {
          if (err) {
            return;
          }

          return doc;
        }
      )
      .clone());
  return doc;
  // return null;
}

module.exports = { loginUser, getUserBytoken };
