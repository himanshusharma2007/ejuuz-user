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
      const response = await api.post(`/wallet/Customer/withdraw-money`, { amount });
      showToast("Money withdrawn successfully!");
      return response.data;
    } catch (error) {
      showToast("Failed to withdraw money!", ToastAndroid.LONG);
      throw new Error(error.response?.data?.error || "Error withdrawing money.");
    }
  },

  transferMoney: async (toUserPaymentId, amount) => {
    try {
      showToast("Transferring money...", ToastAndroid.LONG);
      const response = await api.post(`/wallet/Customer/transfer-money`, { toUserPaymentId, amount });
      showToast("Money transferred successfully!");
      return response.data;
    } catch (error) {
      showToast("Failed to transfer money!", ToastAndroid.LONG);
      throw new Error(error.response?.data?.error || "Error transferring money.");
    }
  },

  getAllWalletTransactions: async (transactionType) => {
    try {
        console.log("get all wallet transactions function called");
      const query = transactionType ? `?transactionType=${transactionType}` : "";
      const response = await api.get(`/wallet/Customer/transactions${query}`);
      console.log('response.data', response.data)
      return response.data.transactions;
    } catch (error) {
        console.log('error in get all wallet transactions', error)
      showToast("Failed to fetch transactions!", ToastAndroid.LONG);
      throw new Error(error.response?.data?.error || "Error fetching transactions.");
    }
  }
};

export default walletService;
