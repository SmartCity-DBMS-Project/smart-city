const express = require('express');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const {viewBill, createBill, updateBill, deleteBill, getUtilityTypes, getAddressList} = require('../controllers/billController');

const router = express.Router();

router.use(checkAuthentication);

router.get('/', viewBill);
router.get('/utility-types', getUtilityTypes);  // Route for fetching utility types
router.get('/addresses', getAddressList);  // New route for fetching addresses
router.post('/', authorizeRoles(['ADMIN']), createBill);
router.patch('/:id', authorizeRoles(['ADMIN']), updateBill);
router.delete('/:id',authorizeRoles(['ADMIN']), deleteBill);

module.exports = router;