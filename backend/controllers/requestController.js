const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get requests by citizen ID
const getRequestsByCitizenId = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const requests = await prisma.request.findMany({
      where: { citizen_id: parseInt(citizenId) },
      orderBy: {
        request_id: 'desc'
      }
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      orderBy: {
        request_id: 'desc'
      }
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({
      where: { request_id: parseInt(id) }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Create a new request
const createRequest = async (req, res) => {
  try {
    const { citizen_id, service_type, details, status, comment } = req.body;
    
    // Validate required fields
    if (!citizen_id) {
      return res.status(400).json({ error: 'Citizen ID is required' });
    }
    
    if (!service_type || service_type.trim() === '') {
      return res.status(400).json({ error: 'Service type is required' });
    }
    
    if (!details || details.trim() === '') {
      return res.status(400).json({ error: 'Details are required' });
    }
    
    const request = await prisma.request.create({
      data: {
        citizen_id: parseInt(citizen_id),
        service_type,
        details,
        status: status || 'PENDING',
        comment
      }
    });
    
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

// Update a request
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { citizen_id, service_type, details, status, comment } = req.body;
    
    // Validate that at least one field is provided for update
    if (!citizen_id && !service_type && !details && !status && !comment) {
      return res.status(400).json({ error: 'At least one field is required for update' });
    }
    
    // Only update fields that are provided
    const updateData = {};
    if (citizen_id !== undefined) updateData.citizen_id = parseInt(citizen_id);
    if (service_type !== undefined) updateData.service_type = service_type;
    if (details !== undefined) updateData.details = details;
    if (status !== undefined) updateData.status = status;
    if (comment !== undefined) updateData.comment = comment;
    
    const request = await prisma.request.update({
      where: { request_id: parseInt(id) },
      data: updateData
    });
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    // More detailed error response
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(500).json({ error: 'Failed to update request', details: error.message });
  }
};

// Delete a request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if request exists
    const existingRequest = await prisma.request.findUnique({
      where: { request_id: parseInt(id) }
    });
    
    if (!existingRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    await prisma.request.delete({
      where: { request_id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

module.exports = {
  getAllRequests,
  getRequestsByCitizenId,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
};