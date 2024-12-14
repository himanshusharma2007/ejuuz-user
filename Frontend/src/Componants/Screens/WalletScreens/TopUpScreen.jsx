import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const TopUpScreen = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigation = useNavigation();
  const route = useRoute();

  const { title, subtitle, isTopUp, isWithdraw } = route.params;

  const handleNext = async () => {
    if (amount) {
      setLoading(true); // Start loading
      try {
        // Simulating an async operation (if needed for your logic)
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        navigation.navigate("WalletTransactionPin", {
          amount: amount,
          isTopUp,
          isWithdraw,
        });
      } catch (error) {
        console.error("Error navigating:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>R</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#B0B0B0"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!amount || loading) && styles.buttonDisabled, // Disable button when loading
          ]}
          onPress={handleNext}
          disabled={!amount || loading} // Disable button when loading or amount is empty
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" /> // Show loading spinner
          ) : (
            <Text style={styles.buttonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#002E6E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#002E6E",
    paddingBottom: 10,
  },
  currencySymbol: {
    fontSize: 32,
    color: "#002E6E",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 48,
    color: "#002E6E",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#002E6E",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default TopUpScreen;
