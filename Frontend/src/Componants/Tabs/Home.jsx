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
import { getAllProducts } from "../../service/productService";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    title: "Special Offer",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "#E3F2FD",
  },
  {
    id: "2",
    title: "Special Offer",
    discount: "55% OFF",
    image:
      "https://images.unsplash.com/photo-1550344071-13ecada2a91d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "#E3F2FD",
  },
  {
    id: "3",
    title: "Special Offer",
    discount: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1498579397066-22750a3cb424?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "#E3F2FD",
  },
  // ... other banner items
];

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

const BannerItem = ({ item }) => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerContent}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.discountText}>{item.title}</Text>
        <Text style={styles.discountAmount}>{item.discount}</Text>
        <TouchableOpacity style={styles.seeDetailButton}>
          <Text style={styles.seeDetailButtonText}>See Detail</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.bannerImageContainer, { backgroundColor: item.color }]}
      >
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
      </View>
    </View>
  </View>
);

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const autoScrollTimer = useRef(null);
  const navigation = useNavigation();
  const [productdata, setAllProducts] = useState([]);

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

    navigation.navigate("ProductDetails", { item: JSON.stringify(product) });
  }, []);

  const handleDealPress = useCallback((deal) => {
    navigation.navigate("ProductDetails", { item: JSON.stringify(deal) });
  }, []);

  const startAutoScroll = useCallback(() => {
    autoScrollTimer.current = setInterval(() => {
      if (currentIndex < banners.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 3000);
  }, [currentIndex]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex, startAutoScroll]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
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

          {/* Banner Slider */}
          <View>
            <FlatList
              ref={flatListRef}
              data={banners}
              renderItem={({ item }) => (
                <BannerItem item={item} onPress={handleBannerPress} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              onMomentumScrollBegin={() => {
                if (autoScrollTimer.current) {
                  clearInterval(autoScrollTimer.current);
                }
              }}
              onMomentumScrollEnd={startAutoScroll}
            />
            <View style={styles.bannerDots}>
              {banners.map((_, index) => (
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
                <TouchableOpacity
                  key={category.category}
                  style={[
                    styles.categoryItem,
                    // { backgroundColor: category.categorycolor },
                  ]}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.7}
                >
                  {/* <Text style={styles.categoryIcon}>
                    {category.categoryicon}
                  </Text> */}
                  <Text style={styles.category}>{category.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Stores Section */}
        <View style={styles.storesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stores</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesScrollContent}
          >
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
            {recommendedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.recommendedCard}
                onPress={() => handleProductPress(product)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.recommendedImage}
                />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.discount}</Text>
                </View>
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{product.price}</Text>
                    <Text style={styles.oldPrice}>{product.oldPrice}</Text>
                  </View>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
            {weeklyDeals.map((deal) => (
              <TouchableOpacity
                key={deal.id}
                style={styles.dealCard}
                onPress={() => handleDealPress(deal)}
              >
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.dealInfo}>
                  <Text style={styles.dealName} numberOfLines={2}>
                    {deal.name}
                  </Text>
                  <View style={styles.dealPriceContainer}>
                    <Text style={styles.dealPrice}>{deal.price}</Text>
                    <Text style={styles.dealOldPrice}>{deal.oldPrice}</Text>
                  </View>
                  <View style={styles.dealBottom}>
                    <Text style={styles.saveAmount}>
                      Save {deal.saveAmount}
                    </Text>
                    <Text style={styles.validUntil}>{deal.validUntil}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Viewed Section */}
        <View style={styles.recentlyViewedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentlyViewedContent}
          >
            {/* {productdata.slice(0, 5).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentlyViewedItem}
                onPress={() => handleProductPress(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.recentlyViewedImage}
                />
                <Text style={styles.recentlyViewedName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))} */}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
