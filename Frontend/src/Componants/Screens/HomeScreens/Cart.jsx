import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Card, Text, Button, Surface, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrement,
  incrament,
  removeFromCart,
} from "../../../../redux/features/cartSlice";
// import { addItem } from "../../../redux/feature/CheckoutSlice";
import { useNavigation } from "@react-navigation/native";

export default function Cart() {
  const dispatch = useDispatch();
  const [totalitemQuantity, setTotalitemQuantity] = useState(0);
  const [totalitemPrice, setTotalitemPrice] = useState(0);``
  const cartdata = useSelector((state) => state.cart.items);
  const navigation = useNavigation();

  console.log(cartdata);

  // React.useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {
  //       display: "none",
  //     },
  //   });
  //   return () =>
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: undefined,
  //     });
  // }, [navigation]);

  const removefromcart = (id) => {
    dispatch(removeFromCart(id));
  };

  const decreaseItemQuantity = (id) => {
    dispatch(decrement({ id }));
  };

  const increaseItemQuantity = (id) => {
    dispatch(incrament({ id }));
  };

  const totalitemquantity = () => {
    let totalitemQuantity = 0;

    cartdata.map((item) => {
      totalitemQuantity += item.quantity;
    });
    setTotalitemQuantity(totalitemQuantity);
  };

  const totalprice = () => {
    let totalitemPrice = 0;

    cartdata.map((item) => {
      totalitemPrice +=
        item.quantity * parseFloat(item.price.replace("R ", ""));
    });
    setTotalitemPrice(totalitemPrice);
  };

  useEffect(() => {
    totalitemquantity();
    totalprice();
  }, [cartdata]);

  const Processtocheckout = () => {
    // dispatch(addItem(cartdata));
    navigation.navigate("Checkout");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cartTitle}>
          You have {cartdata.length} items in your cart
        </Text>
      </View>

      {cartdata.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            style={styles.cartList}
            keyExtractor={(item) => item.id}
            data={cartdata}
            renderItem={({ item }) => (
              <Card style={styles.cartItem} key={item.id}>
                <View style={styles.itemContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <View style={styles.headerRow}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <TouchableOpacity
                        onPress={() => removefromcart(item.id)}
                        style={styles.deleteButton}
                      >
                        <Icon name="delete-outline" size={24} color="#FF5252" />
                      </TouchableOpacity>
                    </View>
                    {/* <Text style={styles.storeText}>Store: {item.store}</Text> */}
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}> {item.price}</Text>
                      {/* <Text style={styles.originalPrice}>
                      R {item.originalPrice.toFixed(2)}
                    </Text> */}
                      <Text style={styles.discount}>upto 33% off</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => decreaseItemQuantity(item.id)}
                        style={styles.quantityButton}
                      >
                        <Icon name="minus" size={20} color="#333" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => increaseItemQuantity(item.id)}
                        style={styles.quantityButton}
                      >
                        <Icon name="plus" size={20} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.orderTotalContainer}>
                      <Text style={styles.orderTotalLabel}>
                        Total Order (1kg) :
                      </Text>
                      <Text style={styles.orderTotalAmount}>
                        {/* {item.price} */}R
                        {(
                          item.quantity *
                          parseFloat(item.price.replace("R ", ""))
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            )}
          />

          <View style={styles.cartList}></View>
          <Surface style={styles.bottomBar}>
            <View style={{ flex: 1, flexDirection: "column", gap: 5 }}>
              <Text style={styles.totalLabel}>
                Total Items: {totalitemQuantity}
              </Text>
              <Text style={styles.totalLabel}>
                Total: R {totalitemPrice.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={Processtocheckout}
            >
              <Text style={styles.checkoutButtonText}>Process to Checkout</Text>
              <Icon
                name="arrow-right"
                size={20}
                color="white"
                style={styles.checkoutIcon}
              />
            </TouchableOpacity>
          </Surface>
        </>
      )}
    </View>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    padding: 4,
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
  ratingText: {
    marginRight: 4,
    fontSize: 14,
    color: "#666",
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    color: "#FFD700",
    fontSize: 16,
  },
  emptyStar: {
    color: "#D3D3D3",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 50,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
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
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#666",
    marginLeft: 8,
  },
  discount: {
    color: "#4CAF50",
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 12,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
  },

  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
  checkoutIcon: {
    marginLeft: 4,
  },
});
