const express = require('express');
const {
  handleGetCitizensByAddress,
} = require('../controllers/citizenController');

const router = express.Router({ mergeParams: true });

// Citizens of a specific address
router.get("/", handleGetCitizensByAddress);

module.exports = router;
