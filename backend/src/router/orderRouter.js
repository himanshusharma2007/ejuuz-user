const express = require('express');
const router = express.Router();
const { placeOrder ,getAllCustomerOrders,getOrderById}= require('../controller/orderController');
const authUser = require('../../middleware/authUser'); // Assuming authUser middleware is in this location

// Route to place an order
router.post('/place-order', authUser, placeOrder);
router.get('/', authUser,getAllCustomerOrders);
router.get('/:orderId',authUser, getOrderById);
module.exports = router;
