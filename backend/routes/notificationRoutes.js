const express = require('express');
const { getUserNotifications, deleteNotification } = require('../controllers/notificationController');
const { checkAuthentication } = require('../middlewares/authMiddlewares');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(checkAuthentication);

// Get notifications for the current user
router.get('/', getUserNotifications);

// Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;