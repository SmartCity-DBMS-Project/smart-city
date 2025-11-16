const express = require('express');
const { checkAuthentication, authorizeRoles } = require('../middlewares/authMiddlewares');
const {
    handleGetAllCitizens,
    handlePostCitizen,
    handlePatchCitizen,
    handleDeleteCitizen,
} = require('../controllers/citizenController');

const router = express.Router();

router.use(checkAuthentication);

router.get("/", handleGetAllCitizens);
router.post("/", authorizeRoles(['ADMIN']), handlePostCitizen);
router.patch("/:citizen_id", authorizeRoles(['ADMIN']), handlePatchCitizen);
router.delete("/:citizen_id", authorizeRoles(['ADMIN']), handleDeleteCitizen);

module.exports = router;