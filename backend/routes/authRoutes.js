const express = require('express');
const { handleLogin, handleLogout, handlePasswordChange, handleMe } = require('../controllers/authController')

const router = express.Router();

router.post("/login", handleLogin);
router.post("/logout", handleLogout);

router.patch("/change-password/:email", handlePasswordChange);

router.get("/me", handleMe);

module.exports = router