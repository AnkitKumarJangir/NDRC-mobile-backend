const mongoose = require("mongoose");

const company = mongoose.model("company", {
  company_name: { type: String },
  sub_title: { type: String },
  description: { type: String },
  address: { type: String },
  company_email: { type: String },
  pan_no: { type: String },
  contact: { type: Array },
});
module.exports = company;
