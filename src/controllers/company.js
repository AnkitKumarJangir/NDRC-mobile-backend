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
const getSingleFranchise = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  if (!user) {
    return res.status(400).send({ message: "not found" });
  }
  company.find({ _id: req.params.id }, (err, doc) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      res.send(doc[0]);
    }
  });
};
const createFranchise = async (req, res) => {
  try {
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
        return res.status(401).json({ message: "Unauthorized" });
      }

      const franchise = new company({
        ...req.body
      });

      const savedFranchise = await franchise.save();
      await login.findByIdAndUpdate(
        user._id,
        { $set: { franchise_id: savedFranchise._id } },
        { new: true }
      );

      return res.status(201).json({
        message: "Franchise created successfully",
        data: savedFranchise
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.is_admin) {
      return res.status(403).json({
        message: "You are not allowed to update company details"
      });
    }
    const updatedCompany = await company.findByIdAndUpdate(
      user.franchise_id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      data: updatedCompany
    });
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
  getSingleFranchise,
  getCompanyEmail,
};
