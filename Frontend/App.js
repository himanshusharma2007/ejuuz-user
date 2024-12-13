import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GetStarted from "./src/Authenticate/GetStarted";
import OtpPage from "./src/Authenticate/OtpPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Router from "./Routes/Router";

function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OtpPage"
        component={OtpPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="/"
        component={Router}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function getdata() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log(data, "at app.jsx");
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getdata();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NavigationContainer>
          <Provider store={store}>
            {isLoggedIn ? <Router /> : <AuthStack />}
            <Toast />
          </Provider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
