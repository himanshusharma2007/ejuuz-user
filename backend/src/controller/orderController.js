const Customer = require("../model/customerModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const Merchant = require("../model/merchantModel");
const Transaction = require("../model/transactionModel");
const mongoose = require("mongoose");
const WalletTransaction = require("../model/walletTransactionModel");

// Helper function to generate unique order ID
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Place Order with Transaction
exports.placeOrder = async (req, res) => {
  console.log("Starting placeOrder function");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user._id;
    const cartItems = req.body.items; // [{productId, quantity}, ...]
    console.log("Customer ID:", customerId);
    console.log("Cart Items:", cartItems);

    // Find customer
    const customer = await Customer.findById(customerId).session(session);
    console.log("Customer found:", customer);
    if (!customer) {
      console.log("Customer not found");
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Customer not found" });
    }

    // Group cart items by merchant
    const merchantGroups = {};

    for (const item of cartItems) {
      console.log("Processing cart item:", item);
      const product = await Product.findById(item.productId)
        .populate("shopId")
        .session(session);
      console.log("Product found:", product);

      if (!product) {
        console.log(`Product ${item.productId} not found`);
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ error: `Product ${item.productId} not found` });
      }

      // Stock and inventory validations
      if (product.stock <= 0 || product.stock < item.quantity) {
        console.log(`Insufficient stock for product ${product.name}`);
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}, Requested quantity: ${item.quantity}`,
        });
      }

      // Group products by merchant
      const merchantId = product.shopId.merchantId;
      console.log("Merchant ID:", merchantId);

      if (!merchantGroups[merchantId]) {
        const merchant = await Merchant.findById(merchantId);
        console.log("Merchant found:", merchant);

        if (!merchant) {
          console.log(`Merchant ${merchantId} not found`);
          await session.abortTransaction();
          session.endSession();
          return res
            .status(404)
            .json({ error: `Merchant ${merchantId} not found` });
        }
        merchantGroups[merchantId] = [];
      }

      merchantGroups[merchantId].push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        product: product,
        merchant: await Merchant.findById(merchantId),
      });
    }

    console.log("Merchant groups:", merchantGroups);

    // Calculate total order amount and validate customer wallet
    const totalOrderAmount = Object.values(merchantGroups).reduce(
      (total, products) =>
        total +
        products.reduce(
          (subtotal, prod) => subtotal + prod.price * prod.quantity,
          0
        ),
      0
    );
    console.log("Total Order Amount:", totalOrderAmount);

    // Check if customer has sufficient wallet balance
    if (customer.walletBalance < totalOrderAmount) {
      console.log("Insufficient wallet balance");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: "Insufficient wallet balance",
        requiredBalance: totalOrderAmount,
        currentBalance: customer.walletBalance,
      });
    }

    // Create transaction and orders
    const orders = [];
    const merchantDetails = [];

    // Create transaction record FIRST
    const transaction = new Transaction({
      customerId: customer._id,
      customerWalletSnapshot: customer.walletBalance,
      totalAmount: totalOrderAmount,
      transactionType: "ORDER_PAYMENT",
      status: "PENDING",
      merchantDetails: [],
    });

    console.log("Transaction initialized:", transaction);

    // Process each merchant group
    for (const [merchantId, products] of Object.entries(merchantGroups)) {
      console.log(`Processing merchant group for merchant ID ${merchantId}`);

      // Calculate total amount for this merchant's order
      const merchantTotalAmount = products.reduce(
        (total, prod) => total + prod.price * prod.quantity,
        0
      );

      console.log("Merchant Total Amount:", merchantTotalAmount);

      // Find merchant
      const merchant = products[0].merchant;

      // Create order for this merchant
      const order = new Order({
        customerId: customer._id,
        merchantId: merchantId,
        orderId: generateOrderId(),
        transactionId: transaction._id,
        products: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        totalAmount: merchantTotalAmount,
      });

      const walletTransfer = new WalletTransaction({
        transactionType: "TRANSFER",
        amount: merchantTotalAmount,
        from: customer._id,
        fromModel: "Customer",
        to: merchantId,
        toModel: "Merchant",
      });

      await walletTransfer.save({ session });
      await order.save({ session });
      console.log("Order created:", order);
      orders.push(order);

      // Update merchant details for transaction
      const merchantDetail = {
        merchantId: merchant._id,
        amount: merchantTotalAmount,
        merchantWalletSnapshot: merchant.walletBalance,
      };
      transaction.merchantDetails.push(merchantDetail);
      merchantDetails.push(merchantDetail);

      // Add amount to merchant payout balance
      merchant.walletBalance += merchantTotalAmount;
      await merchant.save({ session });
      console.log(`Updated merchant ${merchantId} payout balance:`);

      // Update product stock and sales count
      for (const prod of products) {
        prod.product.stock -= prod.quantity;
        prod.product.salesCount += prod.quantity;
        await prod.product.save({ session });
        console.log(
          `Updated product stock and sales count for product ${prod.productId}`
        );
      }
    }

    // Deduct total amount from customer wallet
    customer.walletBalance -= totalOrderAmount;
    customer.orderHistory.push(...orders.map((order) => order._id));
    customer.cart = [];
    await customer.save({ session });
    console.log("Updated customer wallet balance and order history");

    // Save and complete transaction
    transaction.status = "COMPLETED";
    await transaction.save({ session });
    console.log("Transaction completed and saved");

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Transaction committed successfully");

    return res.status(201).json({
      message: "Orders placed successfully",
      orders: orders,
      transaction: transaction,
    });
  } catch (error) {
    console.error("Order placement error:", error);

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Error placing order",
      error: error.message,
    });
  }
};

// Get all orders for a specific customer
exports.getAllCustomerOrders = async (req, res) => {
  try {
    console.log("Starting getAllCustomerOrders function");
    const customerId = req.user._id;
    console.log(`Fetching orders for customer ID: ${customerId}`);

    // Find all orders for the specific customer and populate related fields
    const orders = await Order.find({ customerId })
      .populate("merchantId", "name") // Populate merchant details
      .populate("products.productId", "name price images") // Populate product details
      .populate("transactionId", "status") // Populate transaction details
      .sort({ createdAt: -1 }); // Sort by most recent orders first

    console.log(`Number of orders found: ${orders.length}`);

    console.log("Successfully retrieved customer orders");
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error in getAllCustomerOrders:", error);
    // Use the custom error handling method from the model
    const errors = Order.handleValidationError(error);

    res.status(500).json({
      status: "error",
      message: "Error retrieving customer orders",
      errors,
    });
  } finally {
    console.log("Completed getAllCustomerOrders function");
  }
};

// Get a specific order by its ID
exports.getOrderById = async (req, res) => {
  try {
    console.log("Starting getOrderById function");
    const { orderId } = req.params;
    console.log(`Searching for order with ID: ${orderId}`);

    // Find the order and populate related fields
    const order = await Order.findOne({ orderId })
      .populate("customerId", "name email ") // Populate customer details
      .populate("merchantId", "name") // Populate merchant details
      .populate("products.productId", "name price images") // Populate product details
      .populate("transactionId", "status paymentMethod"); // Populate transaction details

    console.log("Order lookup completed");

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    console.log("Successfully retrieved order details");
    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    // Use the custom error handling method from the model
    const errors = Order.handleValidationError(error);

    res.status(500).json({
      status: "error",
      message: "Error retrieving order",
      errors,
    });
  } finally {
    console.log("Completed getOrderById function");
  }
};
