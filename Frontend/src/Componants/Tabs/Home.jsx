import {
  StatusBar,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
  Animated,
  RefreshControl,
  Pressable,
  BackHandler,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "../Screens/HomeScreens/Homecss";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getAllDiscountedProducts,
  getAllProducts,
} from "../../service/productService";
import { getAllShops } from "../../service/shopservice";
import authService from "../../service/authService";
import { useSelector } from "react-redux";
import { Badge } from "react-native-paper";
import Categories from "../Screens/HomeScreens/Categories";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import LoadingIndicator from "./LoadingIndicator";

const { width } = Dimensions.get("window");

const BannerDot = ({ index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const width_animated = scrollX.interpolate({
    inputRange,
    outputRange: [8, 16, 8],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: width_animated,
          opacity,
        },
      ]}
    />
  );
};

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const autoScrollTimer = useRef(null);
  const isManualScroll = useRef(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const [productdata, setAllProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [shopdata, setShopdata] = useState([]);
  const cartData = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [discountedResponse, productsResponse, shopsResponse] =
          await Promise.all([
            getAllDiscountedProducts(),
            getAllProducts(),
            getAllShops(),
          ]);
        setDiscountedProducts(discountedResponse.products || []);
        setAllProducts(productsResponse.products);
        setShopdata(shopsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBackPress = () => {
    Alert.alert("Exit App", "Are you sure you want to exit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "exit",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    })
  );

  const categories = useMemo(() => {
    const categoryMap = new Map();

    productdata.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          category: product.category,
          items: [],
        });
      }
      categoryMap.get(product.category).items.push(product);
    });

    return Array.from(categoryMap.values());
  }, [productdata]);

  const handleNavigate = () => {
    navigation.navigate("SearchTab", { foucesInput: true });
  };

  const handleProductPress = useCallback((product) => {
    navigation.navigate("ProductDetails", {
      item: JSON.stringify(product._id),
    });
  }, []);

  const handleDealPress = useCallback((deal) => {
    navigation.navigate("ProductDetails", { item: JSON.stringify(deal._id) });
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    if (discountedProducts.length > 1) {
      autoScrollTimer.current = setInterval(() => {
        if (!isManualScroll.current && discountedProducts.length > 1) {
          const nextIndex = (currentIndex + 1) % discountedProducts.length;

          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      }, 3000);
    }
  }, [currentIndex, discountedProducts.length]);

  const handleScrollBegin = () => {
    isManualScroll.current = true;
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  const handleScrollEnd = () => {
    setTimeout(() => {
      isManualScroll.current = false;
      startAutoScroll();
    }, 500);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [discountedResponse, productsResponse, shopsResponse] =
        await Promise.all([
          getAllDiscountedProducts(),
          getAllProducts(),
          getAllShops(),
        ]);
      setDiscountedProducts(discountedResponse.products || []);
      setAllProducts(productsResponse.products);
      setShopdata(shopsResponse.data);
    } catch (error) {
      console.error("Error refreshing data", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCategoryPress = useCallback((category) => {
    navigation.navigate("CategoryDetails", {
      category: JSON.stringify({
        ...category,
        items: category.items,
      }),
    });
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchText) return categories;

    return categories.filter(
      (category) =>
        category.category.toLowerCase().includes(searchText.toLowerCase()) ||
        category.items.some((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
    );
  }, [categories, searchText]);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + " ...";
    }
    return text;
  };

  const BannerItems = ({ item, onPress }) => {
    return (
      <Pressable onPress={() => onPress(item)} style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.discountText}>
              {item.name || "Special Offer"}
            </Text>
            <Text style={styles.discountAmount}>
              {item.discount ? `${item.discount}% OFF` : "Great Deals"}
            </Text>
            <TouchableOpacity style={styles.seeDetailButton}>
              <Text style={styles.seeDetailButtonText}>See Detail</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.bannerImageContainer,
              { backgroundColor: item.color || "#E3F2FD" },
            ]}
          >
            <Image
              source={{
                uri:
                  item.images && item.images.length > 0
                    ? item.images[0].url.replace("http", "https")
                    : "https://via.placeholder.com/300x200.png?text=No+Image",
              }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex, startAutoScroll]);

  const renderHome = () => {
    return (
      <>
        <View style={styles.curve}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../src/images/ejuuzlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search for fruits, vegetables, etc..."
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                clearButtonMode="while-editing"
                onFocus={handleNavigate}
              />
              {searchText ? (
                <TouchableOpacity
                  onPress={() => setSearchText("")}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Cart")}
              >
                <Ionicons name="cart-outline" size={24} color="#FFF" />
                {cartData.length > 0 && (
                  <Text style={styles.badge}>{cartData.length}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.locationBar}>
            <Ionicons name="location-outline" size={20} color="#FFF" />
            <Text style={styles.locationText} numberOfLines={1}>
              Sent to: Pamulang Barat Residence No.5, RT 05/...
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFF" />
          </TouchableOpacity>

          <View>
            {loading ? (
              <View style={styles.contentContainerStyle}>
                <View style={styles.loadingContainer}>
                  <ContentLoader
                    speed={2}
                    width={width - 40}
                    height={200}
                    viewBox="0 0 300 200"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="2"
                      y="10"
                      rx="10"
                      ry="10"
                      width="120"
                      height="40"
                    />
                    <Rect
                      x="4"
                      y="70"
                      rx="20"
                      ry="20"
                      width="120"
                      height="40"
                    />

                    <Circle cx="30" cy="30" r="50" y={25} x={230} />
                  </ContentLoader>
                </View>
              </View>
            ) : (
              // <LoadingIndicator />
              <>
                {discountedProducts.length > 0 ? (
                  <FlatList
                    ref={flatListRef}
                    data={discountedProducts}
                    renderItem={({ item }) => (
                      <BannerItems item={item} onPress={handleProductPress} />
                    )}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                      { useNativeDriver: false }
                    )}
                    onScrollBeginDrag={handleScrollBegin}
                    onScrollEndDrag={handleScrollEnd}
                    onMomentumScrollBegin={handleScrollBegin}
                    onMomentumScrollEnd={handleScrollEnd}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    snapToAlignment="center"
                    decelerationRate="fast"
                  />
                ) : (
                  <View style={styles.noBannersContainer}>
                    <Text style={styles.noBannersText}>
                      No banners available
                    </Text>
                  </View>
                )}
                <View style={styles.bannerDots}>
                  {discountedProducts.map((_, index) => (
                    <BannerDot key={index} index={index} scrollX={scrollX} />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            {loading ? (
              <>
                <ContentLoader
                  speed={2}
                  width={100}
                  height={20}
                  viewBox={`0 0 100 20`}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="10" ry="10" width="97" height="20" />
                </ContentLoader>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Categories</Text>
              </>
            )}
          </View>
          <View style={styles.categoriesGrid}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {loading ? (
                <View style={styles.CategorycontentContainerStyle}>
                  <View style={styles.CategoryloadingContainer}>
                    <ContentLoader
                      speed={2}
                      width={width - 40}
                      height={60}
                      viewBox={`0 0 ${width - 40} 60`}
                      backgroundColor="#f3f3f3"
                      foregroundColor="#ecebeb"
                    >
                      <Rect
                        x="0"
                        y="0"
                        rx="10"
                        ry="10"
                        width="97"
                        height="55"
                      />
                      <Rect
                        x="110"
                        y="0"
                        rx="10"
                        ry="10"
                        width="97"
                        height="55"
                      />
                      <Rect
                        x="220"
                        y="0"
                        rx="10"
                        ry="10"
                        width="97"
                        height="55"
                      />
                      <Rect
                        x="330"
                        y="0"
                        rx="10"
                        ry="10"
                        width="97"
                        height="55"
                      />
                    </ContentLoader>
                  </View>
                </View>
              ) : (
                <>
                  {filteredCategories.map((category) => (
                    <Categories
                      key={category.category}
                      category={category.category}
                      onPress={() => handleCategoryPress(category)}
                    />
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>

        <View style={styles.storesSection}>
          <View style={styles.sectionHeader}>
            {loading ? (
              <>
                <ContentLoader
                  speed={2}
                  width={130}
                  height={20}
                  viewBox={`0 0 130 20`}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="10" ry="10" width="107" height="20" />
                </ContentLoader>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Popular Shop</Text>
              </>
            )}

            {loading ? (
              <>
                <ContentLoader
                  speed={2}
                  width={90}
                  height={20}
                  viewBox={`0 0 90 20`}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="10" ry="10" width="90" height="20" />
                </ContentLoader>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AllProducts")}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesScrollContent}
          >
            {loading ? (
              <View style={styles.PopularcontentContainerStyle}>
                <View style={styles.PopularloadingContainer}>
                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>

                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>

                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>
                </View>
              </View>
            ) : (
              <>
                {shopdata.map((item) => {
                  const imgageUri = "https://via.placeholder.com/150";
                  return (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.recommendedCard}
                      onPress={() =>
                        navigation.isFocused() &&
                        navigation.navigate("SearchTab", {
                          screen: "StoreDetails",
                          params: {
                            item: JSON.stringify(item._id),
                          },
                        })
                      }
                    >
                      <Image
                        source={{
                          uri:
                            item.products[0]?.images[0]?.url.replace(
                              "http",
                              "https"
                            ) || imgageUri,
                        }}
                        style={styles.recommendedImage}
                      />
                      <View style={styles.recommendedInfo}>
                        <Text style={styles.recommendedName} numberOfLines={1}>
                          {item.name.length > 20 ? "..." : item.name}
                        </Text>

                        <Text>{truncateText(item.description, 5)}</Text>
                        <Text style={styles.ratingText}>
                          {item.avgRating === 0 ? "No rating" : item.avgRating}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>

        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            {loading ? (
              <>
                <ContentLoader
                  speed={2}
                  width={150}
                  height={20}
                  viewBox={`0 0 150 20`}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <Rect x="0" y="0" rx="10" ry="10" width="125" height="20" />
                </ContentLoader>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Recommended for You</Text>
              </>
            )}

            {loading ? (
              <ContentLoader
                speed={2}
                width={90}
                height={20}
                viewBox={`0 0 90 20`}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <Rect x="0" y="0" rx="10" ry="10" width="90" height="20" />
              </ContentLoader>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("AllProducts")}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScrollContent}
          >
            {loading ? (
              <View style={styles.PopularcontentContainerStyle}>
                <View style={styles.PopularloadingContainer}>
                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>

                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>

                  <ContentLoader
                    speed={2}
                    width={140}
                    height={230}
                    viewBox="0 0 140 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <Rect
                      x="0"
                      y="0"
                      rx="10"
                      ry="10"
                      width="140"
                      height="130"
                    />
                    <Rect
                      x="0"
                      y="140"
                      rx="10"
                      ry="10"
                      width="100"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="60"
                      y="165"
                      rx="10"
                      ry="10"
                      width="50"
                      height="20"
                    />
                    <Rect
                      x="0"
                      y="191"
                      rx="10"
                      ry="10"
                      width="90"
                      height="20"
                    />
                  </ContentLoader>
                </View>
              </View>
            ) : (
              <>
                {discountedProducts.map((product) => {
                  const imgageUri =
                    product.images[0]?.url.replace("http", "https") ||
                    "https://via.placeholder.com/150";

                  return (
                    <TouchableOpacity
                      key={product._id}
                      style={styles.recommendedCard}
                      onPress={() => handleProductPress(product)}
                    >
                      <Image
                        source={{ uri: imgageUri }}
                        style={styles.recommendedImage}
                      />
                      {product.discount > 0 && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>
                            {product.discount}%
                          </Text>
                        </View>
                      )}
                      <View style={styles.recommendedInfo}>
                        <Text style={styles.recommendedName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.price}>R{product.price}</Text>
                          <Text style={styles.oldPrice}>R{product.mrp}</Text>
                        </View>
                        <Text style={styles.ratingText}>
                          {product.avgRating === 0
                            ? `⭐ (5.0)`
                            : product.avgRating > 0
                            ? `⭐ (${product.avgRating.toFixed(1)})`
                            : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>

        {loading ? null : (
          <>
            <View style={styles.dealsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Weekly Deals</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AllProducts")}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dealsGrid}>
                {[...discountedProducts].reverse().map((deal) => (
                  <TouchableOpacity
                    key={deal._id}
                    style={styles.dealCard}
                    onPress={() => handleDealPress(deal)}
                  >
                    <Image
                      source={{
                        uri:
                          deal.images[0]?.url.replace("http", "https") ||
                          "https://via.placeholder.com/150",
                      }}
                      style={styles.dealImage}
                    />
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealName} numberOfLines={2}>
                        {deal.name}
                      </Text>
                      <View style={styles.dealPriceContainer}>
                        <Text style={styles.dealPrice}>R{deal.price}</Text>
                        <Text style={styles.dealOldPrice}>R{deal.mrp}</Text>
                      </View>
                      <View style={styles.dealBottom}>
                        <Text style={styles.saveAmount}>
                          {deal.discount}% OFF
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#002E6E" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderHome()}
      </ScrollView>
    </SafeAreaView>
  );
}
