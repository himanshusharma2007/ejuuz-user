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

// Get screen width and height
const { width, height } = Dimensions.get("window");

// // Sample vegetable data - replace with your actual backend/database data
// const vegetableData = [
//   {
//     id: "1",
//     name: "Organic Tomatoes",
//     price: 2.99,
//     image:
//       "https://plus.unsplash.com/premium_photo-1671395501275-630ae5ea02c4?q=80&w=1354&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     unit: "lb",
//     discount: 10,
//     shop: "thela of fresh veggies",
//   },
//   // Add more items if necessary
// ];

export default function CategoryDetails() {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { category } = route.params;
  const categorydata = JSON.parse(category);
  const categoryItem = categorydata.items;
  console.log(categoryItem);

  const toggleFavorite = (itemId) => {
    setFavorites((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const addToCart = (item) => {
    setCart((current) => [...current, item]);
  };

  const renderVegetableItem = ({ item }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.shopNameOnProduct}>{item.shop}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>
              ${item.price.toFixed(2)} / {item.unit}
            </Text>
            {item.discount > 0 && (
              <Text style={styles.discountBadge}>{item.discount}% OFF</Text>
            )}
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
      </View>
    );
  };

  const renderCategoryItem = ({ item }) => {
    const isFavorite = favorites.includes(item._id);
    const imageUri = item.images[0]?.url || "https://via.placeholder.com/150";
    console.log("item", item);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", { item: JSON.stringify(item) })
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
              onPress={() => toggleFavorite(item._id)}
            >
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "red" : "gray"}
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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={categorydata.category} />
        <Appbar.Action icon="cart" onPress={() => {}} />
      </Appbar.Header>

      {/* Vegetable list */}
      {/* <FlatList
        data={vegetableData}
        renderItem={renderVegetableItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      /> */}

      {/* Category item list */}
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
