const express = require('express');
const router = express.Router();
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const { 
  getAllRequests,
  getRequestsByCitizenId,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

router.use(checkAuthentication);

// Get all requests
router.get('/', getAllRequests);

// Get requests by citizen ID
router.get('/citizen/:citizenId', getRequestsByCitizenId);

// Get request by ID
router.get('/:id', getRequestById);

// Create a new request
router.post('/', createRequest);

// Update a request
router.patch('/:id', updateRequest);

// Delete a request
router.delete('/:id', deleteRequest);

module.exports = router;