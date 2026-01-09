const mongoose = require("mongoose");

const company = mongoose.model("company", {
  company_name: { type: String },
  sub_title: { type: String },
  business_type: { type: String },
  gst_no: { type: String },
  serial_no: { type: Number },
  sheet_no: { type: Number },
  commission_pct: { type: String },
  subscription_plan: { type: String },
  subscription_date: { type: String },
  subscription_valid_till: { type: String },
  description: { type: String },
  address: { type: String },
  company_email: { type: String },
  pan_no: { type: String },
  contact: { type: Array },
});
module.exports = company;
