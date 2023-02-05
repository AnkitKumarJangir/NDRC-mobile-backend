const express = require("express");
const router = express.Router();
const cors = require("cors");
const valid = require("../validations/company");
const controllers = require("../controllers/company");
const jwt = require("jsonwebtoken");
var corsOptions = {
  origin: "*",
};
router.use(cors(corsOptions));
router.use((req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "No authorization provided!" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    next();
  });
});
router.get("/get-franchise-details", controllers.getFranchiseDetails);
router.post(
  "/create-franchise",
  valid.franchiseValid(),
  controllers.createFranchise
);
router.put("/edit-company", valid.franchiseValid(), controllers.editCompany);
module.exports = router;
