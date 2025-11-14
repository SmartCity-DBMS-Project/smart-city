const express = require('express');
const {
    handleGetAllCitizens,
} = require('../controllers/citizenController');

const router = express.Router();

router.get("/", handleGetAllCitizens);

module.exports = router;
