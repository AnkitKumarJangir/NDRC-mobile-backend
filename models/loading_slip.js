const mongoose = require("mongoose");

const loadingSlip = mongoose.model("loadingSlip", {
  s_no: { type: Number },
  date: { type: String },
  party: { type: String },
  address: { type: String },
  trailor_no: { type: String },
  from: { type: String },
  to: { type: String },
  goods: { type: String },
  freight: { type: Number },
  p_m_t: { type: String },
  fine: { type: Number },
  detain: { type: String },
  size: { type: Number },
  l: { type: Number },
  w: { type: Number },
  h: { type: Number },
  weight: { type: Number },
  guarantee: { type: String },
  advance: { type: Number },
  balance: { type: Number },
  created_date: { type: String },
  updated_date: { type: String },
  created_by: { type: String },
});
module.exports = loadingSlip;
