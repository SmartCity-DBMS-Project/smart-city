const express = require('express');
const { getUserNotifications, deleteNotification, streamNotifications } = require('../controllers/notificationController');
const { checkAuthentication } = require('../middlewares/authMiddlewares');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(checkAuthentication);

// Get notifications for the current user
router.get('/', getUserNotifications);

// Delete a notification
router.delete('/:id', deleteNotification);

// Server-Sent Events endpoint for real-time notifications
router.get('/stream', streamNotifications);

module.exports = router;