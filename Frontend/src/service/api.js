import axios from "axios";
import { Alert } from "react-native";
import { resetRoot } from "./RootNavigation";

const api = axios.create({
  baseURL: "http://192.168.33.79:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [
          {
            text: "OK",
            onPress: () => {
              resetRoot(); // Navigate to GetStarted
            },
          },
        ]
      );
    }
    return Promise.reject(error);
  }
);

export default api;
