const express = require('express');
const router = express.Router();
const { placeOrder }= require('../controller/orderController');
const authUser = require('../../middleware/authUser'); // Assuming authUser middleware is in this location

// Route to place an order
router.post('/place-order', authUser, placeOrder);

module.exports = router;
