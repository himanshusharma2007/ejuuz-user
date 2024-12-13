const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController'); // Adjust path as needed
const authUser  = require('../../middleware/authUser'); // Adjust path as needed

// Apply authUser middleware to all routes
router.use(authUser);

// Routes for shops
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.get('/:id/products', shopController.getShopProducts);

module.exports = router;