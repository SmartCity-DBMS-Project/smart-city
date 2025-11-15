const express = require('express');
const {
    handleGetAllCitizens,
    handlePostCitizen
} = require('../controllers/citizenController');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.use(checkAuthentication);

router.get("/", handleGetAllCitizens);
router.post("/add-citizen", authorizeRoles(['ADMIN']), handlePostCitizen);

module.exports = router;