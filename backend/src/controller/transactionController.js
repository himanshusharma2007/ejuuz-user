// Additional transaction-related controllers can be added here
const Transaction = require('../model/transactionModel');

exports.getTransactionHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const transactions = await Transaction.find({
            customerId: customerId 
        }).populate({
            path: 'merchantDetails.merchantId',
            select: 'name'
        }).populate('orderId', 'orderId');

        // Decrypt wallet snapshots and prepare response
        const processedTransactions = transactions.map(transaction => {
            const decryptedData = transaction.decryptWalletSnapshots();
            
            return {
                ...transaction.toObject(),
                customerWalletSnapshot: decryptedData.customerWalletSnapshot,
                merchantDetails: decryptedData.merchantDetails.map(detail => ({
                    merchantId: detail.merchantId._id,
                    merchantName: detail.merchantId.name,
                    amount: detail.amount
                    // Intentionally removed merchantWalletSnapshot
                })),
                orderId: transaction.orderId ? transaction.orderId.orderId : null,
                status: transaction.status,
                transactionType: transaction.transactionType,
                createdAt: transaction.createdAt
            };
        });

        return res.status(200).json({
            message: 'Transaction history retrieved successfully',
            transactions: processedTransactions
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving transaction history',
            error: error.message
        });
    }
};