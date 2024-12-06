const Product = require('../model/productModel');
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

    const keyword = req.query.keyword;
    
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

    console.log(`Found ${products.length} products matching search criteria`);
    
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