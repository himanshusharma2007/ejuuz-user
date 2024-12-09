const Customer = require("../model/customerModel");
const Product = require("../model/productModel"); // Assuming you have a product model

// Add Product to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    console.log("addToWishlist called",req.body);
    const customerId  = req.user._id;
    const  productId  = req.body._id;

    console.log("Received customerId:", customerId, "Received productId:", productId);

    const product = await Product.findById(productId); // Validate product exists
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({
        error: "Product not found",
      });
    }
    console.log("Product found:", product);

    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.log("Customer not found");
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    console.log("Customer found:", customer);

    if (customer.wishlist.includes(productId)) {
      console.log("Product already in wishlist");
      return res.status(400).json({
        error: "Product already in wishlist",
      });
    }

    customer.wishlist.push(productId); // Add to wishlist
    await customer.save();
    console.log("Product added to wishlist");

    return res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.log("Error in addToWishlist:", error);
    return res.status(500).json({
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
};

// Remove Product from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    console.log("removeFromWishlist called");
    const customerId = req.user._id;
    const {productId } = req.params;

    console.log("Received customerId:", customerId, "Received productId:", req.body);
    console.log("ProductId type:", productId);
    
    const customer = await Customer.findById(customerId);
    console.log("Current wishlist before removal:", customer.wishlist);
    console.log("Wishlist types:", customer.wishlist.map(id => typeof id));
    if (!customer) {
      console.log("Customer not found");
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    // More explicit type conversion
    const initialWishlistLength = customer.wishlist.length;
    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    
    console.log("Wishlist after filtering:", customer.wishlist);
    console.log("Wishlist length before:", initialWishlistLength);
    console.log("Wishlist length after:", customer.wishlist.length);

    await customer.save();
    console.log("Product removed from wishlist");

    return res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.log("Error in removeFromWishlist:", error);
    return res.status(500).json({
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};
exports.getWishlist = async (req, res) => {
  try {
    console.log("getWishlist called");
    const customerId = req.user?._id;

    console.log("Received customerId:", customerId);

    if (!customerId) {
      console.log("Customer not found in request");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Fetch customer to get the wishlist IDs
    const customer = await Customer.findById(customerId).select('wishlist');

    console.log("Customer fetched:", customer);

    if (!customer) {
      console.log("Customer not found in database");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Fetch product details manually using wishlist IDs
    const wishlist = await Product.find({ _id: { $in: customer.wishlist } })
      .select('name price description images rating'); // Select only required fields

    console.log("Wishlist fetched:", wishlist);

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist: wishlist,
    });
  } catch (error) {
    console.log("Error in getWishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving wishlist",
      error: error.message,
    });
  }
};
