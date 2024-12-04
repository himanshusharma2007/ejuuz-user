const express = require('express');
const authUser = require('../../middleware/authUser');
const cartController = require('../controller/cartController');

const router = express.Router();

// All cart routes should be protected
router.use(authUser);

// Cart routes
router.post('/add',  cartController.addToCart);
router.delete('/remove/:productId',  cartController.removeFromCart);
router.get('/',  cartController.getCart);

module.exports = router; 