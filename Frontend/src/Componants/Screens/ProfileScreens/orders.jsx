import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card, IconButton } from "react-native-paper";
import { Feather, Ionicons } from "@expo/vector-icons";

const items = [
  {
    id: "1",
    name: "Leather Jacket",
    price: "R 59.99 / kg",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://via.placeholder.com/150",
    status: "processing",
  },
  {
    id: "2",
    name: "Running Shoes",
    price: "R 79.99 / kg",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://via.placeholder.com/150",
    status: "Cancelled",
  },
  {
    id: "3",
    name: "Smartwatch",
    price: "R 199.99 / kg",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://via.placeholder.com/150",
    status: "Collected",
  },
];

const renderItem = ({ item }) => (
  <Card style={styles.itemCard}>
    <View style={styles.itemContent}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Text style={styles.rating}>{item.rating}</Text>
      </View>
      <IconButton
        icon="chevron-right"
        color="green"
        size={30}
        style={styles.addButton}
      />
    </View>
  </Card>
);
export default function Orders() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity onPress={() => console.log("Filter pressed")}>
          <Feather name="filter" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 10,
    width: "90%",
    alignSelf: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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
  itemImage: {
    width: 130,
    height: 130,
    // borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
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
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,

    position: "absolute",
    top: 30,
    right: 10,
  },
});
