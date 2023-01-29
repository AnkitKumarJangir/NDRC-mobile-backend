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
      delete user["password"];
      res.status(200).send({
        data: user,
        token: token,
      });
    });
  }
};
const changePassword = async (req, res) => {
  const errors = validationResult(req);

  if (req.headers.authorization) {
    const user = await getUserBytoken(req.headers.authorization);
    console.log(user);
    if (!user) {
      return;
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((d) => {
          return { message: d.msg };
        }),
      });
    } else {
      if (req.body.old_password == user.password) {
        let payload = {
          password: req.body.new_password,
        };
        login.findByIdAndUpdate(
          { _id: user._id },
          { $set: payload },
          { new: true },
          (err, doc) => {
            if (err) {
              return res.status(400).send({ message: "Not found" });
            } else {
              res.send({ message: "Password updated successfully" });
            }
          }
        );
      } else {
        res.status(400).send({
          message: "Old password must be match",
        });
      }
    }
  } else {
    res.status(400).send({
      message: "No Authorization provided",
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

module.exports = { loginUser, getUserBytoken, changePassword };
