const { check, body } = require("express-validator");

const loginValid = () => {
  return [
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ];
};
module.exports = { loginValid };
