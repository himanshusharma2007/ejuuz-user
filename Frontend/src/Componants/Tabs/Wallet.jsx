import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";
import { getAllTransactions } from "../../service/transactionService"; // Import the transaction service

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("Account");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  useEffect(() => {
    // Set wallet balance
    setBalance(user?.walletBalance || 0);

    // Fetch transactions
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await getAllTransactions();
      // Take the 3 most recent transactions
      const recentTransactions = response.transactions
        .slice(0, 3)
        .map(transaction => ({
          id: transaction._id,
          type: transaction.totalAmount > 0 ? "credit" : "debit",
          amount: Math.abs(transaction.totalAmount),
          name: transaction.merchantDetails[0].merchantName,
          icon: transaction.totalAmount > 0 ? "⬆️" : "🏪",
          timestamp: new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      
      setTransactions(recentTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const recentContacts = [
    { id: 1, name: "Ali", avatar: "🤠" },
    { id: 2, name: "Steve", avatar: "👨🏾" },
    { id: 3, name: "Ahmed", avatar: "👨🏽" },
    { id: 4, name: "Mike", avatar: "👨" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <LinearGradient
          colors={["#7A64BC", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Main balance</Text>
          <Text style={styles.balanceAmount}>R{balance.toFixed(2)}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.action}>
              <Ionicons name="arrow-up" size={24} color="white" />
              <Text style={styles.actionText}>Top up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.action}>
              <Ionicons name="arrow-down" size={24} color="white" />
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.action}>
              <Ionicons name="swap-horizontal" size={24} color="white" />
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Cards" && styles.activeTab]}
            onPress={() => setActiveTab("Cards")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Cards" && styles.activeTabText,
              ]}
            >
              Cards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Account" && styles.activeTab]}
            onPress={() => setActiveTab("Account")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Account" && styles.activeTabText,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Account" && (
          <View style={styles.bankCard}>
            <View style={styles.bankInfo}>
              <View style={styles.bankLogo}>
                <Text style={styles.bankLogoText}>🏦</Text>
              </View>
              <View>
                <Text style={styles.bankName}>ABN AMRO BANK NV</Text>
                <Text style={styles.checkBalance}>Check Balance</Text>
              </View>
            </View>
            <Text style={styles.addAccount}>+Add Account</Text>
          </View>
        )}

        {/* Recent Contacts */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Recent Transfers</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.contactsList}
          >
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => navigation.navigate("AddContact")}
            >
              <View style={[styles.avatar, styles.addAvatar]}>
                <Text style={styles.addAvatarText}>+</Text>
              </View>
              <Text style={styles.contactName}>Add</Text>
            </TouchableOpacity>

            {recentContacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactItem}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{contact.avatar}</Text>
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Latest Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("WalletHistory")}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transaction}>
              <View style={styles.transactionInfo}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.iconText}>{transaction.icon}</Text>
                </View>
                <View>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionTime}>
                    {transaction.timestamp}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === "debit"
                    ? styles.creditAmount
                    :styles.debitAmount
                ]}
              >
                {transaction.type === "debit" ? "+" : "-"}R
                {transaction.amount.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    marginBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: "#6B46C1",
    margin: 15,
    padding: 20,
    borderRadius: 15,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 5,
  },
  balanceAmount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  action: {
    alignItems: "center",
  },
  actionText: {
    color: "white",
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 15,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#6B46C1",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#6B46C1",
    fontWeight: "500",
  },
  bankCard: {
    margin: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  bankLogoText: {
    fontSize: 20,
  },
  bankName: {
    fontWeight: "500",
  },
  checkBalance: {
    color: "#666",
    fontSize: 12,
  },
  addAccount: {
    color: "#6B46C1",
    marginTop: 10,
  },
  contactsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  contactsList: {
    flexDirection: "row",
  },
  contactItem: {
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  addAvatar: {
    backgroundColor: "#6B46C1",
  },
  addAvatarText: {
    color: "white",
    fontSize: 24,
  },
  avatarText: {
    fontSize: 24,
  },
  contactName: {
    marginTop: 5,
    fontSize: 12,
  },
  transactionsSection: {
    padding: 15,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAll: {
    color: "#6B46C1",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconText: {
    fontSize: 20,
  },
  transactionName: {
    fontWeight: "500",
  },
  transactionTime: {
    color: "#666",
    fontSize: 12,
  },
  transactionAmount: {
    fontWeight: "500",
  },
  debitAmount: {
    color: "#dc2626",
  },
  creditAmount: {
    color: "#16a34a",
  },
});
