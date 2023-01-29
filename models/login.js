const mongoose = require("mongoose");

const login = mongoose.model("users", {
  username: { type: String },
  password: { type: String },
  email: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  mobile: { type: String },
});
module.exports = login;
