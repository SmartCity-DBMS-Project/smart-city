const express = require('express');
const addressRouter = require('./addressRoutes');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleGetBuildingTypes,
    handleDeleteBuilding,
    handleGetBuildingById,
    handleUpdateBuilding,  // Added the new update function
} = require('../controllers/buildingController');

const router = express.Router();

router.get("/building-type", handleGetBuildingTypes);
router.get("/types/:type", handleGetBuildingsByType);

router.use(checkAuthentication);

router.get("/", handleGetBuildings);
router.get("/:building_id", handleGetBuildingById);
router.post("/", authorizeRoles(['ADMIN']), handlePostBuilding);  
router.patch("/:building_id", authorizeRoles(['ADMIN']), handleUpdateBuilding);  // Added PATCH route for updating buildings
router.delete("/:building_id", authorizeRoles(['ADMIN']), handleDeleteBuilding);

router.use('/:building_id/addresses', addressRouter);

module.exports = router;