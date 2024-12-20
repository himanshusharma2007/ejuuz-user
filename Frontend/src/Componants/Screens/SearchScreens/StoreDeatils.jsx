import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Text, IconButton, Badge } from "react-native-paper";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../../../../redux/features/cartSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getShopById } from "../../../service/shopservice";
import { Card } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function StoreDeatils() {
  const route = useRoute();
  const [storedata, setstoredata] = useState({});
  const { item } = route.params;
  const storeId = JSON.parse(item);
  const storeData = JSON.parse(item);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("products");

  // Get wishlist from Redux store
  const wishlist = useSelector((state) => state.cart.wishlist);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getShopById(storeId);
        setstoredata(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    dispatch(addToCartAsync(product));
    ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
  };

  // Handle adding product to wishlist
  const handleAddToWishlist = (product) => {
    // Check if product is already in wishlist
    const isInWishlist = wishlist.some((item) => item._id === product._id);

    if (isInWishlist) {
      // If already in wishlist, remove it
      dispatch(removeFromWishlistAsync(product));
      ToastAndroid.show("Removed from  Wishlist", ToastAndroid.SHORT);
    } else {
      // If not in wishlist, add it
      dispatch(addToWishlistAsync(product));
      ToastAndroid.show("Added to Wishlist", ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const StoreHeader = () => (
    <Card style={styles.bannerCard}>
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={"#fff"}
            style={styles.carouselIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Wishlist")}>
          <Image
            source={require("../../../images/wishlist.png")}
            style={styles.hearticon}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: storeData.image }}
        style={styles.banner}
        resizeMode="cover"
      />
      <View style={styles.storeHeaderContent}>
        <View style={styles.storeDetails}>
          <View>
            <Text style={styles.storeName}>{storeData.name}</Text>
            <View style={styles.storeMetrics}>
              <View style={styles.metric}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.metricText}>4.8 (2.3k)</Text>
              </View>
              <View style={styles.metric}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#4CAF50"
                />
                <Text style={styles.metricText}>1.2 km</Text>
              </View>
              <View style={styles.metric}>
                <MaterialCommunityIcons
                  name="clock"
                  size={16}
                  color="#FF9800"
                />
                <Text style={styles.metricText}>Open until 22:00</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  const TabBar = () => (
    <View style={styles.tabBar}>
      {["products", "reviews", "info"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProducts = ({ item }) => {
    const imageUri =
      item.images?.[0]?.url.replace("http", "https") ||
      "https://via.placeholder.com/150";
    const discountText = item.discount ? `${item.discount}% OFF` : null;
    const ratingText = item.avgRating ? `Rating: ${item.avgRating}` : "";

    // Check if product is in wishlist
    const isInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem._id === item._id
    );

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            item: JSON.stringify(item._id),
          })
        }
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: imageUri }} style={styles.productImage} />
          {discountText && (
            <Badge style={styles.discountBadge}>{discountText}</Badge>
          )}
        </View>
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>
              {item.name || "Unnamed Product"}
            </Text>
            <Text style={styles.productPrice}>R {item.price || "0.00"}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{ratingText}</Text>
          </View>
          <View style={styles.productFooter}>
            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={() => handleAddToWishlist(item)}
              >
                <MaterialCommunityIcons
                  name={isInWishlist ? "heart" : "heart-outline"}
                  size={20}
                  color={isInWishlist ? "#FF0000" : "#666"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} stickyHeaderIndices={[1]}>
        <StoreHeader />
        <TabBar />

        {activeTab === "products" && (
          <View style={styles.productsSection}>
            <FlatList
              data={Array.isArray(storedata.products) ? storedata.products : []}
              renderItem={renderProducts}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === "reviews" && (
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsHeader}>Reviews </Text>
            <Text style={styles.noReviews}>No Reviews </Text>
          </View>
        )}

        {activeTab === "info" && (
          <View style={styles.infoSection}>
            <Text style={styles.infoHeader}>About </Text>
            <Text style={styles.infoHeader}> {storedata.name}</Text>

            <Text style={styles.description}>{storedata.description}</Text>

            <Text style={styles.infoHeader}>Address</Text>
            <View style={styles.addressContainer}>
              <Text>{storedata.address.city} ,</Text>
              <Text>{storedata.address.country} ,</Text>
              <Text>{storedata.address.postalCode} ,</Text>
              <Text>{storedata.address.street} ,</Text>
            </View>

            <Text style={styles.infoHeader}> Owner </Text>
            <Text style={styles.owner}>{storedata.merchantId.name}</Text>

            <Text style={styles.infoHeader}>Contact</Text>
            <Text style={styles.contact}>
              Email : {storedata.contact.email}
            </Text>
            <Text style={styles.contact}>
              phoneNo : {storedata.contact.phoneNo}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  bannerCard: {
    margin: 0,
    backgroundColor: "#fff",
    borderRadius: 0,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    padding: 16,
    zIndex: 1,
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#303030",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hearticon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  banner: {
    width: "100%",
    height: 220,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
  },
  storeHeaderContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
  },
  storeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    color: "#000",
  },
  storeMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    color: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 15,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  productsSection: {
    padding: 16,
  },
  outOfStockBadge: {
    backgroundColor: "#9E9E9E",
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#fff",
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF5252",
  },
  productHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    flex: 1,
    color: "#000",
  },
  productPrice: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    padding: 8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomNavLeft: {
    flexDirection: "row",
  },
  cartButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  cartButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  reviewsSection: {
    padding: 16,
    alignItems: "center",
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 0,
  },
  noReviews: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    padding: 16,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 0,
    marginTop: 15,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  owner: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginBottom: 0,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  comingSoon: {
    fontSize: 16,
    color: "#666",
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wishlistButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 8,
  },
});
