const express = require('express');
const router = express.Router();
const { 
  getAllUtilities,
  getUtilityTypes
} = require('../controllers/utilitiesController');

// Get all utilities
router.get('/', getAllUtilities);

// Get unique utility types
router.get('/types', getUtilityTypes);

module.exports = router;