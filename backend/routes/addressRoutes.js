const express = require('express');
const {
    handleGetAddressesByBuilding,
    handleAddAddressToBuilding,
    handleUpdateAddress,
    handleDeleteAddress,
    handleGetAddressDetails,
    handleGetCitizensByAddress,
    handlePostCitizensByAddress,
    handlePatchCitizensByAddress,
    handleDeleteCitizensByAddress,
} = require('../controllers/addressController');

const router = express.Router({ mergeParams: true });

router.get("", handleGetAddressesByBuilding);
router.post("", handleAddAddressToBuilding);
router.patch("/:address_id", handleUpdateAddress);
router.delete("/:address_id", handleDeleteAddress);

// Citizen routes under each address
router.get("/:address_id", handleGetAddressDetails);
router.get("/:address_id/citizens", handleGetCitizensByAddress);
router.post("/:address_id/citizens", handlePostCitizensByAddress);
router.patch("/:address_id/citizens/:citizen_id", handlePatchCitizensByAddress);
router.delete("/:address_id/citizens/:citizen_id", handleDeleteCitizensByAddress);


module.exports = router;
