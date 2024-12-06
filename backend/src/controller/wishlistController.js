const Customer = require("../model/customerModel");
const Product = require("../model/productModel"); // Assuming you have a product model

// Add Product to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { customerId } = req.user;
    const { productId } = req.body;

    const product = await Product.findById(productId); // Validate product exists
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    if (customer.wishlist.includes(productId)) {
      // Check if product already in wishlist
      return res.status(400).json({
        error: "Product already in wishlist",
      });
    }
    customer.wishlist.push(productId); // Add to wishlist
    await customer.save();

    return res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
};

// Remove Product from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { customerId } = req.user;
    const { productId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    customer.wishlist = customer.wishlist.filter(
      // Remove product from wishlist
      (id) => id.toString() !== productId
    );
    await customer.save();

    return res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    console.log("get wishlist called ");
    const customerId  = req.user?._id;
    if (!customerId) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    const customer = await Customer.findById(customerId).populate(
      "wishlist.productId",
      "name price description images"
    ); // Populate product details
  console.log('customer', customer)
    if (!customer) {
      console.log("customer not found");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    console.log("checking wishlist", customer.wishlist);

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving wishlist",
      error: error.message,
    });
  }
};
