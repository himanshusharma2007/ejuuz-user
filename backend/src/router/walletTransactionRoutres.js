const express = require("express");
const authUser = require("../../middleware/authUser");
const {
  addMoney,
  withdrawMoney,
  transferMoney,
  getAllTransactions,
} = require("../controller/walletTransactionController");

const router = express.Router();

// Add money to wallet
router.post("/:userType/add-money", authUser, addMoney);

// Withdraw money from wallet
router.post("/:userType/withdraw-money", authUser, withdrawMoney);

// Transfer money
router.post("/:userType/transfer-money", authUser, transferMoney);

// Get all transactions
router.get("/:userType/transactions", authUser, getAllTransactions);



module.exports = router;
