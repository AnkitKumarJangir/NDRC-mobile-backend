const login = require("../models/login");
const otp = require("../models/user-otp");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../controllers/mailer");
const helper = require("../controllers/helper");
var ObjectId = require("mongodb").ObjectID;

const bcrypt = require("bcryptjs");


const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {
    login
      .findOne({ username: req.body.username.trim() })
      .exec(async (err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = await bcrypt
          .compare(req.body.password, user.password)
          .then((res) => {
            return res;
          });

        if (!passwordIsValid) {
          return res.status(400).send({ message: "Invalid Password!" });
        }
        var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 86400, // 24 hours
        });
        const data = user.toObject()
        delete data.password
        res.status(200).send({
          data: data,
          token: token,
        });
      });
  }
};
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {

    const { email, mobile, password } = req.body;

    const existingUser = await login.findOne({
      $or: [
        { email: email },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Mobile number already registered"
      });
    }

    let user = new login({
      ...req.body,
      username: mobile,
      password: await bcrypt.hash(password, 10),
      is_admin: true,
      franchise_id: null,
    });
    user.save(async (err, doc) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        const tem = helper.welcomeEmailTemplate().replace(/{{UserName}}/g, doc.username)
          .replace(/{{user}}/g, doc.first_name)
          .replace(/{{LoginURL}}/g, "ndrc-web-v2.onrender.com")
          .replace(/{{SupportEmail}}/g, "fbd.ndrc@gmail.com")
          .replace(/{{Year}}/g, new Date().getFullYear())
        const obj = {
          from: process.env.AUTH_EMAIL,
          to: doc.email,
          subject: "Welcome to NDRC",
          html: tem,
        };
        const mail = await mailer.sendMail(obj);

        res.status(200).send({ message: "singup successfully.", id: doc._id });
      }
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
      var passwordIsValid = await bcrypt
        .compare(req.body.old_password, user.password)
        .then((res) => {
          return res;
        });
      if (passwordIsValid) {
        let payload = {
          password: bcrypt.hash(req.body.new_password, 10),
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
const getUser = async (req, res) => {
  const user = await getUserBytoken(req.headers.authorization);
  if (!user) {
    return res.status(400).send({
      message: "Not found",
    });
  }
  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    mobile: user.mobile,
  });
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await getUserBytoken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = { ...req.body };


    if (
      payload.mobile &&
      payload.mobile !== user.mobile
    ) {
      payload.username = payload.mobile;
      const exist = await login.findOne({ mobile: payload.mobile });
      if (exist) {
        return res.status(400).json({ message: "User already exist with this mobile number." });
      }
    }

    const updatedUser = await login.findByIdAndUpdate(
      user._id,
      { $set: payload },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    delete updatedUser['password']
    return res.status(200).json({
      message: "Profile updated successfully",
      data:updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};
async function getUserBytoken(token) {
  let userId;
  let doc;
  if (!token) {
    return;
  }
  jwt.verify(
    token?.split(" ")[1],
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return;
      }
      userId = decoded.id;
      return decoded.id;
    }
  ),
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
const sendOtp = async (req, res) => {
  if (req.body.email) {
    login.findOne({ email: req.body.email }, (err, doc) => {
      if (err) {
        return;
      } else {
        if (!doc) {
          return res.status(400).send({ message: "invaild email id" });
        }
        var generated_otp = Math.floor(1000 + Math.random() * 9000);

        obj = {
          from: process.env.AUTH_EMAIL,
          to: doc.email,
          replyTo: "noreply.ndrctrans@gmail.com",
          subject: "Reset Password OTP",
          html: `<div style="width:100%;margin:auto">
           <div style="width:100%">
           <div style="color:white;background:#ff811af4;text-align:center;height:40px;font-size:25px;font-weight:700;padding:10px 0px 0px 0px">NDRC Doc</div>
           <div    style="font-size:12px;font-weight:500;text-align:center;margin-top:10px"> you’re reset password OTP</div>
           <div style="font-size:25px;font-weight:800;text-align:center;padding:10px;color:red">
           ${generated_otp}</div>
           <div  style="font-size:12px;font-weight:500;text-align:center;margin-bottom:10px"> Please don't share this otp for security reasons.</div>
           <div style="color:white;background:#ff811af4;text-align:center;height:40px;font-size:12px;font-weight:500;padding:20px 0px 0px 0px">@copyright NDRC Doc,Faridabad support@New Deep Road Carrier</div>
           </div>
           </div>`,
        };
        otp.deleteOne({ user_id: doc._id }, (err, data) => { });
        let payload = new otp({
          user_id: doc._id,
          otp: generated_otp,
          is_verified: false,
        });
        payload.save(async (err, otp_in) => {
          if (err) {
            res.status(400).send("not found");
          } else {
            const mail = await mailer.sendMail(obj);
            res.send({ message: "sent OTP successfully ", email: doc.email });
          }
        });
      }
    });
  } else {
    res.status(400).send({ message: "email required" });
  }
  return;
};
const verifyOtp = async (req, res) => {
  if (req.body.otp && req.body.email) {
    login.findOne({ email: req.body.email }, (err, doc) => {
      if (err) {
        return;
      } else {
        if (!doc) {
          return res.status(400).send({ message: "invaild email id" });
        }
        otp.find({ user_id: ObjectId(doc._id) }, (err, otp_inst) => {
          if (err) {
            return res.status(400).send({ message: "not found" });
          } else {
            console.log("otp- >", otp_inst);
            if (otp_inst[0].otp == req.body.otp) {
              let payload = {
                is_verified: true,
              };
              otp.findOneAndUpdate(
                { user_id: doc._id },
                { $set: payload },
                { new: true },
                (err, doc) => { }
              );
              res.send({ message: "OTP verified successfully" });
            } else {
              res.status(400).send({ message: "invaild OTP" });
            }
          }
        });
      }
    });
    // const user = await auth.getUserBytoken(req.headers.authorization);
  } else {
    res.status(400).send({ message: "email and otp are required" });
  }
};
const resetPassword = async (req, res) => {
  if (req.body.new_password && req.body.email) {
    login.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return;
      } else {
        if (!user) {
          return res.status(400).send({ message: "invaild email id" });
        }
        otp.find({ user_id: ObjectId(user._id) }, async (err, doc) => {
          if (err) {
            return res.status(400).send({ message: "not found" });
          } else {
            console.log(doc);
            if (doc?.length && doc[0].is_verified) {
              let payload = {
                password: await bcrypt.hash(req.body.new_password, 10),
              };
              console.log(payload);
              login.findOneAndUpdate(
                { _id: ObjectId(user._id) },
                { $set: payload },
                { new: true },
                (err, doc) => {
                  console.log(err);
                  console.log(doc);
                }
              );
              otp.deleteOne({ user_id: user._id }, (err, data) => { });
              res.send({ message: "success" });
            } else {
              res.status(400).send({ message: "OTP not verified" });
            }
          }
        });
      }
    });
  } else {
    res.status(400).send({ message: "email and password are required" });
  }
};

module.exports = {
  loginUser,
  getUserBytoken,
  changePassword,
  getUser,
  updateUserProfile,
  sendOtp,
  verifyOtp,
  signUp,
  resetPassword,
};
