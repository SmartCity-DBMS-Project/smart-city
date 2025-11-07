const express = require('express');
const { handleGetBuildings, handleGetBuildingsByType, handlePostBuildings } = require('../controllers/buildingController');

const router = express.Router();

router.get("/", handleGetBuildings);
router.get("/:type", handleGetBuildingsByType);

router.post("/", handlePostBuildings);

module.exports = router;