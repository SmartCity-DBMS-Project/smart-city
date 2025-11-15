const express = require('express');
const { getUserNotifications } = require('../controllers/notificationController');
const { checkAuthentication } = require('../middlewares/authMiddlewares');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(checkAuthentication);

// Get notifications for the current user
router.get('/', getUserNotifications);

module.exports = router;