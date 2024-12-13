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
import { useNavigation } from "@react-navigation/native";
import {
  getAllDiscountedProducts,
  getAllProducts,
} from "../../service/productService";
import { getAllShops } from "../../service/shopservice";
import authService from "../../service/authService";
import { useSelector } from "react-redux";
import { Badge } from "react-native-paper";
import Categories from "../Screens/HomeScreens/Categories";

const { width } = Dimensions.get("window");

const recommendedProducts = [
  {
    id: "r1",
    name: "Fresh Berries Mix",
    price: "R 129.99",
    oldPrice: "R 159.99",
    discount: "20%",
    rating: "⭐⭐⭐⭐½",
    image:
      "https://images.unsplash.com/photo-1613082410785-22292e8426e7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "r2",
    name: "Oranges",
    price: "R 89.99",
    oldPrice: "R 99.99",
    discount: "10%",
    rating: "⭐⭐⭐⭐⭐",
    image:
      "https://plus.unsplash.com/premium_photo-1669631944923-75bbc991f223?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "r3",
    name: "Whole Grain Bread",
    price: "R 45.99",
    oldPrice: "R 54.99",
    discount: "15%",
    rating: "⭐⭐⭐⭐",
    image:
      "https://images.unsplash.com/photo-1533782654613-826a072dd6f3?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // Add more recommended products as needed
];

const weeklyDeals = [
  {
    id: "d1",
    name: "Fresh Vegetables Bundle",
    price: "R 199.99",
    oldPrice: "R 299.99",
    saveAmount: "R 100",
    image:
      "https://plus.unsplash.com/premium_photo-1661376954615-26609d61d924?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    validUntil: "3 days left",
  },
  {
    id: "d2",
    name: "Fruit Box",
    price: "R 249.99",
    oldPrice: "R 349.99",
    saveAmount: "R 100",
    image:
      "https://images.unsplash.com/photo-1583754744912-637265c87826?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    validUntil: "5 days left",
  },
  {
    id: "d3",
    name: "Fruit Box",
    price: "R 249.99",
    oldPrice: "R 349.99",
    saveAmount: "R 100",
    image:
      "https://images.unsplash.com/photo-1583754744912-637265c87826?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    validUntil: "5 days left",
  },
  // Add more deals as needed
];

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

  const navigation = useNavigation();
  const [productdata, setAllProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [shopdata, setShopdata] = useState([]);
  const cartData = useSelector((state) => state.cart.items);

  // console.log("cart data length", cartData.length);

  useEffect(() => {
    const fetchAllTopDiscountProduct = async () => {
      try {
        const response = await getAllDiscountedProducts();
        // console.log("API Response:", response);
        setDiscountedProducts(response.products || []);
      } catch (error) {
        console.error("Error fetching all products", error);
      }
    };
    fetchAllTopDiscountProduct();
  }, []);

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const response = await getAllProducts();
        setAllProducts(response.products);
      } catch (error) {
        console.error("Error fetching all products", error);
      }
    };
    fetchallproducts();
  }, []);

  // console.log("productdata", productdata);
  // console.log("allProducts", productdata.map((product) => product.category));

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

  useState(() => {
    const fetchcurentuser = async () => {
      try {
        const response = await authService.getCurrentUser();
        console.log("current user is", response);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchcurentuser();
  }, []);
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
    // router.push({
    //   pathname: `/home/productdetails`,
    //   params: { item: JSON.stringify(product) },
    // });

    navigation.navigate("ProductDetails", {
      item: JSON.stringify(product._id),
    });
  }, []);

  const handleDealPress = useCallback((deal) => {
    navigation.navigate("ProductDetails", { item: JSON.stringify(deal._id) });
  }, []);
  const startAutoScroll = useCallback(() => {
    // Clear existing timer
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    // Only start auto-scroll if there are multiple items
    if (discountedProducts.length > 1) {
      autoScrollTimer.current = setInterval(() => {
        // Ensure not in manual scroll mode and has multiple items
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

  // Scroll Event Handlers with More Robust Logic
  const handleScrollBegin = () => {
    isManualScroll.current = true;
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  const handleScrollEnd = () => {
    // Reset manual scroll with a slight delay
    setTimeout(() => {
      isManualScroll.current = false;
      startAutoScroll();
    }, 500);
  };

  // Improved Viewability Configuration
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
      const response = await getAllDiscountedProducts();
      setDiscountedProducts(response.products || []);
    } catch (error) {
      console.error("Error refreshing data", error);
    }
    setRefreshing(false);
  }, []);

  const handleBannerPress = useCallback((banner) => {
    console.log("Banner pressed:", banner);
  }, []);

  const handleCategoryPress = useCallback((category) => {
    navigation.navigate("CategoryDetails", {
      category: JSON.stringify({
        ...category,
        items: category.items,
      }),
    });
  }, []);

  const handleStorePress = useCallback((id) => {
    console.log("Store pressed:", id);
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

  const BannerDot = ({ index, scrollX }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 16, 8],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotWidth,
            opacity,
          },
        ]}
      />
    );
  };

  // Banner Item Component
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
                    ? item.images[0].url
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

  // Auto Scroll Effect with Enhanced Control
  useEffect(() => {
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex, startAutoScroll]);

  // console.log("discountedProducts", discountedProducts);

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
        <View style={styles.curve}>
          {/* Logo and Header */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../src/images/ejuuzlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Header */}
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

              {/* <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Location Bar */}
          <TouchableOpacity style={styles.locationBar}>
            <Ionicons name="location-outline" size={20} color="#FFF" />
            <Text style={styles.locationText} numberOfLines={1}>
              Sent to: Pamulang Barat Residence No.5, RT 05/...
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFF" />
          </TouchableOpacity>
          {/* Banner slider */}
          <View>
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
                <Text style={styles.noBannersText}>No banners available</Text>
              </View>
            )}
            <View style={styles.bannerDots}>
              {discountedProducts.map((_, index) => (
                <BannerDot key={index} index={index} scrollX={scrollX} />
              ))}
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {/* <FlatList
              data={filteredCategories}
              horizontal
              style={{gap:10, marginHorizontal:10}}
              keyExtractor={(category) => category.id}
             renderItem={({ item }) => (
               <TouchableOpacity  key={item.category}
               style={[
                 styles.categoryItem,
                 { backgroundColor: item.categorycolor },
               ]}
               onPress={() => handleCategoryPress(category)}
               activeOpacity={0.7}
             >
                  <Text style={styles.categoryIcon}>{item.categoryicon}</Text>
                  <Text style={styles.category}>{item.category}</Text>

             </TouchableOpacity>
             )} 
            /> */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {filteredCategories.map((category) => (
                <Categories
                  key={category.category}
                  category={category.category}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}

              {/* <TouchableOpacity
                   key={category.category}
                   style={[
                     styles.categoryItem,
                      { backgroundColor: category.categorycolor },
                   ]}
                   onPress={() => handleCategoryPress(category)}
                   activeOpacity={0.7}
                 >
                   <Text style={styles.categoryIcon}>
                     {category.categoryicon}
                   </Text>
                   <Text style={styles.category}>{category.category}</Text>
                 </TouchableOpacity> */}
            </ScrollView>
          </View>
        </View>

        {/* Stores Section */}
        <View style={styles.storesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Shop</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesScrollContent}
          >
            {shopdata.map((item) => {
              const imgageUri = "https://via.placeholder.com/150";
              // console.log("productdata", productdata);
              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.recommendedCard}
                  onPress={() =>
                    navigation.navigate("StoreDetails", {
                      item: JSON.stringify(item._id),
                    })
                  }
                >
                  <Image
                    source={{ uri: imgageUri }}
                    style={styles.recommendedImage}
                  />
                  {/* <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.discount}</Text>
                  </View> */}
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
            {/* {productdata.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.storeCard}
                onPress={() => handleStorePress(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.storeImage} />
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{item.name}</Text>
                  <View style={styles.storeRating}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))} */}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScrollContent}
          >
            {discountedProducts.map((product) => {
              const imgageUri =
                product.images[0]?.url || "https://via.placeholder.com/150";
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
          </ScrollView>
        </View>

        {/* Weekly Deals Section */}
        <View style={styles.dealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Deals</Text>
            <TouchableOpacity>
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
                      deal.images[0]?.url || "https://via.placeholder.com/150",
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
                    <Text style={styles.saveAmount}>{deal.discount}% OFF</Text>
                    {/* <Text style={styles.validUntil}>{deal.discount}</Text> */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
