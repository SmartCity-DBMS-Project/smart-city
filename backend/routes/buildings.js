const express = require('express')

const { handleGetBuildings } = require('../controllers/buildings')

const router = express.Router();

router.get("/", handleGetBuildings);

module.exports = router;
