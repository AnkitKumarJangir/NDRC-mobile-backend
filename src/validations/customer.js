const { check } = require("express-validator");

const customer_validations = () => {
  return [
    check("name", "name required").notEmpty(),
    check("mobile", "mobile required").notEmpty(),
  ];
};
const customer_bulk_validations = () => {
  return [
    check("ids", "ids required").notEmpty(),
  ];
};
module.exports = { customer_validations,customer_bulk_validations };
