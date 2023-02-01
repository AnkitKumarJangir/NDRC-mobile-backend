const mongoose = require("mongoose");

const otp = mongoose.model("userotps", {
  user_id: { type: String },
  otp: { type: String },
  is_verified: { type: Boolean },
});
module.exports = otp;
