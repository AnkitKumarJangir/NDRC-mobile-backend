const mongoose = require("mongoose");

const login = mongoose.model("users", {
  username: { type: String },
  password: { type: String },
  email: { type: String },
});
module.exports = login;
