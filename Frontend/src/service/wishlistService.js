import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const addToWishlist = async (item) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.post("/wishlist/add", item, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("failed to add product to wishlist");
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.delete(`/wishlist/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("failed to remove product from wishlist");
    throw error;
  }
};

export const getWishlist = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.get("/wishlist", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.wishlist;
  } catch (error) {
    console.error("failed to get wishlist products", error);
    throw error;
  }
};
