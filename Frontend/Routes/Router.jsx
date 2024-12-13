import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../src/Componants/Tabs/Home";
import Search from "../src/Componants/Tabs/Search";
import Scan from "../src/Componants/Tabs/Scan";
import Wallet from "../src/Componants/Tabs/Wallet";
import Profile from "../src/Componants/Tabs/Profile";
import GetStarted from "../src/Authenticate/GetStarted";
import OtpPage from "../src/Authenticate/OtpPage";
import ProductDetails from "../src/Componants/Screens/HomeScreens/ProductDetails";
import Cart from "../src/Componants/Screens/HomeScreens/Cart";
import Notifications from "../src/Componants/Screens/HomeScreens/Notifications";
import Checkout from "../src/Componants/Screens/HomeScreens/Checkout";
import Payment from "../src/Componants/Screens/HomeScreens/Payment";
import TransactionPin from "../src/Componants/Screens/HomeScreens/TransactionPin";
import OrderStatus from "../src/Componants/Screens/HomeScreens/OrderStatus";
import CategoryDetails from "../src/Componants/Screens/HomeScreens/CategoryDetails";
import UniqueQR from "../src/Componants/Screens/HomeScreens/UniqueQR";
import StoreDeatils from "../src/Componants/Screens/SearchScreens/StoreDeatils";
import { TouchableOpacity } from "react-native";
import AddContact from "../src/Componants/Screens/WalletScreens/AddContact";
import WalletTransfer from "../src/Componants/Screens/WalletScreens/WalletTransfer";
import WalletPaymentEnter from "../src/Componants/Screens/WalletScreens/WalletPaymentEnter";
import WalletTransactionPin from "../src/Componants/Screens/WalletScreens/WalletTransactionPin";
import PaymentDone from "../src/Componants/Screens/WalletScreens/PaymentDone";
import WalletHistory from "../src/Componants/Screens/WalletScreens/WalletHistory";
import ProfileSettings from "../src/Componants/Screens/ProfileScreens/setting";
import Wishlist from "../src/Componants/Screens/ProfileScreens/wishlist";
import Orders from "../src/Componants/Screens/ProfileScreens/orders";
import { Badge } from "react-native-paper";
import Help from "../src/Componants/Screens/ProfileScreens/help";
import ContactUs from "../src/Componants/Screens/ProfileScreens/contactus";
import About from "../src/Componants/Screens/ProfileScreens/about";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/features/userSlice";
import {
  fetchCartAsync,
  fetchWishlistAsync,
} from "../redux/features/cartSlice";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeStack" component={Home} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Shopping Cart",
          headerRight: () => {
            return (
              <Pressable
                style={styles.heartIcon}
                onPress={() => navigation.navigate("Wishlist")}
              >
                <Image
                  source={require("../src/images/wishlist.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
            );
          },
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: true, headerTitleAlign: "center" }}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Checkout",
          headerRight: () => {
            return (
              <Pressable
                style={styles.heartIcon}
                onPress={() => navigation.navigate("Wishlist")}
              >
                <Image
                  source={require("../src/images/wishlist.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
            );
          },
        }}
      />

      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Payment",
          headerRight: () => {
            return (
              <Pressable
                style={styles.heartIcon}
                onPress={() => navigation.navigate("Wishlist")}
              >
                <Image
                  source={require("../src/images/wishlist.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Pressable>
            );
          },
        }}
      />

      <Stack.Screen
        name="TransactionPin"
        component={TransactionPin}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "",
        }}
      />

      <Stack.Screen
        name="OrderStatus"
        component={OrderStatus}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          title: "Order Status",
        }}
      />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="UniqueQR" component={UniqueQR} />

      <Stack.Screen
        name="Auth"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpPage"
        component={OtpPage}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="StoreDetails"
        component={StoreDeatils}
        options={{
          headerShown: false,
          headerTitle: "",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Wishlist")}>
              <Image
                source={require("../src/images/wishlist.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          ),
        }}
      /> */}
    </Stack.Navigator>
  );
};

// Search Stack
const SearchStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDeatils}
        options={{
          headerShown: false,
          headerTitle: "",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Wishlist")}>
              <Image
                source={require("../src/images/wishlist.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// Wallet Stack
const WalletStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          headerTitle: "Wallet",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate("Cart")}
            >
              <Ionicons name="cart-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContact}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="WalletTransfer"
        component={WalletTransfer}
        options={{
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="WalletPaymentEnter"
        component={WalletPaymentEnter}
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="WalletTransactionPin"
        component={WalletTransactionPin}
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="PaymentDone"
        component={PaymentDone}
        options={{
          headerShown: false,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="WalletHistory"
        component={WalletHistory}
        options={{
          headerShown: false,
          headerTitle: "History",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Ionicons name="cart-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false, // Hides header for the 'index' screen
        }}
      />

      <Stack.Screen
        name="Setting"
        component={ProfileSettings}
        options={{
          headerTitle: "Profile Setting",
        }}
      />
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerShown: false, // Hides header for the 'wishlist' screen
        }}
      />

      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerTitleAlign: "center",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={styles.cartContainer}
                onPress={() => navigation.navigate("Cart")}
              >
                <MaterialIcons name="shopping-cart" size={28} color="#007AFF" />
                <Badge style={styles.cartBadge}>3</Badge>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Help & Support",
        }}
      />

      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Contact Us",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            color: "#007AFF",
          },
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
};

// Authentication Stack
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="OtpPage" component={OtpPage} />
      <Stack.Screen name="/" component={TabNavigator} />
    </Stack.Navigator>
  );
};

function getTabbarVisibility(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
  // Hide tab bar for these screens
  if (
    routeName === "ProductDetails" ||
    routeName === "Checkout" ||
    routeName === "Payment" ||
    routeName === "TransactionPin" ||
    routeName === "OrderStatus" ||
    routeName === "UniqueQR" ||
    routeName === "WalletPaymentEnter" ||
    routeName === "AddContact" ||
    routeName === "WalletTransfer" ||
    routeName === "WalletTransferDone" ||
    routeName === "TransactionDetails" ||
    routeName === "WalletTransactionPin" ||
    routeName === "PaymentDone" ||
    routeName === "Auth" ||
    routeName === "OtpPage" ||
    routeName === "Cart" ||
    routeName === "Orders" ||
    routeName === "SearchTab"
  ) {
    return "none";
  }
  return "flex";
}

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70, // Set the height of the tab bar
          backgroundColor: "#fff",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          paddingTop: 15,
          paddingHorizontal: 20,
          display: getTabbarVisibility(route),
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={30} color="#002e6e" />
            ) : (
              <Ionicons name="home-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="search" size={30} color="#002e6e" />
            ) : (
              <Ionicons name="search-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.scanIconContainer}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={30}
                color="#fff"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="wallet" size={30} color="#002e6e" />
            ) : (
              <Ionicons name="wallet-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={30} color="#002e6e" />
            ) : (
              <Ionicons name="person-outline" size={30} color="black" />
            ),
          // tabBarStyle: {
          //   display: "none",
          // },
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getdata() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log(data, "at app.jsx");
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getdata();
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchCartAsync());
    dispatch(fetchWishlistAsync());
  }, [dispatch]);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainStack" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auths" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  heartIcon: {
    position: "relative",
    marginRight: 10,
    marginTop: 1,
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
  },

  scanIconContainer: {
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: "#002e6e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 0,
  },
});
 