const express = require("express");
const {
  getTransactionHistory,
} = require("../controller/transactionController");
const authUser = require("../../middleware/authUser");

const router = express.Router();

// Get transaction history for authenticated customer
router.get("/history", authUser, getTransactionHistory);

module.exports = router;
