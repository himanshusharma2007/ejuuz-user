import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

export default function WalletPaymentEnter() {
  const route = useRoute();
  const { amount, contact } = route.params;
  const navigation = useNavigation();

  let contactdata = {};
  try {
    // Parse the contact data safely
    contactdata = JSON.parse(contact);
    // console.log("Parsed contact data:", contactdata);
  } catch (error) {
    console.error("Error parsing contact:", error.message);
  }

  // Extract name and phone number
  const contactName = contactdata?.name || "Unknown";
  const contactPhone =
    contactdata?.phoneNumbers?.[0]?.number || "No number available";

  const handleenterpayment = () => {
    if (amount) {
      // console.log("payment enter successfully !!");
      //   navigation.navigate("paymentdone");
      navigation.navigate("WalletTransactionPin");
    } else {
      console.log("payment enter failed !!");
    }
  };

  // console.log("Name:", contactName);
  // console.log("Phone:", contactPhone);
  // console.log("Amount:", amount);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Transfer to</Text>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} // Placeholder image
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {isNaN(contactName) ? contactName : "Unknown"}
            </Text>
            <Text style={styles.phone}>{contactPhone}</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>R</Text>
          <Text style={styles.amount}>{amount}</Text>
        </View>
        <View style={styles.blankline}></View>
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleenterpayment}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
