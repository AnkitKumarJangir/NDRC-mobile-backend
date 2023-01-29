const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const loadinn_slip_validation = require("../validations/loading-slip");
const loading_slip_controller = require("../controllers/loading_slip");
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

module.exports = router;
