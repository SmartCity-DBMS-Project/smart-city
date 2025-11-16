const express = require('express');
const router = express.Router();
const { 
  getAllUtilities,
  getUtilityTypes,
  updateUtility
} = require('../controllers/utilitiesController');

// Get all utilities
router.get('/', getAllUtilities);

// Get unique utility types
router.get('/types', getUtilityTypes);

// Update utility
router.patch('/:id', updateUtility);

module.exports = router;