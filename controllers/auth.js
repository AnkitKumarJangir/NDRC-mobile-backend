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
    login.findOne({ username: req.body.username }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = req.body.password === user.password ? true : false;

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }
      var token = jwt.sign({ id: user.id }, "ndrc.transport@fbd#7526", {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    });
  }
};

module.exports = { loginUser };
