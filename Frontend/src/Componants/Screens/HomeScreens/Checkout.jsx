import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon, Surface } from "react-native-paper";
import { getCart } from "../../../service/cartService"; // Importing cart service

export default function Checkout() {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [totalitemPrice, setTotalitemPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(50.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getCart();
        setCartItems(cartData);
        
        // Calculate total price
        const totalPrice = cartData.reduce((total, item) => 
          total + item.price, 0);
        setTotalitemPrice(totalPrice);
        
        // Calculate total quantity
        const quantity = cartData.reduce((total, item) => 
          total + item.quantity, 0);
        setTotalQuantity(quantity);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const orderTotal = totalitemPrice + convenienceFee;

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your cart...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load cart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Cart Items List */}
        {cartItems.map((item) => (
          <Surface key={item._id} style={styles.itemCard}>
            <View style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.productId.images[0].url }} 
                  style={styles.itemImage} 
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.productId.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
                  <Text style={styles.discount}>Qty: {item.quantity}</Text>
                </View>
              </View>
            </View>
          </Surface>
        ))}

        {/* Order Payment Details */}
        <Surface style={styles.paymentDetailsCard}>
          <Text style={styles.sectionTitle}>Order Payment Details</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Order Amount</Text>
            <Text style={styles.paymentAmount}>
              R {totalitemPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total Quantity</Text>
            <Text style={styles.paymentAmount}>
              {totalQuantity} Items
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <View style={styles.convenienceRow}>
              <Text style={styles.paymentLabel}>Convenience Fee</Text>
              <TouchableOpacity>
                <Text style={styles.knowMore}>Know More</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.paymentAmount}>
              R {convenienceFee.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.orderTotalLabel}>Order Total</Text>
            <Text style={styles.orderTotalValue}>
              R {orderTotal.toFixed(2)}
            </Text>
          </View>
        </Surface>
      </ScrollView>

      {/* Bottom Bar */}
      <Surface style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.totalAmount}>R {orderTotal.toFixed(2)}</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.proceedButtonContainer}
            onPress={() =>
              navigation.navigate("Payment", {
                orderTotal: orderTotal.toFixed(2),
              })
            }
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  stars: {
    color: "#FFD700",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  discount: {
    color: "#4CAF50",
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 12,
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderTotalText: {
    color: "#666",
  },
  orderTotalAmount: {
    fontWeight: "bold",
  },
  paymentDetailsCard: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  convenienceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: 16,
    color: "#333",
  },
  knowMore: {
    color: "#007AFF",
    marginLeft: 8,
    fontSize: 10,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomBar: {
    padding: 16,
    elevation: 8,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewDetails: {
    color: "#007AFF",
    marginTop: 4,
  },
  proceedButtonContainer: {
    backgroundColor: "#003366",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 14,
    borderRadius: 0,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
