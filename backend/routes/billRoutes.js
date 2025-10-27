const express = require('express');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const {viewBill, createBill, updateBill, deleteBill} = require('../controllers/billController');

const router = express.Router();

router.use(checkAuthentication);

router.get('/', viewBill);
router.post('/', authorizeRoles(['ADMIN']), createBill);
router.patch('/:id', authorizeRoles(['ADMIN']), updateBill);
router.delete('/:id',authorizeRoles(['ADMIN']), deleteBill);

module.exports = router;