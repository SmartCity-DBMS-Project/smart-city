const express = require('express');
const {
    handleGetAllCitizens,
    handlePostCitizen,
    handlePatchCitizen,
    handleDeleteCitizen,
} = require('../controllers/citizenController');

const router = express.Router();

router.get("/", handleGetAllCitizens);
router.post("/", handlePostCitizen);
router.patch("/:citizen_id", handlePatchCitizen);
router.delete("/:citizen_id", handleDeleteCitizen);

module.exports = router;
