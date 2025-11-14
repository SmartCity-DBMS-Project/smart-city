const express = require('express');
const addressRouter = require('./addressRoutes');
const {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleGetBuildingTypes,
    handleDeleteBuilding,
    handleGetBuildingById,
} = require('../controllers/buildingController');

const router = express.Router();

router.get("/building-type", handleGetBuildingTypes);
router.get("/types/:type", handleGetBuildingsByType);

router.get("/", handleGetBuildings);
router.get("/:building_id", handleGetBuildingById);
router.post("/", handlePostBuilding);  
router.delete("/:building_id", handleDeleteBuilding);

router.use('/:building_id/addresses', addressRouter);

module.exports = router;