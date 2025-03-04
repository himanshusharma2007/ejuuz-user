import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import {
  Appbar,
  Badge,
  Card,
  Text,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  AddItemtoWishlist,
  addToWishlistAsync,
  addToCartAsync,
} from "../../../redux/features/cartSlice";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { getAllShops } from "../../service/shopservice";
import { searchProducts } from "../../service/productService";
import ProductSearch from "./ProductSearch";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Smartphone",
    "Laptop",
    "Headphones",
    "Smartwatch",
  ]);

  const [shopdata, setShopdata] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 0) {
        performSearch();
      } else {
        setProductResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  const performSearch = async () => {
    try {
      setLoading(true);
      const products = await searchProducts({ keyword: searchQuery });
      setProductResults(products);

      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Search Error",
        text2: error.message,
        visibilityTime: 3000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log("all shop", shopdata);

  useEffect(() => {
    const fetchAllShopdata = async () => {
      try {
        const response = await getAllShops();
        setShopdata(response.data);
        // console.log("Get All Shops", response.data);
      } catch (error) {}
    };
    fetchAllShopdata();
  }, []);

  const additemtowishlist = (item) => {
    // Use the async thunk for adding to wishlist
    dispatch(addToWishlistAsync(item));
    navigation.navigate("Wishlist");
  };

  // shopdata[0].products.map((item) => {
  //   console.log("item in map", item);
  // });

  // console.log("console shop", shopdata[0].products[0][0].name);

  const handleaddtocart = (item) => {
    // Use the async thunk for adding to cart
    dispatch(addToCartAsync(item));
    Toast.show({
      type: "success",
      text1: "item added to cart successfully",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const cartdata = useSelector((state) => state.cart.items);
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + " ...";
    }
    return text;
  };

  const horizontalrenderItem = ({ item }) => {
    const imageUri =
      item.images?.[0]?.url.replace("http", "https") ||
      "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", {
            item: JSON.stringify(item._id),
          })
        }
        style={styles.productCard}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.productImage} />
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceRatingContainer}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.avgRating > 0 ? item.avgRating.toFixed(1) : "N/A"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleaddtocart(item)}
          >
            <MaterialCommunityIcons name="cart-plus" size={18} color="#FFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const shoprenderItem = ({ item }) => (
    <Card
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("StoreDetails", {
          item: JSON.stringify(item._id),
        })
      }
    >
      <View style={styles.itemContent}>
        <Image
          source={{
            uri:
              item.products[0]?.images[0]?.url.replace("http", "https") ||
              "https://via.placeholder.com/150",
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            {truncateText(item.description, 6)}
          </Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        {/* <Text style={styles.distance}>1Km</Text> */}
      </View>
    </Card>
  );

  // const filteredItems = horizontalitems.filter((item) =>
  //   item.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            ref={inputRef}
            placeholder="Search for products"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Cart with Badge */}
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <View style={styles.cartContainer}>
            <Ionicons name="cart-outline" size={24} color="#000" />
            {cartdata.length > 0 && (
              <Badge size={18} style={styles.cartBadge}>
                {cartdata.length}
              </Badge>
            )}
          </View>
        </TouchableOpacity>
      </Appbar.Header>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1, 1]}
        contentContainerStyle={styles.maincontent}
        renderItem={({ index }) => (
          <View>
            {index == 0 && (
              <View style={styles.searchResultsContainer}>
                {/* <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    marginVertical: 10,
                    textAlign: "left",
                  }}
                >
                  Product
                </Text> */}

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                  </View>
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={productResults}
                    keyExtractor={(item) => item._id}
                    renderItem={horizontalrenderItem}
                    contentContainerStyle={styles.horizontalcontent}
                    // ListHeaderComponent={
                    //   searchQuery ? (
                    //     <Text style={styles.resultHeaderText}>
                    //       {`${productResults.length} results for "${searchQuery}"`}
                    //     </Text>
                    //   ) : null
                    // }
                    ListEmptyComponent={
                      <View style={styles.emptyStateContainer}>
                        <Ionicons
                          name="search-outline"
                          size={64}
                          color="#E0E0E0"
                        />
                        <Text style={styles.emptyStateText}>
                          {searchQuery
                            ? "No products found"
                            : "Start searching for products"}
                        </Text>
                      </View>
                    }
                  />
                )}
              </View>
            )}
            {index == 1 && (
              <>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    marginVertical: 20,
                    color: "#000",
                  }}
                >
                  Shops
                </Text>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={shopdata}
                  keyExtractor={(item) => item._id}
                  renderItem={shoprenderItem}
                  contentContainerStyle={styles.content}
                />
              </>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
  },
  productCard: {
    flexDirection: "row", // Changed to row layout
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    width: "100%", // Full width of container
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF4757",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  discountText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  productInfo: {
    flex: 1, // Take remaining space
    justifyContent: "center",
    paddingVertical: 10,
    paddingRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    alignSelf: "flex-start", // Align button to start of container
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  cartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#007AFF",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  maincontent: {
    padding: 10,
    paddingBottom: 60,
  },
  searchResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    height: 150,
    resizeMode: "stretch",
    borderRadius: 8,
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
    color: "#000",
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
  distance: {
    padding: 15,
    fontSize: 20,
    fontWeight: "700",
  },
  heartButton: {
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 5,
    alignSelf: "flex-end",
  },

  resultHeaderText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    fontWeight: "500",
  },
  emptyStateContainer: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#888",
    marginTop: 16,
    textAlign: "center",
  },
  productFooter: {
    flexDirection: "row",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  productHeader: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginVertical: 4,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    padding: 5,
  },
  ratingText: {
    fontSize: 12,
    color: "#888",
  },
  addButton: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
  },
  productImageContainer: {
    marginLeft: 10,
    position: "relative",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF5252",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});
