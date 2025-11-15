const express = require('express');
const router = express.Router();
const { 
  getAllRequests,
  getRequestsByCitizenId,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

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