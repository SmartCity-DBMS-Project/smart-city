const express = require('express');
const citizenRouter = require('./citizenRouter');
const {
    handleGetAddressesByBuilding,
    handleAddAddressToBuilding,
    handleUpdateAddress,
    handleDeleteAddress,
} = require('../controllers/addressController');

const router = express.Router({ mergeParams: true });

router.get("", handleGetAddressesByBuilding);
router.post("", handleAddAddressToBuilding);
router.put("/:address_id", handleUpdateAddress);
router.delete("/:address_id", handleDeleteAddress);

// Citizen routes under each address
router.use('/:address_id/citizens', citizenRouter);

module.exports = router;
