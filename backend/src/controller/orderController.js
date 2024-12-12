const Customer = require('../model/customerModel');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const Merchant = require('../model/merchantModel');
const Transaction = require('../model/transactionModel');
const mongoose = require('mongoose');

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
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Group cart items by merchant
        const merchantGroups = {};

        for (const item of cartItems) {
            console.log("Processing cart item:", item);
            const product = await Product.findById(item.productId).populate("shopId").session(session);
            console.log("Product found:", product);

            if (!product) {
                console.log(`Product ${item.productId} not found`);
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }

            // Stock and inventory validations
            if (product.stock <= 0 || product.stock < item.quantity) {
                console.log(`Insufficient stock for product ${product.name}`);
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}, Requested quantity: ${item.quantity}`
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
                    return res.status(404).json({ error: `Merchant ${merchantId} not found` });
                }
                merchantGroups[merchantId] = [];
            }

            merchantGroups[merchantId].push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                product: product,
                merchant: await Merchant.findById(merchantId)
            });
        }

        console.log("Merchant groups:", merchantGroups);

        // Calculate total order amount and validate customer wallet
        const totalOrderAmount = Object.values(merchantGroups).reduce(
            (total, products) => total + products.reduce(
                (subtotal, prod) => subtotal + (prod.price * prod.quantity),
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
                error: 'Insufficient wallet balance',
                requiredBalance: totalOrderAmount,
                currentBalance: customer.walletBalance
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
            transactionType: 'ORDER_PAYMENT',
            status: 'PENDING',
            merchantDetails: []
        });

        console.log("Transaction initialized:", transaction);

        // Process each merchant group
        for (const [merchantId, products] of Object.entries(merchantGroups)) {
            console.log(`Processing merchant group for merchant ID ${merchantId}`);

            // Calculate total amount for this merchant's order
            const merchantTotalAmount = products.reduce(
                (total, prod) => total + (prod.price * prod.quantity),
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
                products: products.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity
                })),
                totalAmount: merchantTotalAmount
            });

            await order.save({ session });
            console.log("Order created:", order);
            orders.push(order);

            // Update merchant details for transaction
            const merchantDetail = {
                merchantId: merchant._id,
                amount: merchantTotalAmount,
                merchantWalletSnapshot: merchant.payoutBalance
            };
            transaction.merchantDetails.push(merchantDetail);
            merchantDetails.push(merchantDetail);

            // Add amount to merchant payout balance
            merchant.payoutBalance += merchantTotalAmount;
            await merchant.save({ session });
            console.log(`Updated merchant ${merchantId} payout balance:`);

            // Update product stock and sales count
            for (const prod of products) {
                prod.product.stock -= prod.quantity;
                prod.product.salesCount += prod.quantity;
                await prod.product.save({ session });
                console.log(`Updated product stock and sales count for product ${prod.productId}`);
            }
        }

        // Deduct total amount from customer wallet
        customer.walletBalance -= totalOrderAmount;
        customer.orderHistory.push(...orders.map(order => order._id));
        customer.cart = [];
        await customer.save({ session });
        console.log("Updated customer wallet balance and order history");

        // Save and complete transaction
        transaction.status = 'COMPLETED';
        await transaction.save({ session });
        console.log("Transaction completed and saved");

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        console.log("Transaction committed successfully");

        return res.status(201).json({
            message: 'Orders placed successfully',
            orders: orders,
            transaction: transaction
        });
    } catch (error) {
        console.error('Order placement error:', error);

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            message: 'Error placing order',
            error: error.message
        });
    }
};
