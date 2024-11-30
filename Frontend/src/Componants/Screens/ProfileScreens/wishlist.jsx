import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Appbar, Badge, Card, Text, IconButton } from "react-native-paper";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/features/cartSlice";
import { useNavigation } from "@react-navigation/native";

export default function Wishlist() {
  const navigation = useNavigation();
  const wishlistdata = useSelector((state) => state.cart.wishlist);
  const dispatch = useDispatch();

  const hadleaddtocart = (item) => {
    dispatch(addToCart(item));
    // navigation.navigate("cart");
  };

  console.log("wishlist", wishlistdata);

  // Fake items data
  // const items = [
  //   {
  //     id: "1",
  //     name: "Leather Jacket",
  //     price: "R 59.99 / kg",
  //     rating: "⭐⭐⭐⭐⭐",
  //     image: "https://via.placeholder.com/150",
  //   },
  //   {
  //     id: "2",
  //     name: "Running Shoes",
  //     price: "R 79.99 / kg",
  //     rating: "⭐⭐⭐⭐⭐",
  //     image: "https://via.placeholder.com/150",
  //   },
  //   {
  //     id: "3",
  //     name: "Smartwatch",
  //     price: "R 199.99 / kg",
  //     rating: "⭐⭐⭐⭐⭐",
  //     image: "https://via.placeholder.com/150",
  //   },
  // ];

  const renderItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemContent}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <IconButton
          onPress={() => hadleaddtocart(item)}
          icon="plus"
          color="green"
          size={24}
          style={styles.removeButton}
        />
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
          <TextInput placeholder="Search" style={styles.searchInput} />
          <TouchableOpacity onPress={() => console.log("Filter pressed")}>
            <Feather name="filter" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Cart with Red Dot */}
        <TouchableOpacity onPress={() => navigation.navigate("cart")}>
          <View style={styles.cartContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#007AFF" />
            <Badge style={styles.cartBadge}>3</Badge>
          </View>
        </TouchableOpacity>
      </Appbar.Header>

      {/* Wishlist Content */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={wishlistdata}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 5,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
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
    // padding: 15,
  },
  itemImage: {
    width: 130,
    height: 130,
    // borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
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
  rating: {
    fontSize: 14,
    color: "#f4b400",
  },
  removeButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    borderColor: "green",
    borderWidth: 2,
    position: "absolute",
    top: 30,
    right: 10,
  },
});
