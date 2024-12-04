const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getShopByProductId,
  getProductsByCategory,
  searchProducts
} = require('../controller/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/:id/shop', getShopByProductId);

module.exports = router; 