const Shop = require('../model/shopModel'); // Adjust the path as needed

const shopController = {
  // Get all shops
  getAllShops: async (req, res) => {
    try {
      // Check if any query parameters are passed for filtering
      const queryParams = req.query;
      const filters = {};

      // Add optional filtering logic
      if (queryParams.businessCategory) {
        filters.businessCategory = queryParams.businessCategory;
      }
      if (queryParams.city) {
        filters['address.city'] = queryParams.city;
      }

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Find shops with optional filtering and populate products
      const shops = await Shop.find(filters)
        .populate('products')
        .skip(skip)
        .limit(limit);

      // Count total shops for pagination
      const totalShops = await Shop.countDocuments(filters);

      // Check if no shops found
      if (!shops || shops.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No shops found.'
        });
      }

      res.status(200).json({
        success: true,
        count: shops.length,
        totalPages: Math.ceil(totalShops / limit),
        currentPage: page,
        data: shops
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching shops',
        error: error.message
      });
    }
  },

  // Get shop by ID
  getShopById: async (req, res) => {
    try {
      // Check if ID is provided
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      // Find shop by ID and populate products
      const shop = await Shop.findById(req.params.id)
        .populate('products')
        .populate('merchantId', 'name email'); // Optionally populate merchant details

      // Check if shop exists
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      res.status(200).json({
        success: true,
        data: shop
      });
    } catch (error) {
      // Check for specific mongoose error (invalid ObjectId)
      if (error.kind === 'ObjectId') {
        return res.status(400).json({
          success: false,
          message: 'Invalid shop ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching shop',
        error: error.message
      });
    }
  },

  // Get all products for a specific shop
  getShopProducts: async (req, res) => {
    try {
      // Check if ID is provided
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      // Find shop by ID and populate only products
      const shop = await Shop.findById(req.params.id)
        .populate("products");

      // Check if shop exists
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      // Check if shop has any products
      if (!shop.products || shop.products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found for this shop'
        });
      }

      res.status(200).json({
        success: true,
        count: shop.products.length,
        data: shop.products
      });
    } catch (error) {
      // Check for specific mongoose error (invalid ObjectId)
      if (error.kind === 'ObjectId') {
        return res.status(400).json({
          success: false,
          message: 'Invalid shop ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error fetching shop products',
        error: error.message
      });
    }
  },

};

module.exports = shopController;