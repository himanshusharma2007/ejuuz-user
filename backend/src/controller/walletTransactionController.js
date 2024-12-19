const Customer = require("../model/customerModel");
const WalletTransaction = require("../model/walletTransactionModel");
const Merchant = require("../model/merchantModel")
// Add Money to Wallet
exports.addMoney = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const userModel = userType === "Customer" ? Customer : Merchant;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: `${userType} not found` });
        }

        user.walletBalance += parseFloat(amount);
        await user.save();

        await WalletTransaction.create({
            transactionType: "ADD",
            amount,
            to: userId,
            toModel: userType,
        });

        return res.status(200).json({ message: "Money added successfully", balance: user.walletBalance });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Withdraw Money from Wallet
exports.withdrawMoney = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const userModel = userType === "Customer" ? Customer : Merchant;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: `${userType} not found` });
        }

        if (user.walletBalance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        user.walletBalance -= parseFloat(amount);
        await user.save();

        await WalletTransaction.create({
            transactionType: "WITHDRAW",
            amount,
            from: userId,
            fromModel: userType,
        });

        return res.status(200).json({ message: "Money withdrawn successfully", balance: user.walletBalance });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const findToUser = async (paymentId) => {
    const customerUser = await Customer.findOne({paymentId});
    if (customerUser) return {user: customerUser, userType: "Customer"};
    const merchantUser = await Merchant.findOne({paymentId});
    if (merchantUser) return {user: merchantUser, userType: "Merchant"};
    return null;
}

// Transfer Money
exports.transferMoney = async (req, res) => {
    console.log("req.body", req.body)
    const { toUserPaymentId, amount } = req.body;
    const fromId = req.user._id;
    const fromType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const fromModel = fromType === "Customer" ? Customer : Merchant;

        const fromUser = await fromModel.findById(fromId);
        const toUser = await findToUser(toUserPaymentId);

        if (!fromUser || !toUser) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        if (fromUser.walletBalance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        fromUser.walletBalance -= parseFloat(amount);
        toUser.user.walletBalance += parseFloat(amount);

        await fromUser.save();
        await toUser.user.save();

        await WalletTransaction.create({
            transactionType: "TRANSFER",
            amount,
            from: fromUser._id,
            fromModel: fromType,
            to: toUser.user._id,
            toModel: toUser.userType,
        });

        return res.status(200).json({ message: "Money transferred successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllTransactions = async (req, res) => {
    const { transactionType } = req.query;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        const filter = {};

        if (userId && userType) {
            filter.$or = [
                { from: userId, fromModel: userType },
                { to: userId, toModel: userType },
            ];
        }

        if (transactionType) {
            filter.transactionType = transactionType;
        }

        const transactions = await WalletTransaction.find(filter)
            .populate("from", "name email")
            .populate("to", "name email")
            .sort({ createdAt: -1 }); // Sort by latest transactions

        return res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            transactions,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Removed all PIN-related methods