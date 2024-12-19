import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import walletService from "../../../service/walletService ";
import { fetchUser } from "../../../../redux/features/userSlice";
import { useDispatch } from "react-redux";

const WalletTransactionPin = () => {
  const [pin, setPin] = useState("");
  const maxLength = 6;
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { amount, isWithdraw, isTopUp, isTransfer, scannedData } = route.params;
  console.log("amount", amount);

  const handleNumberPress = (num) => {
    if (pin.length < maxLength) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleDone = async () => {
    try {
      if (pin.length === maxLength) {
        if (amount && isTopUp) {
          await walletService.addMoney(amount);
        } else if (amount && isWithdraw) {
          await walletService.withdrawMoney(amount);
        } else if (amount && isTransfer) {
          console.log("amount", amount);
          await walletService.transferMoney(amount, scannedData);
        }
        dispatch(fetchUser());
        navigation.navigate("PaymentDone", { pin, amount });
      } else {
        console.error("Pin length does not match the required length.");
      }
    } catch (error) {
      console.error(
        "An error occurred while processing the transaction:",
        error.message
      );
    }
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < maxLength; i++) {
      dots.push(
        <View key={i} style={styles.dotContainer}>
          <View style={[styles.dot, pin.length > i && styles.dotFilled]} />
        </View>
      );
    }
    return dots;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Your Transaction Pin</Text>

        <View style={styles.pinContainer}>{renderPinDots()}</View>

        <View style={styles.keypadContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "⌫"].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.keypadButton}
              onPress={() => {
                if (item === "⌫") {
                  handleBackspace();
                } else if (item !== ".") {
                  handleNumberPress(item.toString());
                }
              }}
            >
              <Text style={styles.keypadText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            pin.length !== maxLength && styles.buttonDisabled,
          ]}
          onPress={handleDone}
          disabled={pin.length !== maxLength}
        >
          <Text style={styles.buttonText}>Done</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002E6E",
    textAlign: "center",
    marginBottom: 16,
  },
  amountText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    color: "#666666",
  },
  amountValue: {
    fontWeight: "bold",
    color: "#002E6E",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  dotContainer: {
    padding: 8,
    marginHorizontal: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#002E6E",
    backgroundColor: "transparent",
  },
  dotFilled: {
    backgroundColor: "#002E6E",
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 32,
  },
  keypadButton: {
    width: "30%",
    aspectRatio: 2,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  keypadText: {
    fontSize: 24,
    color: "#002E6E",
  },
  button: {
    backgroundColor: "#002E6E",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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

export default WalletTransactionPin;
