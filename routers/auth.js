const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");
const authValidation = require("../validations/auth");
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
router.post("/login", authValidation.loginValid(), authControllers.loginUser);

module.exports = router;
