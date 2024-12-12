const Customer = require('../model/customerModel');
const Product = require('../model/productModel'); // Assuming you have a product model
const Order = require('../model/orderModel');
const Merchant = require('../model/merchantModel'); // Assuming you have a merchant model
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
        const customerId = req.user._id;
        const cartItems  = req.body.cart; // [{productId, quantity}, ...]
        console.log('place order called cartItems ', cartItems)
        
        // Find customer
        const customer = await Customer.findById(customerId).session(session);
        if (!customer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                error: 'Customer not found'
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

            // Stock validation check with additional check for zero stock
            if (product.stock <= 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: `Product ${product.name} is out of stock`
                });
            }

            // Stock validation check
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}, Requested quantity: ${item.quantity}`
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
                price: product.price,
                product: product  // Include the full product object for stock update
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

            // Update product stock and sales count, and add order to customer's order history
            for (const prod of products) {
                // Reduce product stock
                prod.product.stock -= prod.quantity;
                
                // Increase sales count
                prod.product.salesCount += prod.quantity;
                
                await prod.product.save({ session });
            }

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