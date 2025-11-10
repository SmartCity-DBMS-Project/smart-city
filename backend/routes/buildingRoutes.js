const express = require('express');
const {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleGetBuildingTypes,
    handleDeleteBuilding,
    handleAssignCitizensToBuilding,
    handleGetBuildingById,
    handleGetAddressesByBuilding,
    handleAddAddressToBuilding,
    handleUpdateAddress,
    handleDeleteAddress,
} = require('../controllers/buildingController');

const router = express.Router();

router.get("/building-type", handleGetBuildingTypes);
router.get("/types/:type", handleGetBuildingsByType);

router.get("/", handleGetBuildings);
router.get("/:building_id", handleGetBuildingById);
router.post("/", handlePostBuilding);  
router.delete("/:building_id", handleDeleteBuilding);

router.post("/:building_id/citizens", handleAssignCitizensToBuilding);

router.get("/:building_id/addresses", handleGetAddressesByBuilding);
router.post("/:building_id/addresses", handleAddAddressToBuilding);
router.put("/:building_id/addresses/:address_id", handleUpdateAddress);
router.delete("/:building_id/addresses/:address_id", handleDeleteAddress);

module.exports = router;