const express = require('express');
const {
    handleGetAllCitizens,
    handlePostCitizen
} = require('../controllers/citizenController');

const router = express.Router();

router.get("/", handleGetAllCitizens);
router.post("/citizen", handlePostCitizen);

module.exports = router;
