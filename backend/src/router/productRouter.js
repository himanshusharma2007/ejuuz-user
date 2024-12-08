const express = require('express');
const authUser = require('../../middleware/authUser');
const {
  getAllProducts,
  getProductById,
  getShopByProductId,
  getProductsByCategory,
  searchProducts,
  getTopDiscountedProducts
} = require('../controller/productController');

const router = express.Router();
router.use(authUser)
// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/top-discounted',getTopDiscountedProducts);
router.get('/:id', getProductById);
router.get('/:id/shop', getShopByProductId);


module.exports = router; 