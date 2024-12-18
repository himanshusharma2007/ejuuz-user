import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { getAllProducts } from "../../../service/productService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../../../../redux/features/cartSlice";
import Toast from "react-native-toast-message";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getAllProducts();
        const data = await response;
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const addToCart = (item) => {
    console.log("add to cart called ", item);
    dispatch(addToCartAsync(item));
    Toast.show({
      type: "success",
      text1: "Item added to cart successfully",
      visibilityTime: 3000,
      position: "top",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      ) : products.length > 0 ? (
        <View style={styles.dealsSection}>
          <View style={styles.dealsGrid}>
            {products.map((deal) => (
              <TouchableOpacity
                key={deal._id}
                style={styles.dealCard}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    item: JSON.stringify(deal._id),
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      deal.images[0]?.url || "https://via.placeholder.com/150",
                  }}
                  style={styles.dealImage}
                />
                <View style={styles.dealInfo}>
                  <Text style={styles.dealName} numberOfLines={2}>
                    {deal.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <View style={styles.dealPriceContainer}>
                        <Text style={styles.dealPrice}>R{deal.price}</Text>
                        {deal.mrp ? (
                          <Text style={styles.dealOldPrice}>R{deal.mrp}</Text>
                        ) : null}
                      </View>
                      <View style={styles.dealBottom}>
                        {deal.discount ? (
                          <Text style={styles.saveAmount}>
                            {deal.discount}% OFF
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View>
                      <Ionicons
                        name="add-circle-outline"
                        size={34}
                        color="#000"
                        onPress={() => addToCart(deal)}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.noProductsText}>No products available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  // Weekly Deals Section
  dealsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  dealsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dealCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealInfo: {
    padding: 10,
  },
  dealName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  dealPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginRight: 6,
  },
  dealOldPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  dealBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveAmount: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  validUntil: {
    fontSize: 12,
    color: "#666",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductsText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 20,
  },
});
