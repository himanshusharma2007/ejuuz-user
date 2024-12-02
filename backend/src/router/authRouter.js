// routes/authRouter.js
const express = require('express');
const { sendOtp, verifyOtp } = require('../controller/authController');

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOtp);


module.exports = router;
