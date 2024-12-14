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

  console.log("search project ", productResults.products);

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
      console.log("Search results:", products); // Debugging
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
  console.log("cartdata", cartdata);
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + " ...";
    }
    return text;
  };

  const horizontalrenderItem = ({ item }) => {
    const imageUri = item.images?.[0]?.url || "https://via.placeholder.com/150";
    const discountText = item.discount ? `${item.discount}% OFF` : null;
    const ratingText = item.avgRating
      ? `Rating: ${item.avgRating}`
      : "No rating";

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          elevation: 2,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          overflow: "hidden",
          backgroundColor: "#fff",
          width: "100%",
        }}
      >
        <View>
          <Image
            style={{ width: 100, height: 120 }}
            source={{ uri: imageUri }}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 7 }}>{item.price} </Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.avgRating === 0 ? "No Rating" : item.avgRating}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleaddtocart(item)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
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
          source={{ uri: "https://via.placeholder.com/150" }}
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
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            ref={inputRef}
            placeholder="Search products"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => console.log("Filter pressed")}>
            <Feather name="filter" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Cart with Red Dot */}
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <View style={styles.cartContainer}>
            <Ionicons name="cart-outline" size={24} color="#000" />
            {cartdata.length === 0 ? null : (
              <Text style={styles.badge}>{cartdata.length}</Text>
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
    backgroundColor: "#fdfdfd",
    elevation: 4,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef1f7",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  badge: {
    padding: 3,
    borderRadius: 50,
    width: 16,
    height: 16,
    textAlign: "center",
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "red",
    color: "white",
    fontSize: 10,
  },

  maincontent: {
    padding: 10,
    paddingBottom: 60,
  },
  searchResultsContainer: {
    padding: 10,
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
  productCard: {
    flexDirection: "row",
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 2,
    overflow: "hidden",
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
