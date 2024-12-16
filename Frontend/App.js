import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import Toast from "react-native-toast-message";

import GetStarted from "./src/Authenticate/GetStarted";
import OtpPage from "./src/Authenticate/OtpPage";
import Router from "./Routes/Router";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(value === "true");
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider>
        <NavigationContainer>
          <Provider store={store}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!isLoggedIn ? (
                <>
                  <Stack.Screen name="GetStarted" component={GetStarted} />
                  <Stack.Screen name="OtpPage" component={OtpPage} />
                </>
              ) : null}
              <Stack.Screen name="Main" component={Router} />
            </Stack.Navigator>
            <Toast />
          </Provider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
