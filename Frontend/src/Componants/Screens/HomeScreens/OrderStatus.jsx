import { useNavigation, useRoute } from "@react-navigation/native";

import React from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  Chip,
  List,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

export default function OrderStatus() {
  const orderData = useSelector((state) => state.cart.items);
  const route = useRoute();
  const { orderItemWithPin } = route.params;
  const navigation = useNavigation();

  const orderItemTotalPrice = parseFloat(orderItemWithPin);
  console.log("orderItem price With Pin", orderItemTotalPrice);

  console.log("order status DATA", orderData);

  const orderdata = {
    collectionPoint: "401 East Benton Place, Chicago, Cook County, Illinois",
    date: "25 June",
    status: [
      {
        title: "Order Confirmed",
        time: "10:00 AM",
        completed: true,
      },
      {
        title: "Start Preparing",
        time: "10:15 AM",
        completed: true,
      },
      {
        title: "Start Packing",
        time: "10:30 AM",
        completed: true,
      },
      {
        title: "Ready For Pickup",
        time: "10:45 AM",
        completed: true,
      },
    ],
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.orderList}
        showsVerticalScrollIndicator={false}
        data={[1, 1]}
        renderItem={({ index }) => (
          <View>
            {index === 0 && (
              <FlatList
                data={orderData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Card style={styles.productCard}>
                    <Card.Content style={styles.productContent}>
                      <View style={styles.productInfo}>
                        <View style={styles.productRow}>
                          <View style={styles.imageContainer}>
                            <Image
                              style={styles.productImage}
                              source={{ uri: item.image }}
                            />
                          </View>
                          <View>
                            <Title>{item.name}</Title>
                            <View style={styles.storeRow}>
                              <Text>Store: {"Red Chilly"}</Text>
                              <View style={styles.ratingContainer}>
                                <Text>{item.rating}</Text>
                                {/* <Icon name="star" size={16} color="#FFA500" /> */}
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.priceRow}>
                          <Text style={styles.price}>
                            R{" "}
                            {(
                              item.quantity *
                              parseFloat(item.price.replace("R ", ""))
                            ).toFixed(2)}
                          </Text>
                          <Chip textStyle={styles.discountText}>
                            {"upto 30% off"}
                          </Chip>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
              />
            )}

            {index === 1 && (
              <>
                {/* Collection Point */}
                <Card style={styles.collectionCard}>
                  <Card.Content>
                    <View style={styles.collectionHeader}>
                      <Title>Collection Point</Title>
                      <Icon name="map-marker" size={24} color="#000" />
                    </View>
                    <Text style={styles.address}>
                      {orderdata.collectionPoint}
                    </Text>
                  </Card.Content>
                </Card>

                {/* Order Status */}
                <Card style={styles.statusCard}>
                  <Card.Content>
                    <Title>Order Status</Title>
                    {orderdata.status.map((status, index) => (
                      <List.Item
                        key={index}
                        title={status.title}
                        description={status.time}
                        // description={new Date().toLocaleTimeString()}
                        left={() => (
                          <View style={styles.statusDot}>
                            <View
                              style={[
                                styles.dot,
                                {
                                  backgroundColor: status.completed
                                    ? "#4CAF50"
                                    : "#E0E0E0",
                                },
                              ]}
                            />
                            {index < orderdata.status.length - 1 && (
                              <View
                                style={[
                                  styles.line,
                                  {
                                    backgroundColor: status.completed
                                      ? "#4CAF50"
                                      : "#E0E0E0",
                                  },
                                ]}
                              />
                            )}
                          </View>
                        )}
                      />
                    ))}
                  </Card.Content>
                </Card>

                {/* Pickup Button */}
                <Button
                  mode="contained"
                  style={styles.pickupButton}
                  icon="qrcode"
                  onPress={() =>
                    navigation.navigate("UniqueQR", {
                      orderItemwithQr: orderItemTotalPrice,
                    })
                  }
                >
                  Pickup by QR
                </Button>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    paddingTop: 14,
  },
  orderList: {
    paddingBottom: 16,
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  productContent: {
    flexDirection: "row",
  },
  imageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "contain",
  },
  productInfo: {
    flex: 1,
  },
  productRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  storeRow: {
    gap: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",

    alignItems: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    // textAlign: "right",
    marginRight: 8,
    fontWeight: "bold",
  },
  discountText: {
    color: "green",
  },
  collectionCard: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
    marginTop: 8,
  },
  statusCard: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  statusDot: {
    alignItems: "center",
    height: "100%",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  pickupButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
