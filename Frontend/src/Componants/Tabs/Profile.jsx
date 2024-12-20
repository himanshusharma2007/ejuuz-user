import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
  Alert, // Import Linking here
} from "react-native";
import { Button, Badge } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import authService from "../../service/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCustomerOrders } from "../../service/orderService";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";

const menuOptions = [
  {
    id: 1,
    category: "Shopping",
    items: [
      {
        id: "orders",
        title: "Orders",
        icon: "📦",
        navigate: "Orders",
      },
      {
        id: "transactions",
        title: "Transaction History",
        icon: "📜",
        navigate: "WalletHistory",
      },
      {
        id: "wishlist",
        title: "Wishlist",
        icon: "❤️",
        navigate: "Wishlist",
      },
    ],
  },
  {
    id: 2,
    category: "Account & Wallet",
    items: [
      {
        id: "manageAccount",
        title: "Manage Account",
        icon: "👤",
        navigate: "Setting",
      },
      {
        id: "wallet",
        title: "Wallet",
        icon: "💰",
        navigate: "Wallet",
      },
    ],
  },
  {
    id: 3,
    category: "Support & More",
    items: [
      {
        id: "helpCenter",
        title: "Help Center",
        icon: "🙋",
        navigate: "Help",
      },
      {
        id: "contactUs",
        title: "Contact Us",
        icon: "📞",
        navigate: "ContactUs",
      },
      {
        id: "seller",
        title: "Become a Seller",
        icon: "🛍️",
        navigate: "https://fintecj-merchant.onrender.com/", // Updated to URL
      },
      {
        id: "about",
        title: "About",
        icon: "ℹ️",
        navigate: "About",
      },
    ],
  },
];

const recentActivities = [
  {
    id: "activity1",
    type: "order",
    title: "Order Delivered",
    description: "Your order #12345 has been delivered",
    time: "2 hours ago",
    icon: "checkmark-circle-outline",
  },
  {
    id: "activity2",
    type: "points",
    title: "Points Earned",
    description: "Earned 100 points from your last purchase",
    time: "1 day ago",
    icon: "star-outline",
  },
];

export default function Profile() {
  const navigation = useNavigation();
  const [ordersCount, setOrdersCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const user = useSelector(selectUser);

  useEffect(() => {
    setBalance(user?.walletBalance || 0);
  }, []);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const response = await getCustomerOrders(); // Call the service
        setOrdersCount(response.data.length);
        console.log('response', response)

         // Calculate the total expense
         const totalAmount = response.data.reduce((sum, order) => sum + order.totalAmount, 0);
         setTotalExpense(totalAmount);
         console.log('totalAmount', totalAmount)
      } catch (error) {
        console.error("Failed to fetch orders count:", error);
      }
    };

    fetchOrdersCount(); // Trigger the fetch
  }, []);

  const userStats = [
    { id: "orders", label: "Orders", value: ordersCount },
    { id: "reviews", label: "Reviews", value: "12" },
    { id: "expense", label: "Order Expense", value: `R ${totalExpense}` },
  ];

  function handlelogout() {
    AsyncStorage.setItem("accesstoken", "");
    AsyncStorage.setItem("isLoggedIn", "");
    Alert.alert(
      "Logout",
      "You have been logged out." + "\n" + "Redirecting..."
    );
    console.log("user logged out");
    navigation.navigate("GetStarted");
  }

  const renderMenuItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          if (item.navigate === "https://fintecj-merchant.onrender.com/") {
            // Open the URL when it's the seller link
            Linking.openURL(item.navigate);
          } else if (item.id === "wallet" || item.id === "transactions") {
            navigation.navigate("WalletTab", { screen: item.navigate });
          } else {
            navigation.navigate(item.navigate);
          }
        }}
        key={item.id}
      >
        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <Text style={styles.optionIcon}>{item.icon}</Text>
            <Text style={styles.optionText}>{item.title}</Text>
          </View>
          <View style={styles.optionRight}>
            {item.badge && <Badge style={styles.badge}>{item.badge}</Badge>}
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar backgroundColor="#002E6E" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg",
                }}
                style={styles.profileImage}
              />
            </View>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Setting")}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          {userStats.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name={activity.icon} size={24} color="#007AFF" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Menu Options */}
      {menuOptions.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.items.map((item) => renderMenuItem(item))}
        </View>
      ))}

      {/* Logout Button */}
      <Button
        mode="contained"
        style={styles.logoutButton}
        onPress={handlelogout}
        labelStyle={styles.logoutButtonText}
      >
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1, // This ensures the content can grow beyond screen height
  },
  header: {
    backgroundColor: "#002E6E",
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  greeting: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  editProfileLink: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 13,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },

  activitiesSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  categorySection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  option: {
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#FF3B30",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: Platform.OS === "ios" ? 0 : 70, // Add platform-specific margin
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
