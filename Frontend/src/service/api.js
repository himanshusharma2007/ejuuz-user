import axios from "axios";
import { Alert } from "react-native";
import { resetRoot } from "./RootNavigation";

const api = axios.create({
  baseURL: "https://ejuuz-user.onrender.com/api",
  // baseURL: "http://192.168.1.14:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiry or unauthorized access
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [
          {
            text: "OK",
            onPress: () => resetRoot(), // Reset to Login Page
          },
        ]
      );
    }
    return Promise.reject(error);
  }
);

export default api;
