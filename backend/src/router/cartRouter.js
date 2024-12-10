const express = require('express');
const authUser = require('../../middleware/authUser');
const cartController = require('../controller/cartController');

const router = express.Router();

// All cart routes should be protected
router.use(authUser);

// Cart routes
router.post('/add',  cartController.addToCart);
router.delete('/remove/:productId',  cartController.removeFromCart);
// In your cart routes file
router.post('/increment/:productId',  cartController.incrementCartItem);
router.post('/decrement/:productId', cartController.decrementCartItem);
router.get('/',  cartController.getCart);

module.exports = router; 