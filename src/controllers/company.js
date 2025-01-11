const company = require("../models/company");
const { validationResult } = require("express-validator");
const login = require("../models/login");
const auth = require("./auth");

const getFranchiseDetails = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  if (!user) {
    return res.status(400).send({ message: "not found" });
  }
  company.find({ _id: user.franchise_id }, (err, doc) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      res.send(doc[0]);
    }
  });
};
const createFranchise = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {
    const user = await auth.getUserBytoken(req.headers.authorization);
    if (!user) {
      return res.status(400);
    }
    let clt = new company({
      company_name: req.body.company_name,
      sub_title: req.body.sub_title,
      description: req.body.description,
      address: req.body.address,
      company_email: req.body.company_email,
      pan_no: req.body.pan_no,
      contact: req.body.contact,
    });
    clt.save(async (err, doc) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        let payload = {
          franchise_id: doc._id,
        };
        login.findByIdAndUpdate(
          { _id: user._id },
          { $set: payload },
          { new: true },
          (err, log) => {
            if (err) {
              res.status(400).send({ message: err });
            }
            res.send(doc[0]);
          }
        );
      }
    });
  }
};
const editCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {
    const user = await auth.getUserBytoken(req.headers.authorization);
    if (!user) {
      return res.status(400);
    }
    let clt = {
      company_name: req.body.company_name,
      sub_title: req.body.sub_title,
      description: req.body.description,
      address: req.body.address,
      pan_no: req.body.pan_no,
      company_email: req.body.company_email,
      contact: req.body.contact,
    };
    console.log(user);
    if (user.is_admin) {
      company.findByIdAndUpdate(
        { _id: user.franchise_id },
        { $set: clt },
        { new: true },
        (err, doc) => {
          if (err) {
            return res.status(400).send({ message: err });
          } else {
            res.send(doc);
          }
        }
      );
    } else {
      return res.status(400).send({ message: "You are not able to update" });
    }
  }
};
const getCompanyEmail = async (token) => {
  let email;
  const user = await auth.getUserBytoken(token);
  if (!user) {
    return;
  }
  email = await company
    .find({ _id: user.franchise_id }, (err, doc) => {
      if (err) {
        return;
      }
      // console.log(doc[0].company_email);
      return doc[0].company_email;
    })
    .clone();
  return email[0].company_email;
};
module.exports = {
  getFranchiseDetails,
  createFranchise,
  editCompany,
  getCompanyEmail,
};
