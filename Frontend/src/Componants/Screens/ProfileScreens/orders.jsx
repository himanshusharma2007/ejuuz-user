import React, { useState, useEffect, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Card, IconButton } from "react-native-paper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getCustomerOrders } from "../../../service/orderService";
import { useNavigation } from "@react-navigation/native";

// Responsive utility functions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => 
  size + (scale(size) - size) * factor;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized responsive styles
  const styles = useMemo(() => createStyles(), [SCREEN_WIDTH, SCREEN_HEIGHT]);

  const navigation = useNavigation();
  useEffect(() => {
    fetchOrders();
    
    // Handle dimension changes
    const subscription = Dimensions.addEventListener('change', () => {
      // Force re-render to adjust layout
      setOrders([...orders]);
    });

    // Cleanup
    return () => subscription.remove();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getCustomerOrders();
      if (response.status === "success" && response.data) {
        setOrders(response.data.length > 0 ? response.data : []); 
      } else {
        setOrders([]); 
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]); 
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(order => 
      order.products[0]?.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const renderItem = ({ item }) => {
    const firstProduct = item.products[0]?.productId || {};

    return (
      <Card style={styles.itemCard} onPress={() => navigation.navigate('OrderStatus', { orderId: item.orderId })}>
        <View style={styles.itemContent}>
          <Image
            source={{
              uri: firstProduct.images[0]?.url || "https://via.placeholder.com/150",
            }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.itemDetailsContainer}>
            <Text style={styles.statusText} numberOfLines={1}>
              {item.status}
            </Text>
            <Text style={styles.itemName} numberOfLines={2}>
              {firstProduct.name || "Unknown Product"}
            </Text>
            <Text style={styles.itemPrice}>
              R {firstProduct.price?.toLocaleString() || "0"} / item
            </Text>
            <Text style={styles.orderDetails}>
              Total Amount: R {item.totalAmount?.toLocaleString() || "0"}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.chevronContainer}
            onPress={() => console.log('Order details', item._id)}
          >
            <Feather 
              name="chevron-right" 
              size={moderateScale(24)} 
              color="green" 
            />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#0000ff" 
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity 
          onPress={fetchOrders} 
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={moderateScale(20)} 
          color="#888" 
        />
        <TextInput 
          placeholder="Search orders" 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          onPress={() => console.log("Filter pressed")}
          style={styles.filterButton}
        >
          <Feather 
            name="filter" 
            size={moderateScale(24)} 
            color="#888" 
          />
        </TouchableOpacity>
      </View>

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? "No orders match your search" 
              : "No orders found"
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          refreshing={loading}
          onRefresh={fetchOrders}
        />
      )}
    </View>
  );
}

// Dynamic Styles Creation
const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: Platform.OS === 'android' 
        ? StatusBar.currentHeight 
        : 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(20),
      backgroundColor: "#fff",
    },
    errorText: {
      fontSize: moderateScale(18),
      color: "red",
      marginBottom: verticalScale(10),
    },
    retryButton: {
      padding: moderateScale(12),
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
    },
    retryButtonText: {
      fontSize: moderateScale(16),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f2f2f2",
      borderRadius: 25,
      paddingHorizontal: moderateScale(12),
      paddingVertical: verticalScale(6),
      marginHorizontal: moderateScale(15),
      marginTop: verticalScale(10),
      marginBottom: verticalScale(10),
    },
    searchInput: {
      flex: 1,
      height: verticalScale(40),
      marginLeft: scale(10),
      fontSize: moderateScale(16),
      color: "#333",
    },
    filterButton: {
      padding: moderateScale(5),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: moderateScale(18),
      color: "#888",
    },
    listContentContainer: {
      paddingHorizontal: moderateScale(15),
      paddingBottom: verticalScale(20),
    },
    itemCard: {
      marginBottom: verticalScale(15),
      borderRadius: 12,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: moderateScale(10),
    },
    itemImage: {
      width: scale(100),
      height: scale(100),
      borderRadius: 10,
      marginRight: scale(15),
    },
    itemDetailsContainer: {
      flex: 1,
      justifyContent: "center",
    },
    statusText: {
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: "#666",
      marginBottom: verticalScale(5),
    },
    itemName: {
      fontSize: moderateScale(16),
      fontWeight: "bold",
      marginBottom: verticalScale(5),
    },
    itemPrice: {
      fontSize: moderateScale(14),
      color: "#888",
      marginBottom: verticalScale(3),
    },
    orderDetails: {
      fontSize: moderateScale(12),
      color: "#555",
    },
    chevronContainer: {
      padding: moderateScale(10),
    },
  });
};