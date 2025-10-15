const express = require('express');
const { handleLogin, handlePasswordChange } = require('../controllers/auth')

const router = express.Router();

router.post("/login", handleLogin);

router.patch("/change-password/:email", handlePasswordChange);

module.exports = router