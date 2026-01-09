const { check, body } = require("express-validator");

const loginValid = () => {
  return [
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ];
};
const signupValid = () => {
  return [
    check("first_name", "first name is required").notEmpty(),
    check("last_name", "last name is required").notEmpty(),
    check("mobile", "mobile number is required").notEmpty(),
    check("password", "password is required").notEmpty(),
  ];
};
module.exports = { loginValid,signupValid};
