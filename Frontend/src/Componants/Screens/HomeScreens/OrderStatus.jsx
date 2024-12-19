import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  Chip,
  List,
  Appbar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getOrderById } from "../../../service/orderService"; // Modify this import as needed

// Responsive utility functions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function OrderStatus() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  // Memoized responsive styles
  const styles = useMemo(() => createStyles(), [SCREEN_WIDTH, SCREEN_HEIGHT]);

  useEffect(() => {
    fetchOrderDetails();

    // Handle dimension changes
    const subscription = Dimensions.addEventListener("change", () => {
      // Force re-render to adjust layout
      fetchOrderDetails();
    });

    // Cleanup
    return () => subscription.remove();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);

      if (response.status === "success" && response.data) {
        setOrder(response.data);
      } else {
        setError(new Error("No order details found"));
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Order Status Tracking
  const orderStatusTracking = [
    {
      title: "Order Confirmed",
      completed: order?.status !== "Pending",
      time: order ? new Date(order.orderDate).toLocaleTimeString() : null,
    },
    {
      title: "Processing",
      completed: ["Processing", "Shipped", "Delivered", "Picked Up"].includes(
        order?.status
      ),
      time: order ? new Date(order.updatedAt).toLocaleTimeString() : null,
    },
    {
      title: "Shipped",
      completed: ["Shipped", "Delivered", "Picked Up"].includes(order?.status),
      time: order ? new Date(order.updatedAt).toLocaleTimeString() : null,
    },
    {
      title: "Delivered",
      completed: ["Delivered", "Picked Up"].includes(order?.status),
      time: order ? new Date(order.updatedAt).toLocaleTimeString() : null,
    },
  ];

  // Loading State
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load order details</Text>
        <Button mode="contained" onPress={fetchOrderDetails}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={`Order #${order.orderId}`}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Product Details */}
        {order.products.map((item, index) => (
          <Card key={index} style={styles.productCard}>
            <Card.Content style={styles.productContent}>
              <View style={styles.productRow}>
                <Image
                  style={styles.productImage}
                  source={{
                    uri:
                      item.productId.images[0]?.url.replace("http", "https") ||
                      "https://via.placeholder.com/150",
                  }}
                  resizeMode="cover"
                />
                <View style={styles.productDetails}>
                  <Title style={styles.productName}>
                    {item.productId.name}
                  </Title>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>
                      R {item.productId.price.toLocaleString()}
                    </Text>
                    <Text style={styles.quantityText}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryValue}>
                R {order.totalAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order Date</Text>
              <Text style={styles.summaryValue}>
                {new Date(order.orderDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Chip
                mode="outlined"
                style={[
                  styles.statusChip,
                  {
                    backgroundColor:
                      order.status === "Picked Up"
                        ? "#E8F5E9"
                        : order.status === "Processing"
                        ? "#FFF3E0"
                        : "#F3E5F5",
                  },
                ]}
              >
                {order.status}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Order Tracking */}
        <Card style={styles.trackingCard}>
          <Card.Content>
            <Title style={styles.trackingTitle}>Order Tracking</Title>
            {orderStatusTracking.map((status, index) => (
              <List.Item
                key={index}
                title={status.title}
                description={status.time || "Pending"}
                left={() => (
                  <View style={styles.statusDot}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: status.completed
                            ? "#4CAF50"
                            : "#E0E0E0",
                        },
                      ]}
                    />
                    {index < orderStatusTracking.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          {
                            backgroundColor: status.completed
                              ? "#4CAF50"
                              : "#E0E0E0",
                          },
                        ]}
                      />
                    )}
                  </View>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Pickup QR Button */}
      {order.status === "Ready For Pickup" && (
        <Button
          mode="contained"
          style={styles.pickupButton}
          icon="qrcode"
          onPress={() =>
            navigation.navigate("UniqueQR", { orderId: order._id })
          }
        >
          Pickup by QR
        </Button>
      )}
    </View>
  );
}

// Responsive Styles
const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
      backgroundColor: "white",
      elevation: 2,
    },
    headerTitle: {
      fontSize: moderateScale(16),
      fontWeight: "bold",
    },
    scrollContainer: {
      padding: moderateScale(10),
    },
    productCard: {
      marginBottom: verticalScale(10),
      borderRadius: moderateScale(10),
    },
    productContent: {
      padding: moderateScale(10),
    },
    productRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    productImage: {
      width: moderateScale(100),
      height: moderateScale(100),
      borderRadius: moderateScale(10),
      marginRight: moderateScale(10),
    },
    productDetails: {
      flex: 1,
    },
    productName: {
      fontSize: moderateScale(14),
      fontWeight: "bold",
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: verticalScale(5),
    },
    priceText: {
      fontSize: moderateScale(12),
      color: "#333",
    },
    quantityText: {
      fontSize: moderateScale(12),
      color: "#666",
    },
    summaryCard: {
      marginBottom: verticalScale(10),
      borderRadius: moderateScale(10),
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: verticalScale(5),
    },
    summaryLabel: {
      fontSize: moderateScale(12),
      color: "#666",
    },
    summaryValue: {
      fontSize: moderateScale(12),
      fontWeight: "bold",
    },
    statusChip: {
      alignSelf: "flex-end",
    },
    trackingCard: {
      marginBottom: verticalScale(10),
      borderRadius: moderateScale(10),
    },
    trackingTitle: {
      marginBottom: verticalScale(10),
    },
    statusDot: {
      alignItems: "center",
      marginRight: moderateScale(10),
    },
    dot: {
      width: moderateScale(12),
      height: moderateScale(12),
      borderRadius: moderateScale(6),
    },
    line: {
      width: moderateScale(2),
      height: verticalScale(30),
    },
    pickupButton: {
      margin: moderateScale(15),
      borderRadius: moderateScale(10),
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
      padding: moderateScale(20),
    },
    errorText: {
      fontSize: moderateScale(16),
      marginBottom: verticalScale(10),
      textAlign: "center",
    },
  });
