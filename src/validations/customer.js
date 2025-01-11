const { check } = require("express-validator");

const customer_validations = () => {
  return [
    check("name", "name required").notEmpty(),
    check("mobile", "mobile required").notEmpty(),
  ];
};
module.exports = { customer_validations };
