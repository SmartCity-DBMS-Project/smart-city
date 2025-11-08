const express = require('express');
const { handleGetBuildings, handleGetBuildingsByType, handlePostBuilding, handleGetBuildingTypes, handleDeleteBuilding } = require('../controllers/buildingController');

const router = express.Router();

router.get("/", handleGetBuildings);
router.get("/building-type", handleGetBuildingTypes);
router.get("/:type", handleGetBuildingsByType);

router.post("/", handlePostBuilding);
router.delete("/:id", handleDeleteBuilding);

module.exports = router;