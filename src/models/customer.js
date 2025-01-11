const mongoose = require("mongoose");

const customer = mongoose.model("customers", {
  name: { type: String },
  email: { type: String },
  description: { type: String },
  address_line_1: { type: String },
  address_line_2: { type: String },
  mobile: { type: String },
  franchise_id: { type: String },
});
module.exports = customer;
