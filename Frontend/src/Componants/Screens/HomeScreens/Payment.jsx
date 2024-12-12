import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import AuthService from '../../../service/authService'; // Adjust the import path as needed

export default function Payment() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Fetch cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  const [userData, setUserData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        if (response && response.user) {
          setUserData(response.user);
          setWalletBalance(response.user.walletBalance || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally set a default balance or show an error
        setWalletBalance(0);
      }
    };

    fetchUserData();
  }, []);

  // Calculate order total from cart items
  const orderTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [packing] = useState(10);

  // Ensure values are numbers
  const orderTotalNum = parseFloat(orderTotal) || 0;
  const packingNum = parseFloat(packing) || 0;

  // Total payment calculation including packing
  const totalPaymentWithPacking = orderTotalNum + packingNum;

  const paymentMethods = [
    {
      id: "wallet",
      name: "Wallet",
      icon: "wallet",
      details: `Balance: R${walletBalance.toFixed(2)}`,
    },
  ];

  const handletransitionPin = () => {
    if (paymentMethods && totalPaymentWithPacking && walletBalance >= totalPaymentWithPacking) {
      navigation.navigate("TransactionPin", {
        orderItem: totalPaymentWithPacking,
      });
    }
  };

  // Rest of the component remains the same as in the previous implementation
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order</Text>
            <Text style={styles.summaryValue}>R{orderTotalNum.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Packing</Text>
            <Text style={styles.summaryValue}>R{packingNum.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R{totalPaymentWithPacking.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.selectedPayment,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentOptionContent}>
                <View style={styles.paymentOptionLeft}>
                  <Icon
                    name={method.icon}
                    size={24}
                    color={selectedPayment === method.id ? "#003366" : "#666"}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      selectedPayment === method.id &&
                        styles.selectedPaymentText,
                    ]}
                  >
                    {method.name}
                  </Text>
                </View>
                <Text style={styles.paymentDetails}>{method.details}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Continue Button or Insufficient Balance Message */}
      <Surface style={styles.bottomBar}>
        {walletBalance >= totalPaymentWithPacking ? (
          <Button
            mode="contained"
            style={styles.continueButton}
            labelStyle={styles.continueButtonText}
            onPress={handletransitionPin}
          >
            Continue
          </Button>
        ) : (
          <View style={styles.insufficientBalanceContainer}>
            <Text style={styles.insufficientBalanceText}>
              Insufficient balance. Please add money to your wallet.
            </Text>
            <Button
              mode="outlined"
              style={styles.addMoneyButton}
              labelStyle={styles.addMoneyButtonText}
              onPress={() => navigation.navigate('AddMoney')}
            >
              Add Money
            </Button>
          </View>
        )}
      </Surface>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summarySection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#666",
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  paymentSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  selectedPayment: {
    borderColor: "#003366",
    backgroundColor: "#f0f7ff",
  },
  paymentOptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
  },
  selectedPaymentText: {
    color: "#003366",
    fontWeight: "500",
  },
  paymentDetails: {
    color: "#666",
    fontSize: 14,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "white",
    elevation: 8,
  },
  continueButton: {
    backgroundColor: "#003366",
    paddingVertical: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  insufficientBalanceContainer: {
    backgroundColor: '#ffebee', // Light red background
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  insufficientBalanceText: {
    color: '#d32f2f', // Dark red text
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  addMoneyButton: {
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  addMoneyButtonText: {
    color: '#d32f2f',
  },
});
