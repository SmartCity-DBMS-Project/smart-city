const express = require('express');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const {
    handleGetAllAddresses,
    handleGetAddressesByBuilding,
    handleAddAddressToBuilding,
    handleUpdateAddress,
    handleDeleteAddress,
    handleGetAddressDetails,
    handleGetCitizensByAddress,
    handlePostCitizensByAddress,
    handleUpdateCitizenByAddress,
    handleDeleteCitizenByAddress,
} = require('../controllers/addressController');

const router = express.Router({ mergeParams: true });

router.use(checkAuthentication);

router.get("/all", handleGetAllAddresses);

// Get all addresses for a building
router.get("", handleGetAddressesByBuilding);

// Add new address to building
router.post("", authorizeRoles(['ADMIN']), handleAddAddressToBuilding);

// Specific address routes
router.get("/:address_id", handleGetAddressDetails);
router.patch("/:address_id", authorizeRoles(['ADMIN']), handleUpdateAddress);
router.delete("/:address_id", authorizeRoles(['ADMIN']), handleDeleteAddress);

// Citizen routes under each address
router.get("/:address_id/citizens", handleGetCitizensByAddress);
router.post("/:address_id/citizens", authorizeRoles(['ADMIN']), handlePostCitizensByAddress);
router.patch("/:address_id/citizens/:citizen_id", authorizeRoles(['ADMIN']), handlePatchCitizensByAddress);
router.delete("/:address_id/citizens/:citizen_id", authorizeRoles(['ADMIN']), handleDeleteCitizensByAddress);


module.exports = router;