import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  List,
  Searchbar,
  Appbar,
  Surface,
  Text,
  useTheme,
  IconButton,
  Menu,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import walletService from "../../../service/walletService ";

export default function WalletHistory() {
  const theme = useTheme();
  const [searchhistory, setSearchhistory] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState("newest");
  const navigation = useNavigation();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, searchhistory, currentFilter, currentSort]);

  const fetchTransactions = async () => {
    try {
      // console.log("Fetching transactions...");
      const response = await walletService.getAllWalletTransactions();
      // console.log("Fetched transactions:", response);
      setTransactions(response);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...transactions];

    // Search filter
    if (searchhistory) {
      result = result.filter((transaction) => {
        // Search across from and to names
        const fromName = transaction.from?.name?.toLowerCase() || "";
        const toName = transaction.to?.name?.toLowerCase() || "";
        return (
          fromName.includes(searchhistory.toLowerCase()) ||
          toName.includes(searchhistory.toLowerCase())
        );
      });
    }

    // Date filter
    const now = new Date();
    switch (currentFilter) {
      case "thisWeek":
        result = result.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= oneWeekAgo;
        });
        break;
      case "thisMonth":
        result = result.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      // "all" does nothing extra
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return currentSort === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredTransactions(result);
  };

  const renderAmount = (transaction) => {
    let amount = transaction.amount;
    let color = "#4CAF50"; // default green for incoming
    let prefix = "+";

    // Determine color and prefix based on transaction type
    if (
      transaction.transactionType === "WITHDRAW" ||
      (transaction.fromModel === "Customer" &&
        transaction.transactionType === "TRANSFER")
    ) {
      color = "#FF5252"; // red for outgoing
      prefix = "-";
    }

    return (
      <Text style={[styles.amount, { color }]}>
        {prefix}${Math.abs(amount).toFixed(2)}
      </Text>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTitle = (transaction) => {
    switch (transaction.transactionType) {
      case "TRANSFER":
        return `Transfer to ${transaction.to?.name || "Unknown"}`;
      case "ADD":
        return `Wallet Top-up`;
      case "WITHDRAW":
        return "Wallet Withdrawal";
      default:
        return "Transaction";
    }
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeTransactionDetails = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.navigate("Wallet")}
          color="black"
        />
        <Appbar.Content title="History" titleStyle={{ color: "black" }} />
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </Appbar.Header>

      <Surface style={styles.searchContainer}>
        <Searchbar
          value={searchhistory}
          onChangeText={setSearchhistory}
          placeholder="Search transactions"
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />
      </Surface>

      <ScrollView>
        <List.Section>
          <View style={styles.actionButtons}>
            <List.Subheader style={{ color: "#000" }}>
              {currentFilter === "all"
                ? "All Transactions"
                : currentFilter === "thisWeek"
                ? "Transactions This Week"
                : "Transactions This Month"}
            </List.Subheader>
            <View style={styles.actionButtons}>
              {/* Filter Menu */}
              <Menu
                visible={filterMenuVisible}
                onDismiss={() => setFilterMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="filter-variant"
                    size={24}
                    onPress={() => setFilterMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setCurrentFilter("all");
                    setFilterMenuVisible(false);
                  }}
                  title="All Transactions"
                  selected={currentFilter === "all"}
                />
                <Menu.Item
                  onPress={() => {
                    setCurrentFilter("thisWeek");
                    setFilterMenuVisible(false);
                  }}
                  title="This Week"
                  selected={currentFilter === "thisWeek"}
                />
                <Menu.Item
                  onPress={() => {
                    setCurrentFilter("thisMonth");
                    setFilterMenuVisible(false);
                  }}
                  title="This Month"
                  selected={currentFilter === "thisMonth"}
                />
              </Menu>

              {/* Sort Menu */}
              <Menu
                visible={sortMenuVisible}
                onDismiss={() => setSortMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="sort"
                    size={24}
                    onPress={() => setSortMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setCurrentSort("newest");
                    setSortMenuVisible(false);
                  }}
                  title="Newest First"
                  selected={currentSort === "newest"}
                />
                <Menu.Item
                  onPress={() => {
                    setCurrentSort("oldest");
                    setSortMenuVisible(false);
                  }}
                  title="Oldest First"
                  selected={currentSort === "oldest"}
                />
              </Menu>
            </View>
          </View>
          {filteredTransactions.map((transaction) => (
            <List.Item
              key={transaction._id}
              title={getTransactionTitle(transaction)}
              titleStyle={styles.listItemText} // Apply black color to title
              description={formatDate(transaction.createdAt)}
              descriptionStyle={styles.listItemText} // Apply black color to description
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    transaction.transactionType === "ADD" ||
                    (transaction.toModel === "Customer" &&
                      transaction.transactionType === "TRANSFER")
                      ? "arrow-down"
                      : "arrow-up"
                  }
                />
              )}
              right={() => renderAmount(transaction)}
              style={styles.listItem}
            />
          ))}
        </List.Section>
      </ScrollView>

      {/* Modal for Transaction Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeTransactionDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTransaction && (
              <>
                <Text style={styles.modalTitle}>
                  {getTransactionTitle(selectedTransaction)}
                </Text>
                <Text style={styles.modalAmount}>
                  {renderAmount(selectedTransaction)}
                </Text>
                <Text style={styles.modalDetail}>
                  Date: {formatDate(selectedTransaction.createdAt)}
                </Text>
                <Text style={styles.modalDetail}>
                  Transaction ID: {selectedTransaction._id}
                </Text>
                <Text style={styles.modalDetail}>
                  Type: {selectedTransaction.transactionType}
                </Text>
                {selectedTransaction.from && (
                  <Text style={styles.modalDetail}>
                    From: {selectedTransaction.from.name}
                  </Text>
                )}
                {selectedTransaction.to && (
                  <Text style={styles.modalDetail}>
                    To: {selectedTransaction.to.name}
                  </Text>
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTransactionDetails}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  appbar: {
    backgroundColor: "#fff",
    paddingRight: 16,
    color: "000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchBar: {
    color: "000",
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    color: "#000",
  },
  listItem: {
    backgroundColor: "#fff",
    color: "#000",
  },
  listItemText: {
    color: "#000",
  },
  amount: {
    fontWeight: "bold",
    paddingRight: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalDetail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#FF5252",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
