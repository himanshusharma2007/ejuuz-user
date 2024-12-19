import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { Appbar, Badge, Card, Text, IconButton } from "react-native-paper";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromWishlistAsync,
  fetchWishlistAsync,
} from "../../../../redux/features/cartSlice";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function Wishlist() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.cart.wishlist);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistStatus = useSelector((state) => state.cart.status.wishlist);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // console.log('wishlistData in wishlist page ', wishlistData)
  // Fetch wishlist on component mount
  useEffect(() => {
    dispatch(fetchWishlistAsync());
  }, [dispatch]);

  // Handle add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCartAsync(item));
    dispatch(removeFromWishlistAsync(item));
    Toast.show({
      type: "success",
      text1: "Item Added to Cart",
      text2: `${item.name} has been added to your cart. 🎉`,
    });
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (item) => {
    dispatch(removeFromWishlistAsync(item));
    Toast.show({
      type: "error",
      text1: "Item Removed from Wishlist",
      text2: `${item.name} has been removed from your wishlist.`,
    });
  };

  // Refresh control handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchWishlistAsync()).then(() => setRefreshing(false));
  }, [dispatch]);

  // Filter wishlist based on search query
  const filteredWishlist = wishlistData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render individual wishlist item
  const renderItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemContent}>
        <Image
          source={{
            uri: item.images[0].url || "https://via.placeholder.com/150",
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            {typeof item.price === "number"
              ? `R ${item.price.toFixed(2)}`
              : item.price}
          </Text>
          <Text style={styles.rating}>{item.rating || "⭐⭐⭐⭐"}</Text>
        </View>
        <View style={styles.actionButtons}>
          <IconButton
            icon="delete"
            color="red"
            size={24}
            onPress={() => handleRemoveFromWishlist(item)}
            style={styles.actionButton}
          />
          <IconButton
            icon="plus"
            color="green"
            size={24}
            onPress={() => handleAddToCart(item)}
            style={styles.actionButton}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <Feather name="filter" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Cart with Red Dot */}
        <TouchableOpacity onPress={() => navigation.navigate("cart")}>
          <View style={styles.cartContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#007AFF" />
            <Badge style={styles.cartBadge}>{cartItems.length}</Badge>
          </View>
        </TouchableOpacity>
      </Appbar.Header>

      {/* Wishlist Content */}
      {wishlistStatus === "loading" ? (
        <View style={styles.centerContent}>
          <Text>Loading wishlist...</Text>
        </View>
      ) : filteredWishlist.length === 0 ? (
        <View style={styles.centerContent}>
          <Text>Your wishlist is empty</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredWishlist}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2f5",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  cartContainer: {
    position: "relative",
    marginRight: 10,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
  },
  content: {
    padding: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 15,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    color: "#f4b400",
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2f5",
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
});
