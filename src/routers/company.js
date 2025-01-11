const express = require("express");
const router = express.Router();
const valid = require("../validations/company");
const controllers = require("../controllers/company");

router.get("/get-franchise-details", controllers.getFranchiseDetails);
router.post(
  "/create-franchise",
  valid.franchiseValid(),
  controllers.createFranchise
);
router.put("/edit-company", valid.franchiseValid(), controllers.editCompany);
module.exports = router;
