import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function WalletTransfer() {
  const route = useRoute();
  const { item } = route.params;
  const contact = JSON.parse(item);
  const [amount, setAmount] = useState("0.00");
  const navigation = useNavigation();

  const handledonepress = () => {
    if (amount > "0.00") {
      navigation.navigate("WalletPaymentEnter", {
        amount,
        contact: JSON.stringify(contact),
      });
    } else {
      console.log("Amount is not valid", amount);
    }
  };

  const handleNumberPress = (num) => {
    if (amount === "0.00") {
      setAmount(num.toString());
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length <= 1) {
      setAmount("0.00");
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const renderNumberPad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0];

    return (
      <View style={styles.numberPadContainer}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => handleNumberPress(num)}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numberButton} onPress={handleBackspace}>
          <Ionicons name="backspace-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Transfer to</Text>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {isNaN(contact.name) ? contact.name : "Unknown"}
            </Text>
            <Text style={styles.phone}>{contact.phoneNumbers[0]?.number}</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>R</Text>
          <Text style={styles.amount}>{amount}</Text>
        </View>
        <View style={styles.blankline}></View>
      </View>

      <View style={styles.bottomContainer}>
        {/* Number Pad */}
        <View style={styles.numberPadContainerfull}>{renderNumberPad()}</View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={handledonepress}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingBottom: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    marginBottom: 16,
    marginLeft: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
    marginTop: 32,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  currency: {
    fontSize: 40,
    fontWeight: "300",
    marginRight: 4,
  },
  amount: {
    fontSize: 40,
    fontWeight: "300",
  },
  blankline: {
    height: 3,
    backgroundColor: "#2A71E6",
    width: "40%",
    alignSelf: "center",
    marginTop: 8,
  },
  numberPadContainerfull: {
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  numberPadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  numberButton: {
    width: "33.33%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 30,
    color: "#000",
  },
  doneButton: {
    backgroundColor: "#002D72",
    marginHorizontal: 16,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
