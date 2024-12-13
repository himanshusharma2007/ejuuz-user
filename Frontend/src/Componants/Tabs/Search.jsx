import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { Text, Card, Chip, IconButton } from "react-native-paper";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  AddItemtoWishlist,
} from "../../../redux/features/cartSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

// Import styles


// Import services
import { searchProducts } from "../../service/productService";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Smartphone", "Laptop", "Headphones", "Smartwatch"
  ]);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const cartData = useSelector((state) => state.cart.items);

  // Debounced search effect
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

  // Focus effect for search input
  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  // Perform search for products
  const performSearch = async () => {
    try {
      setLoading(true);
      const products = await searchProducts({ keyword: searchQuery });
      setProductResults(products);

      // Add to recent searches if not already present
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => 
          [searchQuery, ...prev].slice(0, 5)
        );
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

  // Add to wishlist handler
  const addItemToWishlist = (item) => {
    dispatch(AddItemtoWishlist(item));
    navigation.navigate("Wishlist");
  };

  // Add to cart handler
  const handleAddToCart = (item) => {
    console.log('Adding to cart:', item);
    dispatch(addToCart(item));
    Toast.show({
      type: "success",
      text1: "Item Added",
      text2: "Item added to cart successfully",
      visibilityTime: 2000,
      position: "top",
    });
  };

  // Render product item
  const renderProductItem = ({ item }) => (
    <Card 
      style={styles.productCard} 
      elevation={4}
      onPress={() => navigation.navigate("ProductDetails", { 
        item: JSON.stringify(item) 
      })}
    >
      <View style={styles.productContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: item.images[0]?.url || "https://via.placeholder.com/150" 
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={() => addItemToWishlist(item)}
          >
            <Ionicons name="heart" size={24} color="#FF6B6B" />
          </TouchableOpacity> */}
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceRatingContainer}>
            <Text style={styles.productPrice}>${item.price}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.productRating}>
                {item.rating ? item.rating.toFixed(1) : "N/A"}
              </Text>
            </View>
          </View>
          <IconButton
            icon="plus"
            iconColor="#FFFFFF"
            containerColor="#4CAF50"
            size={24}
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="#F9FAFB" 
        barStyle="dark-content" 
      />

      {/* Search and Cart Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            ref={inputRef}
            placeholder="Search products"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => {}}>
            <Feather name="filter" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate("Cart")}
          style={styles.cartIconContainer}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#007AFF" />
          {cartData.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartData.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {!searchQuery && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.chipContainer}>
            {recentSearches.map((search, index) => (
              <Chip 
                key={index} 
                onPress={() => setSearchQuery(search)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {search}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Loading or Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={productResults}
          keyExtractor={(product) => product.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productListContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchQuery ? (
              <Text style={styles.resultHeaderText}>
                {`${productResults.length} results for "${searchQuery}"`}
              </Text>
            ) : null
          }
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
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentSearchesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E5E7EB',
  },
  chipText: {
    color: '#4B5563',
  },
  productListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  // wishlistButton: {
  //   position: 'absolute',
  //   top: 8,
  //   right: 8,
  //   backgroundColor: 'rgba(255,255,255,0.8)',
  //   borderRadius: 20,
  //   padding: 4,
  // },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
};