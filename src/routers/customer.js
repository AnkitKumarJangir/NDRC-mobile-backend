const express = require("express");
const router = express.Router();
const validations = require("../validations/customer");
const customerController = require("./../controllers/customer");
const multer = require("../../middlewares/multer");

router.get("/customers", customerController.getCustomerList);
router.get("/customers/:id", customerController.getSingleCustomer);
router.get("/customers-list/", customerController.getCustomerWithoutPagination);
router.post(
  "/customers",
  validations.customer_validations(),
  customerController.createCustomer
);
router.post(
  "/import-customers",
  multer.upload.single("file"),
  customerController.bulkImportCustomer
);
router.put(
  "/customers/:id",
  validations.customer_validations(),
  customerController.updatedCustomer
);
router.delete("/customers/:id", customerController.deleteCustomer);
router.post("/customers-bulk-delete", validations.customer_bulk_validations(), customerController.bulkDelete);

module.exports = router;
