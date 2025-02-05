const { check } = require("express-validator");

const entries_validations = () => {
  return [
    check("loading_id", "loading id required").not().isEmpty(),
  ];
};
module.exports = { entries_validations };
