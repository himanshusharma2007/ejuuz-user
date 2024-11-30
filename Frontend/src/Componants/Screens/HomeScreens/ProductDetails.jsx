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
} from "react-native";
import {
  Card,
  Text,
  Button,
  IconButton,
  Surface,
  Chip,
  Icon,
  Avatar,
  Rating,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  AddItemtoWishlist,
  addToCart,
  decrement,
  incrament,
} from "../../../../redux/features/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ProductDetailscss";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const dispatch = useDispatch();

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
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

  const additemtowishlist = () => {
    dispatch(AddItemtoWishlist(productdata));
    navigation.navigate("Wishlist");
  };
  const handleIncreaseQuantity = () => {
    dispatch(incrament(productdata.id));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decrement(productdata.id));
  };

  const carouselImages = [
    { id: "1", image: "https://via.placeholder.com/150" },
    { id: "2", image: "https://via.placeholder.com/150" },
    { id: "3", image: "https://via.placeholder.com/150" },
  ];

  const nutritionFacts = {
    calories: "41 kcal",
    protein: "0.9g",
    carbs: "9.6g",
    fiber: "2.8g",
    sugar: "4.7g",
    fat: "0.2g",
    vitamins: ["Vitamin A", "Vitamin C", "Vitamin K", "Potassium"],
  };

  // Mock review data
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://via.placeholder.com/40",
      rating: 5,
      date: "2024-03-15",
      content: "Great quality carrots! Very fresh and sweet.",
    },
    {
      id: 2,
      user: "Mike Smith",
      avatar: "https://via.placeholder.com/40",
      rating: 4,
      date: "2024-03-14",
      content: "Good value for money. Would buy again.",
    },
    {
      id: 3,
      user: "Emily Brown",
      avatar: "https://via.placeholder.com/40",
      rating: 5,
      date: "2024-03-13",
      content: "Perfect for my salads and cooking needs.",
    },
  ];

  // Mock recommended products
  const recommendedProducts = [
    {
      id: 1,
      name: "Fresh Broccoli",
      price: "15,000",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Organic Tomatoes",
      price: "12,000",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Green Bell Peppers",
      price: "9,000",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Fresh Spinach",
      price: "8,000",
      image: "https://via.placeholder.com/150",
    },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const renderCarouselItem = ({ item }) => (
    <Image
      source={{ uri: item.image }}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <Avatar.Image size={40} source={{ uri: item.avatar }} />
          <View style={styles.reviewUserInfo}>
            <Text style={styles.reviewUserName}>{item.user}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? "star" : "star-outline"}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewContent}>{item.content}</Text>
    </View>
  );

  const renderRecommendedProduct = ({ item }) => (
    <TouchableOpacity style={styles.recommendedProductCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.recommendedProductImage}
      />
      <View style={styles.recommendedProductInfo}>
        <Text style={styles.recommendedProductName}>{item.name}</Text>
        <Text style={styles.recommendedProductPrice}>R {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const TabContent = () => {
    if (activeTab === "description") {
      return (
        <Text style={styles.description}>
          The carrot is a root vegetable, most commonly observed as orange in
          color, though purple, black, red, white, and yellow cultivars exist,
          all of which are domesticated forms of the wild carrot, Daucus carota,
          native to Europe and...
        </Text>
      );
    }

    return (
      <View style={styles.nutritionContainer}>
        {Object.entries(nutritionFacts).map(([key, value], index) =>
          key !== "vitamins" ? (
            <View key={index} style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
              <Text style={styles.nutritionValue}>{value}</Text>
            </View>
          ) : (
            <View key={index} style={styles.vitaminsContainer}>
              <Text style={styles.nutritionLabel}>Key Vitamins:</Text>
              <View style={styles.vitaminsList}>
                {value.map((vitamin, idx) => (
                  <Chip key={idx} style={styles.vitaminChip}>
                    {vitamin}
                  </Chip>
                ))}
              </View>
            </View>
          )
        )}
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
      <ScrollView style={styles.scrollView}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
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
            <Image
              source={require("../../../images/wishlist.png")}
              style={styles.hearticon}
            />
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
            <Text style={styles.storeName}>Rabbit Store</Text>
            <Chip style={styles.distanceChip}>1km</Chip>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>Fresh Carrot</Text>
            <Text style={styles.price}>
              R 18,000 <Text style={styles.perKg}>/kg</Text>
            </Text>
            <Text style={styles.originalPrice}>Rp 21,000</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
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
                Nutrition facts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <TabContent />

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Recommended Products Section */}
          <View style={styles.recommendedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Products</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedProducts}
              renderItem={renderRecommendedProduct}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
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
    </View>
  );
}
