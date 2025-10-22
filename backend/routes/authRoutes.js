const express = require('express');
const { handleLogin, handleLogout, handlePasswordChange } = require('../controllers/authController')

const router = express.Router();

router.post("/login", handleLogin);
router.post("/logout", handleLogout);

router.patch("/change-password/:email", handlePasswordChange);

module.exports = router