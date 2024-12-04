const Customer = require('../model/customerModel');
const Product = require('../model/productModel'); // Assuming you have a product model
const Order = require('../models/orderModel');
const Merchant = require('../models/merchantModel'); // Assuming you have a merchant model
const mongoose = require('mongoose');

// Helper function to generate unique order ID
const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Place Order
exports.placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { customerId } = req.user;
        const { cartItems } = req.body; // [{productId, quantity}, ...]

        // Find customer
        const customer = await Customer.findById(customerId).session(session);
        if (!customer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                erorr: 'Customer not found'
            });
        }

        // Group cart items by merchant
        const merchantGroups = {};

        for (const item of cartItems) {
            const product = await Product.findById(item.productId).populate("shopId").session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    error: `Product ${item.productId} not found`
                });
            }

            // Group products by merchant
            let merchantId = product.shopId.merchantId
            if (!merchantGroups[merchantId]) {
                if (!(await Merchant.findById(merchantId))) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(404).json({
                        error: `Merchant ${merchantId} not found`
                    });
                }
                merchantGroups[merchantId] = [];
            }
            merchantGroups[merchantId].push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create orders for each merchant group
        const orders = [];
        for (const [merchantId, products] of Object.entries(merchantGroups)) {
            // Calculate total amount for this merchant's order
            const totalAmount = products.reduce(
                (total, prod) => total + (prod.price * prod.quantity),
                0
            );

            // Create order
            const order = new Order({
                customerId: customer._id,
                merchantId: merchantId,
                orderId: generateOrderId(),
                products: products.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity
                })),
                totalAmount: totalAmount
            });

            await order.save({ session });
            orders.push(order);

            // Add order to customer's order history
            customer.orderHistory.push(order._id);
        }

        // Clear customer's cart
        customer.cart = [];
        await customer.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: 'Orders placed successfully',
            orders: orders
        });
    } catch (error) {
        console.log(error)

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            message: 'Error placing order',
            error: error.message
        });
    }
};