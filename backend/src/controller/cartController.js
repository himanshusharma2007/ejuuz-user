const Customer = require("../model/customerModel");
const Product = require("../model/productModel"); // Assuming you have a product model

// Add Product to Cart
exports.addToCart = async (req, res) => {
  try {
    const { customerId } = req.user; // Assuming authentication middleware sets this
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      // Validate inputs
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }
    const customer = await Customer.findById(customerId); // Find the customer
    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    const product = await Product.findById(productId); // Find the product to get its details
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }
    const existingCartItem = customer.cart.find(
      // Check if product already in cart
      (item) => item.productId.toString() === productId
    );
    if (existingCartItem) {
      // Update quantity if product exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new product to cart
      customer.cart.push({
        productId: productId,
        quantity: quantity,
        price: product.price * this.quantity,
      });
    }

    await customer.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: customer.cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error adding product to cart",
      msg: error.message,
    });
  }
};
// Remove Product from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { customerId } = req.user;
    const { productId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Remove product from cart
    customer.cart = customer.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await customer.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart: customer.cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    console.log("get cart function called", req.user);
    const customerId = req.user?._id;
    if (!customerId) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    const customer = await Customer.findById(customerId).populate(
      "cart.productId",
      "name price description images"
    ); // Populate product details
    console.log("customer", customer);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Calculate total cart value
    const cartTotal = customer.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
console.log("cart data fetch successfully",cartTotal)
    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: customer.cart,
      cartTotal: cartTotal,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
  }
};
