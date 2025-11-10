const express = require('express');
const {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleGetBuildingTypes,
    handleDeleteBuilding,
    handleAssignCitizensToBuilding
} = require('../controllers/buildingController');

const router = express.Router();

router.get("/", handleGetBuildings);
router.get("/building-type", handleGetBuildingTypes);
router.get("/:type", handleGetBuildingsByType);

router.post("/", handlePostBuilding);
router.post("/:building_id/citizens", handleAssignCitizensToBuilding);

router.delete("/:id", handleDeleteBuilding);

module.exports = router;