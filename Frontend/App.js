import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Router from "./Routes/Router";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <Provider store={store}>
          <Router />
          <Toast />
        </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
