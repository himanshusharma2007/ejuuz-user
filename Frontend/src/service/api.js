import axios from "axios";
import { Alert } from "react-native";

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: "http://192.168.103.88:3000/api",
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      Alert.alert(
        "Unauthorized",
        "You are not authorized to access this resource."
        // ,
        // [{ text: "OK", onPress: () => {} }]
      );
      // Optionally, you can log the user out or navigate to login screen
      // e.g., use your navigation method to redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
