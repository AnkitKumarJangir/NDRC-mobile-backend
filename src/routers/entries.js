const express = require("express");
const router = express.Router();
const entries = require('../controllers/entries');
const entriesValidation = require('../validations/entries')

router.post("/get-entries",entriesValidation.entries_validations(),entries.create);
router.get("/get-entries",entries.getEntries);
router.delete("/get-entries/:id",entries.deleteEntries);
router.put("/get-entries/:id",entriesValidation.entries_validations(),entries.updateEntries);



module.exports = router