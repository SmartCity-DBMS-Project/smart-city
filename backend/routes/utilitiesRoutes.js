const express = require('express');
const router = express.Router();
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const { 
  getAllUtilities,
  getUtilityTypes
} = require('../controllers/utilitiesController');

router.use(checkAuthentication);

// Get all utilities
router.get('/', getAllUtilities);

// Get unique utility types
router.get('/types', getUtilityTypes);

module.exports = router;