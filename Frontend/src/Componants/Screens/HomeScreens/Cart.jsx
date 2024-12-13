import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Card, Text, Surface, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementCartItemAsync,
  incrementCartItemAsync,
  removeFromCartAsync,
} from "../../../../redux/features/cartSlice";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function Cart() {
  const dispatch = useDispatch();
  const [totalItemQuantity, setTotalItemQuantity] = useState(0);
  const [totalItemPrice, setTotalItemPrice] = useState(0);

  const cartData = useSelector((state) => state.cart.items);
  const navigation = useNavigation();

  const removefromcart = (id) => {
    dispatch(removeFromCartAsync(id));
    Toast.show({
      type: "success",
      text1: "Item removed from cart successfully",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const decreaseItemQuantity = (productId) => {
    dispatch(decrementCartItemAsync(productId));
  };

  const increaseItemQuantity = (productId) => {
    dispatch(incrementCartItemAsync(productId));
  };

  const calculateTotalQuantityAndPrice = () => {
    const totalQuantity = cartData.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalPrice = cartData.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.price),
      0
    );

    setTotalItemQuantity(totalQuantity);
    setTotalItemPrice(totalPrice);
  };

  useEffect(() => {
    calculateTotalQuantityAndPrice();
  }, [cartData]);

  const Processtocheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleItemPress = (item) => {
    navigation.navigate("ProductDetails", {
      item: JSON.stringify(item.productId._id),
    });
    // console.log("cart handlepress ", {
    //   item: JSON.stringify(item.productId._id),
    // });
  };

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem} onPress={() => handleItemPress(item)}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.productId.images[0]?.url }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <View style={styles.headerRow}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.productId.name}
            </Text>
            <TouchableOpacity
              onPress={() => removefromcart(item.productId._id)}
              style={styles.deleteButton}
            >
              <Icon name="delete-outline" size={24} color="#FF5252" />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>R {item.productId.price}</Text>
            <Text style={styles.discount}>Upto 33% off</Text>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => decreaseItemQuantity(item.productId._id)}
              style={styles.quantityButton}
            >
              <Icon name="minus" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => increaseItemQuantity(item.productId._id)}
              style={styles.quantityButton}
            >
              <Icon name="plus" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.orderTotalContainer}>
            <Text style={styles.orderTotalLabel}>Total Order:</Text>
            <Text style={styles.orderTotalAmount}>
              R {(item.quantity * parseFloat(item.price)).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cartTitle}>
          Your Cart ({cartData.length} Items)
        </Text>
      </View>

      {cartData.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Icon name="cart-off" size={100} color="#333" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartData}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomBar}>
            <View style={styles.totalContainer}>
              <View style={styles.totalPriceContainer}>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={styles.totalAmount}>
                  R {totalItemPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={Processtocheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Icon name="cart-arrow-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  cartList: {
    padding: 16,
    paddingBottom: 100, // To ensure bottom bar doesn't cover items
  },
  cartItem: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  discount: {
    color: "#4CAF50",
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    alignSelf: "flex-start",
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 12,
  },
  orderTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderTotalLabel: {
    color: "#666",
  },
  orderTotalAmount: {
    fontWeight: "bold",
    color: "#333",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    zIndex: 5000,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalPriceContainer: {
    marginLeft: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#333",
    marginTop: 16,
  },
});
