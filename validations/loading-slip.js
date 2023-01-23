const { check, body } = require("express-validator");

const loadinn_slip_valid = () => {
  return [
    check("s_no", "s_no is required").notEmpty(),
    check("s_no", "s_no is number field but got str.").not().isString(),
    check("party", "party is required").not().isEmpty(),
    check("date", "date is required").not().isEmpty(),
    check("trailor_no", "trailor_no is required").not().isEmpty(),
    check("freight", "freight is required").not().isEmpty(),
    check("from", "from is required").not().isEmpty(),
    check("to", "to is required").not().isEmpty(),
    check("size", "size is required").not().isEmpty(),
    check("l", "l is required").not().isEmpty(),
    check("w", "w is required").not().isEmpty(),
    check("h", "h is required").not().isEmpty(),
    check("weight", "weight is required").not().isEmpty(),
    check("advance", "advance is required").not().isEmpty(),
    check("balance", "balance is required").not().isEmpty(),
  ];
};
module.exports = { loadinn_slip_valid };
