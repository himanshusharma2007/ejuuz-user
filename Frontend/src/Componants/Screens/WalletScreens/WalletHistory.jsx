import React, { useState } from "react";
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
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function WalletHistory() {
  const theme = useTheme();
  const [searchhistory, setSearchhistory] = React.useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const transactions = [
    {
      id: 1,
      title: "Walmart",
      date: "Today 10:30",
      amount: -56.25,
      icon: "shopping",
      transactionNo: "23010412432431",
    },
    {
      id: 2,
      title: "Top up",
      date: "Yesterday 02:15",
      amount: 100.0,
      icon: "plus-circle",
      transactionNo: "23020456327821",
    },
    {
      id: 3,
      title: "Netflix",
      date: "Today 12:22",
      amount: -15.0,
      icon: "television",
      transactionNo: "23030687452367",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(searchhistory.toLowerCase())
  );

  const renderAmount = (amount) => {
    const color = amount > 0 ? "#4CAF50" : "#FF5252";
    const prefix = amount > 0 ? "+" : "";
    return (
      <Text style={[styles.amount, { color }]}>
        {prefix}${Math.abs(amount).toFixed(2)}
      </Text>
    );
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
        <Appbar.BackAction onPress={() => navigation.navigate("Wallet")} />
        <Appbar.Content title="History" />
        <TouchableOpacity onPress={() => navigation.navigate("cart")}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </Appbar.Header>

      <Surface style={styles.searchContainer}>
        <Searchbar
          value={searchhistory}
          onChangeText={setSearchhistory}
          placeholder="Search transactions history"
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="filter-variant"
          size={24}
          onPress={() => {}}
          style={styles.filterButton}
        />
      </Surface>

      <ScrollView>
        <List.Section>
          <List.Subheader>Transactions</List.Subheader>
          {filteredTransactions.map((transaction) => (
            <List.Item
              key={transaction.id}
              title={transaction.title}
              description={transaction.date}
              left={(props) => <List.Icon {...props} icon={transaction.icon} />}
              right={() => renderAmount(transaction.amount)}
              style={styles.listItem}
              onPress={() => openTransactionDetails(transaction)}
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
                  {selectedTransaction.title}
                </Text>
                <Text style={styles.modalAmount}>
                  {renderAmount(selectedTransaction.amount)}
                </Text>
                <Text style={styles.modalDetail}>
                  Date: {selectedTransaction.date}
                </Text>
                <Text style={styles.modalDetail}>
                  Transaction No: {selectedTransaction.transactionNo}
                </Text>
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  filterButton: {
    margin: 0,
  },
  listItem: {
    backgroundColor: "#fff",
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
