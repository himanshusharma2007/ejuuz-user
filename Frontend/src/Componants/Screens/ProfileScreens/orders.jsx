import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Card, IconButton } from "react-native-paper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getCustomerOrders } from "../../../service/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getCustomerOrders();
      if (response.status === "success" && response.data) {
        setOrders(response.data.length > 0 ? response.data : []); // Ensure array is always set
      } else {
        setOrders([]); // Handle case where no orders are returned
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]); // Default to empty array on error
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  console.log("orders", orders);
  const renderItem = ({ item }) => {
    // Extract first product details
    const firstProduct = item.products[0]?.productId || {};

    return (
      <Card style={styles.itemCard}>
        <View style={styles.itemContent}>
          <Image
            source={{
              uri:
                firstProduct.images[0]?.url ||
                "https://via.placeholder.com/150",
            }}
            style={styles.itemImage}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.itemName}>
              {firstProduct.name || "Unknown Product"}
            </Text>
            <Text style={styles.itemPrice}>
              R {firstProduct.price?.toLocaleString() || "0"} / item
            </Text>
            <Text style={styles.orderDetails}>
              Total Amount: R {item.totalAmount?.toLocaleString() || "0"}
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            color="green"
            size={30}
            style={styles.addButton}
          />
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity onPress={() => console.log("Filter pressed")}>
          <Feather name="filter" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 10,
    width: "90%",
    alignSelf: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  content: {
    padding: 10,
  },
  itemCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemImage: {
    width: 130,
    height: 130,
    marginRight: 15,
  },
  itemDetails: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  orderDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    position: "absolute",
    top: 30,
    right: 10,
  },
});
