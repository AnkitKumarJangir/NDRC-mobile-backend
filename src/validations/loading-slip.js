const { check, body } = require("express-validator");

const loadinn_slip_valid = () => {
  return [
    check("s_no", "s_no is required").notEmpty(),
    check("s_no", "s_no is number field but got str.").not().isString(),
    check("customer", "customer is required").not().isEmpty(),
    check("date", "date is required").not().isEmpty(),
    check("trailor_no", "trailor_no is required").not().isEmpty(),
    check("freight", "freight is required").not().isEmpty(),
    check("from", "from is required").not().isEmpty(),
    check("to", "to is required").not().isEmpty(),
    check("l", "l is required").not().isEmpty(),
    check("w", "w is required").not().isEmpty(),
    check("h", "h is required").not().isEmpty(),
    check("weight", "weight is required").not().isEmpty(),
    check("advance", "advance is required").not().isEmpty(),
    check("balance", "balance is required").not().isEmpty(),
    check("description", "description is required").not().isEmpty(),
  ];
};
const changePassword_valid = () => {
  return [
    check("old_password", "old_password required").notEmpty(),
    check("new_password", "new_password required").notEmpty(),
  ];
};
module.exports = { loadinn_slip_valid, changePassword_valid };
