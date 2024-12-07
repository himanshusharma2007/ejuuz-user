import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { Text, Button, Surface, Chip } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addToCart } from "../../../../redux/features/cartSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [ImageModel, setImageModel] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const dispatch = useDispatch();

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const productdata = JSON.parse(item);

  React.useEffect(() => {
    setQuantity(productdata.quantity);
  }, [productdata.quantity]);

  const handleaddtocart = () => {
    dispatch(addToCart(productdata));
  };

  const carouselImages = productdata.images.map((image) => ({
    id: String(image._id),
    image: image.url || image,
  }));

  const specifications = productdata.specifications;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const renderCarouselItem = ({ item }) => (
    <Pressable
      onPress={() => setImageModel(true)}
      style={styles.carouselImageContainer}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </Pressable>
  );

  const TabContent = () => {
    if (activeTab === "description") {
      return (
        <View style={styles.tabContentContainer}>
          <Text style={styles.description}>{productdata.description}</Text>

          <View style={styles.highlightsContainer}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {Object.entries(specifications)
              .filter(([_, value]) => value !== "")
              .map(([key, value]) => (
                <View key={key} style={styles.highlightItem}>
                  <Text style={styles.highlightKey}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text style={styles.highlightValue}>{value}</Text>
                </View>
              ))}
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagChipsContainer}>
              {productdata.tags.map((tag) => (
                <Chip key={tag} style={styles.tagChip}>
                  #{tag}
                </Chip>
              ))}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.reviewsContainer}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.ratingsText}>
          {productdata.ratings.length === 0
            ? "No Ratings"
            : productdata.ratings}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"dark-content"}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <View style={styles.carouselOverlay}>
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
            <TouchableOpacity>
              <Image
                source={require("../../../images/wishlist.png")}
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={carouselImages}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          <View style={styles.paginationContainer}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex
                    ? styles.paginationDotActive
                    : null,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Store Info */}
          <View style={styles.storeContainer}>
            <Text style={styles.storeName}>{productdata.shopId.name}</Text>
          </View>

          {/* Product Info */}
          <View style={styles.productInfoContainer}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productTitle}>{productdata.name}</Text>
              <Text style={styles.stockStatus}>
                {productdata.stock.length === 0
                  ? "Out of Stock"
                  : `Stock: ${productdata.stock}`}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              {productdata.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Ionicons name="arrow-down" size={16} color="#fff" />
                  <Text style={styles.discountText}>
                    {productdata.discount}%
                  </Text>
                </View>
              )}
              {productdata.mrp && (
                <Text style={styles.originalPrice}>R {productdata.mrp}</Text>
              )}
              <Text style={styles.finalPrice}>R {productdata.price}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "description" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("description")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "description" && styles.activeTabText,
                ]}
              >
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "nutrition" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("nutrition")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "nutrition" && styles.activeTabText,
                ]}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <TabContent />
        </View>
      </ScrollView>

      {/* Bottom Cart Section */}
      <Surface style={styles.cartSection}>
        <Button
          mode="contained"
          style={styles.addToCartButton}
          onPress={handleaddtocart}
        >
          Add to Cart
        </Button>
      </Surface>

      <Modal
        visible={ImageModel}
        onRequestClose={() => setImageModel(false)}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* {carouselImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.modalImage}
              />
            ))} */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  scrollView: {
    backgroundColor: "#F5F5F5",
  },
  carouselContainer: {
    position: "relative",
    height: 400,
  },
  carouselOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 25,
    padding: 8,
  },
  heartIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
  carouselImageContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: "#F5F5F5",
  },
  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productInfoContainer: {
    marginBottom: 20,
  },
  productTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    flex: 0.7,
  },
  stockStatus: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 10,
    fontSize: 14,
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  tabContentContainer: {
    padding: 15,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 15,
  },
  highlightsContainer: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  highlightKey: {
    fontWeight: "600",
    marginRight: 10,
    color: "#666",
  },
  highlightValue: {
    color: "#333",
  },
  tagsContainer: {
    marginBottom: 15,
  },
  tagChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#E0E0E0",
  },
  reviewsContainer: {
    padding: 15,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  seeAllButton: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  ratingsText: {
    color: "#666",
  },
  cartSection: {
    backgroundColor: "#fff",
    padding: 15,
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    height: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
