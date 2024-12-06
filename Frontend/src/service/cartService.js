import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const addToCart = async (item) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = api.post("/cart/add", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("failed to add product to cart");
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = api.delete(`/cart/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("failed to remove product in cart");
  }
};

export const getCart = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = api.get("/cart", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("failed to get cart product");
  }
};