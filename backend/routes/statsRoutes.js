const express = require('express');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

// Only authenticated admins should see city-wide stats
router.use(checkAuthentication);
router.get('/', authorizeRoles(['ADMIN']), getStats);

module.exports = router;
