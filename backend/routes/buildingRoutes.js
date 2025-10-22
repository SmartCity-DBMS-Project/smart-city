const express = require('express');
const { handleGetBuildings, handleGetBuildingsByType } = require('../controllers/buildingController');

const router = express.Router();

router.get("/", handleGetBuildings);
router.get("/:type", handleGetBuildingsByType);

module.exports = router;