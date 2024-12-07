const Customer = require("../model/customerModel");
const Product = require("../model/productModel"); // Assuming you have a product model

// Add Product to Cart
exports.addToCart = async (req, res) => {
  try {
    console.log("addToCart called",req.body);
    const  item = req.body.item;
    if(!item){
      return res.status(400).json({
        success: false,
        message: "item not found",
      });
    }
    const productId = item._id, quantity = item.quantity; 
    const customerId = req.user._id; // Assuming authentication middleware sets this

    console.log(`Received input: customerId=${customerId}, productId=${productId}, quantity=${quantity}`);

    if (!productId || !quantity || quantity < 1) {
      console.log("Invalid product or quantity");
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    const customer = await Customer.findById(customerId); // Find the customer
    if (!customer) {
      console.log("Customer not found");
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    const product = await Product.findById(productId); // Find the product to get its details
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({
        error: "Product not found",
      });
    }

    console.log("Product details:", product);

    const existingCartItem = customer.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      console.log(`Product already in cart. Increasing quantity by ${quantity}`);
      existingCartItem.quantity += quantity;
    } else {
      console.log("Adding new product to cart");
      customer.cart.push({
        productId: productId,
        quantity: quantity,
        price: product.price * quantity,
      });
    }

    await customer.save();
    console.log("Cart updated successfully:", customer.cart);

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: customer.cart,
    });
  } catch (error) {
    console.log("Error in addToCart:", error);
    return res.status(500).json({
      error: "Error adding product to cart",
      msg: error.message,
    });
  }
};

// Remove Product from Cart
exports.removeFromCart = async (req, res) => {
  try {
    console.log("removeFromCart called");
    const { customerId } = req.user;
    const { productId } = req.params;

    console.log(`Received input: customerId=${customerId}, productId=${productId}`);

    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.log("Customer not found");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    console.log("Current cart before removal:", customer.cart);

    customer.cart = customer.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await customer.save();
    console.log("Cart after removal:", customer.cart);

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart: customer.cart,
    });
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    return res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    console.log("getCart called");
    const customerId = req.user?._id;

    console.log(`Received input: customerId=${customerId}`);

    if (!customerId) {
      console.log("Customer ID not provided");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = await Customer.findById(customerId).populate(
      "cart.productId",
      "name price description images"
    ); // Populate product details
    console.log("Customer details fetched:", customer);

    if (!customer) {
      console.log("Customer not found");
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Calculate total cart value
    const cartTotal = customer.cart.reduce((total, item) => {
      console.log(`Calculating total: item price=${item.price}, quantity=${item.quantity}`);
      return total + item.price * item.quantity;
    }, 0);

    console.log("Cart data fetched successfully, total value:", cartTotal);

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: customer.cart,
      cartTotal: cartTotal,
    });
  } catch (error) {
    console.log("Error in getCart:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
  }
};
