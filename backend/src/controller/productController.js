const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const Shop = require('../model/shopModel');
const Merchant = require('../model/merchantModel');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('Getting all products - getAllProducts function called');
    
    const products = await Product.find({ status: "active" })
      .populate('shopId', 'name businessCategory');

    console.log(`Found ${products.length} products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    console.log('Getting product by ID - getProductById function called');
    console.log('Product ID:', req.params.id);

    const product = await Product.findById(req.params.id)
      .populate('shopId', 'name businessCategory description contact');

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Product found:', product._id);
    
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

exports.getShopByProductId = async (req, res) => {
  try {
    console.log('Getting shop by product ID - getShopByProductId function called');
    console.log('Product ID:', req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const shop = await Shop.findById(product.shopId)
      .select('-ratings -products')
      .populate('merchantId', 'name email');

    if (!shop) {
      console.log('Shop not found');
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    console.log('Shop found:', shop._id);
    
    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error('Error in getShopByProductId:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop',
      error: error.message
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    console.log('Getting products by category - getProductsByCategory function called',req.params);
    console.log('Category:', req.params.category);

    const products = await Product.find({ 
      category: req.params.category,
      status: "active"
    }).populate('shopId', 'name');

    console.log(`Found ${products.length} products in category`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    console.log('Searching products - searchProducts function called');
    console.log('Search keyword:', req.query.keyword);

    const keyword = req.query.keyword.toLowerCase();
    
    const searchQuery = {
      status: "active",
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    };

    const products = await Product.find(searchQuery)
      .populate('shopId', 'name');

    console.log(`Found ${products.length} products matching search criteria`,products);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in searchProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

exports.getTopDiscountedProducts = async (req, res) => {
  try {
    console.log('Getting top discounted products - getTopDiscountedProducts function called');
    
    // Parse limit from query, default to 20 if not provided
    const limit = parseInt(req.query.limit) || 20;
    
    const topDiscountedProducts = await Product.find({ 
      status: "active",
      discount: { $gt: 0 } // Only products with discount
    })
    .sort({ discount: -1 }) // Sort by discount in descending order
    .limit(limit) // Limit the number of products
    .populate('shopId'); // Populate shop details

    console.log(`Found ${topDiscountedProducts.length} top discounted products`);
    
    res.status(200).json({
      success: true,
      count: topDiscountedProducts.length,
      products: topDiscountedProducts,
    });
  } catch (error) {
    console.error('Error in getTopDiscountedProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top discounted products',
      error: error.message
    });
  }
};
exports.postProductReview = async (req, res) => {
  try {
    console.log('Posting product review - postProductReview function called');
    
    const { productId } = req.params;
    const { rating, review } = req.body;
    const customerId = req.user._id; // Assuming authentication middleware adds user info

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if customer has completed an order for this product
    const completedOrder = await Order.findOne({
      customerId: customerId,
      status: 'Complete',
      'products.productId': productId
    });

    if (!completedOrder) {
      console.log('Customer has not purchased this product or order not completed');
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased and whose order is completed'
      });
    }

    // Check if customer has already reviewed this product
    const existingReviewIndex = product.ratings.findIndex(
      r => r.customerId.toString() === customerId.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      product.ratings[existingReviewIndex].rating = rating;
      product.ratings[existingReviewIndex].review = review || '';
      product.ratings[existingReviewIndex].createdAt = Date.now();
    } else {
      // Add new review
      product.ratings.push({
        rating,
        review: review || '',
        customerId: customerId
      });
    }

    // Save the product (this will trigger the pre-save hook to recalculate avgRating)
    await product.save();

    console.log('Review posted successfully');
    
    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      product: {
        avgRating: product.avgRating,
        ratings: product.ratings
      }
    });
  } catch (error) {
    console.error('Error in postProductReview:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting review',
      error: error.message
    });
  }
};