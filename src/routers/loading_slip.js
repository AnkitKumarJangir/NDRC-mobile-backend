const express = require("express");
const router = express.Router();
const loadinn_slip_validation = require("../validations/loading-slip");
const loading_slip_controller = require("../controllers/loading_slip");
const auth = require("../controllers/auth");

// All loading slip routes
router.get("/get-loading-slips", loading_slip_controller.getLoadingSlips);
router.get(
  "/get-loading-slips-serial-no",
  loading_slip_controller.getLoadingSlipsSerialNo
);
router.put(
  "/update-loading-slips/:id",
  loadinn_slip_validation.loadinn_slip_valid(),
  loading_slip_controller.updateLoadingSlips
);
router.get(
  "/get-single-loading-slip/:id",
  loading_slip_controller.getSingleLoadingSlips
);
router.delete(
  "/delete-loading-slip/:id",
  loading_slip_controller.deleteLoadingSlips
);
router.post(
  "/create-loading-slip",
  loadinn_slip_validation.loadinn_slip_valid(),
  loading_slip_controller.createLoadingSlip
);
router.post(
  "/change-password",
  loadinn_slip_validation.changePassword_valid(),
  auth.changePassword
);
router.get("/get-user-details", auth.getUser);
router.get("/dashboard", loading_slip_controller.getDashbaordDetails);
router.put("/update-profile", auth.updateUserProfile);

module.exports = router;
