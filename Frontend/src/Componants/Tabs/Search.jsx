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
import { Appbar, Badge, Card, Text, IconButton } from "react-native-paper";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  AddItemtoWishlist,
} from "../../../redux/features/cartSlice";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  const additemtowishlist = (item) => {
    dispatch(AddItemtoWishlist(item));
    navigation.navigate("wishlist");
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

  const handleaddtocart = (item) => {
    dispatch(addToCart(item));
    Toast.show({
      type: "success",
      text1: "item add in cart successfully",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const horizontalitems = [
    {
      id: "1",
      name: "Leather Jacket",
      price: "R 59.99 / kg",
      rating: "⭐⭐⭐⭐⭐",
      image: "https://via.placeholder.com/150",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      quantity: 0,
    },
    {
      id: "2",
      name: "Running Shoes",
      price: "R 79.99 / kg",
      rating: "⭐⭐⭐⭐⭐",
      image: "https://via.placeholder.com/150",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      quantity: 0,
    },
    // {
    //   id: "3",
    //   name: "Smartwatch",
    //   price: "R 199.99 / kg",
    //   rating: "⭐⭐⭐⭐⭐",
    //   image: "https://via.placeholder.com/150",
    //   description:
    //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    // },
    {
      id: "3",
      name: "Leather Jacket",
      price: "R 59.99 / kg",
      rating: "⭐⭐⭐⭐⭐",
      image: "https://via.placeholder.com/150",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      quantity: 0,
    },
  ];
  const verticalitems = [
    {
      id: "1",
      name: "Rebbit Store",
      description:
        "401 East Benton Place, Chicago, Cook County, Illinois, 60601, USA",
      rating: "⭐⭐⭐⭐⭐",
      image:
        "https://plus.unsplash.com/premium_photo-1661376954615-26609d61d924?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "2",
      name: "Vegitable Store",
      description:
        "401 East Benton Place, Chicago, Cook County, Illinois, 60601, USA",
      rating: "⭐⭐⭐⭐⭐",
      image: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      name: "Rebbit Store",
      description:
        "401 East Benton Place, Chicago, Cook County, Illinois, 60601, USA",
      rating: "⭐⭐⭐⭐⭐",
      image: "https://via.placeholder.com/150",
    },
  ];

  const horizontalrenderItem = ({ item }) => (
    <Card
      style={styles.horizontalitemCard}
      onPress={() =>
        navigation.navigate("ProductDetails", { item: JSON.stringify(item) })
      }
    >
      <View style={styles.horizontalitemContent}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.horizontalitemImage}
          >
            <Ionicons
              name="heart"
              size={30}
              color="red"
              onPress={() => additemtowishlist(item)}
              style={styles.heartButton}
            />
          </ImageBackground>
        </View>

        <View style={styles.horizontalitemDetails}>
          <Text style={styles.horizontalitemName}>{item.name}</Text>
          <Text style={styles.horizontalitemPrice}>{item.price}</Text>
          <Text style={styles.horizontalrating}>{item.rating}</Text>
          <IconButton
            icon="plus"
            color="green"
            size={24}
            style={styles.horizontaladdButton}
            onPress={() => handleaddtocart(item)}
          />
        </View>
      </View>
    </Card>
  );
  const verticalrenderItem = ({ item }) => (
    <Card
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("StoreDetails", {
          item: JSON.stringify({
            id: item.id,
            name: item.name,
            description: item.description,
            rating: item.rating,
            image: item.image,
          }),
        })
      }
    >
      <View style={styles.itemContent}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            {truncateText(item.description, 6)}
          </Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.distance}>1Km</Text>
      </View>
    </Card>
  );

  const filteredItems = horizontalitems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search"
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
            <MaterialIcons name="shopping-cart" size={28} color="#007AFF" />
            <Badge style={styles.cartBadge}>{cartdata.length}</Badge>
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
              <>
                <Text
                  style={{ fontSize: 24, fontWeight: "600", marginTop: 10 }}
                >
                  Product
                </Text>

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={filteredItems}
                  keyExtractor={(item) => item.id}
                  renderItem={horizontalrenderItem}
                  contentContainerStyle={styles.horizontalcontent}
                />
              </>
            )}
            {index == 1 && (
              <>
                <Text
                  style={{ fontSize: 24, fontWeight: "600", marginTop: 20 }}
                >
                  Stores
                </Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={verticalitems}
                  keyExtractor={(item) => item.id}
                  renderItem={verticalrenderItem}
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
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 5,
    borderRadius: 12,
  },

  maincontent: {
    padding: 10,
    paddingBottom: 60,
  },
  horizontalcontent: {
    padding: 0,
  },
  content: {
    padding: 10,
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
  horizontalitemCard: {
    width: 180,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 6,
    backgroundColor: "#fff",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginRight: 15,
    overflow: "hidden",
  },

  horizontalitemContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: 170,
  },
  imageWrapper: {
    width: "100%",
    height: 130,
    borderRadius: 12, // Add border radius here
    overflow: "hidden", // Ensure child elements respect the border radius
  },

  heartButton: {
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 5,
    alignSelf: "flex-end",
  },
  horizontalitemImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  horizontalitemDetails: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  horizontalitemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  horizontalitemPrice: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  horizontalrating: {
    fontSize: 12,
    color: "#f4b400",
    marginBottom: 8,
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
  horizontaladdButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4caf50",
    position: "relative",
    left: 100,
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    borderColor: "green",
    borderWidth: 2,
    position: "absolute",
    top: 30,
    right: 10,
  },
});
