const mongoose = require("mongoose");

const otp = mongoose.model("forgot-otp", {
  user_id: { type: String },
  otp: { type: String },
  is_verified: { type: Boolean },
});
module.exports = otp;
