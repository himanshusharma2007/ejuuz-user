// routes/authRouter.js
const express = require('express');
const { sendOtp, verifyOtp } = require('../controller/authController');
const authUser = require('../../middleware/authUser');

const router = express.Router();

// Public routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected route example
router.get('/me', authUser, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;
