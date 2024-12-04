const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');
const authUser = require('../../middleware/authUser');
// Wishlist routes
router.use(authUser)
router.post('/add',  wishlistController.addToWishlist);
router.delete('/remove/:productId',  wishlistController.removeFromWishlist);
router.get('/', wishlistController.getWishlist);

module.exports = router; 