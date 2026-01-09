const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");
const authValidation = require("../validations/auth");
router.use((req, res, next) => {
  next();
});
router.post("/login", authValidation.loginValid(), authControllers.loginUser);
router.post("/signup", authValidation.signupValid(), authControllers.signUp);
router.post("/send-otp", authControllers.sendOtp);
router.post("/verify-otp", authControllers.verifyOtp);
router.post("/update-user-profile", authControllers.updateUserProfile);
router.post("/rest-password", authControllers.resetPassword);

module.exports = router;
