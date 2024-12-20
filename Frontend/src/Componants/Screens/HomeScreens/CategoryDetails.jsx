import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import {
  addToCartAsync,
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../../../../redux/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

export default function CategoryDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Get wishlist from Redux store
  const wishlist = useSelector((state) => state.cart.wishlist);
  // console.log("wishlist", wishlist);
  const { category } = route.params;
  const categorydata = JSON.parse(category);
  const categoryItem = categorydata.items;

  const toggleFavorite = (item) => {
    // console.log("toggleFavorite called", item);

    // Check if item is already in wishlist
    const isInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem._id === item._id
    );

    if (isInWishlist) {
      // Remove from wishlist
      dispatch(removeFromWishlistAsync(item))
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Removed from wishlist",
            visibilityTime: 3000,
            position: "top",
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Failed to remove from wishlist",
            text2: error.message,
            visibilityTime: 3000,
            position: "top",
          });
        });
    } else {
      // Add to wishlist
      dispatch(addToWishlistAsync(item))
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Added to wishlist",
            visibilityTime: 3000,
            position: "top",
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Failed to add to wishlist",
            text2: error.message,
            visibilityTime: 3000,
            position: "top",
          });
        });
    }
  };

  const addToCart = (item) => {
    // console.log("add to cart called ", item);
    dispatch(addToCartAsync(item));
    Toast.show({
      type: "success",
      text1: "Item added to cart successfully",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const renderCategoryItem = ({ item }) => {
    // Check if item is in wishlist using Redux state
    const isInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem._id === item._id
    );
    const imageUri =
      item.images[0]?.url.replace("http", "https") ||
      "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", {
            item: JSON.stringify(item._id),
          })
        }
        style={styles.itemContainer}
      >
        <Image source={{ uri: imageUri }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item)}
            >
              <Icon
                name={isInWishlist ? "heart" : "heart-outline"}
                size={24}
                color={isInWishlist ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.shopNameOnProduct}>
              {item.avgRating === 0 ? "No Rating " : item.avgRating}
            </Text>
            {item.discount > 0 ? (
              <Text style={styles.discountBadge}>{item.discount}% OFF</Text>
            ) : null}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => addToCart(item)}
            >
              <Icon name="cart" color="white" size={20} />
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="black" />
        <Appbar.Content title={categorydata.category} color="black" />
        <Appbar.Action
          color="black"
          icon="cart"
          onPress={() => navigation.navigate("Cart")}
        />
      </Appbar.Header>

      <FlatList
        data={categoryItem}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  itemImage: {
    width: width * 0.25, // 25% of screen width
    height: width * 0.3, // Maintain aspect ratio
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shopNameOnProduct: {
    fontSize: width * 0.03, // Dynamic font size
    color: "#666",
    marginBottom: 5,
  },
  itemName: {
    fontSize: width * 0.04, // Dynamic font size
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    marginTop: 3,
    fontSize: width * 0.035, // Dynamic font size
    color: "#666",
  },
  discountBadge: {
    backgroundColor: "green",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: width * 0.03, // Dynamic font size
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 5,
  },
  cartButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cartButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
