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

        // Decrypt wallet snapshots
        const decryptedTransactions = transactions.map(transaction => {
            const decryptedData = transaction.decryptWalletSnapshots();
            
            return {
                ...transaction.toObject(),
                customerWalletSnapshot: decryptedData.customerWalletSnapshot,
                merchantDetails: decryptedData.merchantDetails.map(detail => ({
                    merchantId: detail.merchantId,
                    merchantName: detail.merchantId.name, // Assuming populate adds name
                    amount: detail.amount,
                    merchantWalletSnapshot: detail.merchantWalletSnapshot
                }))
            };
        });

        return res.status(200).json({
            message: 'Transaction history retrieved successfully',
            transactions: decryptedTransactions
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving transaction history',
            error: error.message
        });
    }
};