const { check } = require("express-validator");

const franchiseValid = () => {
  return [
    check("company_name", "company name required").notEmpty(),
    check("sub_title", "sub title required").notEmpty(),
    check("address", "address required").notEmpty(),
    check("company_email", "company email required").notEmpty(),
    check("contact", "contact required").notEmpty(),
  ];
};
module.exports = { franchiseValid };
