import api from "./api";
import { ToastAndroid } from "react-native";

const showToast = (message, duration = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, duration);
};

const walletService = {
  addMoney: async (amount) => {
    try {
      showToast("Adding money...", ToastAndroid.LONG);
      const response = await api.post(`/wallet/Customer/add-money`, { amount });
      showToast("Money added successfully!");
      return response.data;
    } catch (error) {
      showToast("Failed to add money!", ToastAndroid.LONG);

      throw new Error(error.response?.data?.error || "Error adding money.");
    }
  },

  withdrawMoney: async (amount) => {
    try {
      showToast("Withdrawing money...", ToastAndroid.LONG);
      const response = await api.post(`/wallet/Customer/withdraw-money`, {
        amount,
      });
      showToast("Money withdrawn successfully!");
      return response.data;
    } catch (error) {
      showToast("Failed to withdraw money!", ToastAndroid.LONG);
      throw new Error(
        error.response?.data?.error || "Error withdrawing money."
      );
    }
  },

  transferMoney: async (amount, scannedData) => {
    try {
      console.log("amount and scan data", scannedData, amount);
      showToast("Transferring money...", ToastAndroid.LONG);
      const response = await api.post(`/wallet/Customer/transfer-money`, {
        toUserPaymentId: scannedData, // Send scannedData with the backend's expected parameter name
        amount,
      });

      showToast("Money transferred successfully!");
      return response.data;
    } catch (error) {
      showToast("Failed to transfer money!", ToastAndroid.LONG);
      throw new Error(
        error.response?.data?.error || "Error transferring money."
      );
    }
  },

  getAllWalletTransactions: async (transactionType) => {
    try {
      const query = transactionType
        ? `?transactionType=${transactionType}`
        : "";
      const response = await api.get(`/wallet/Customer/transactions${query}`);
      return response.data.transactions;
    } catch (error) {
      showToast("Failed to fetch transactions!", ToastAndroid.LONG);
      throw new Error(
        error.response?.data?.error || "Error fetching transactions."
      );
    }
  },
};

export default walletService;
