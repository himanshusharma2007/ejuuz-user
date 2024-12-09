import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAllShops = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");
    const response = await api.get("/shop", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all shops", error);
    throw error;
  }
};

export const getShopById = async (shopId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");
    const response = await api.get(`/shop/${shopId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shop by ID", error);
    throw error;
  }
};

export const getShopProducts = async (shopId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");
    const response = await api.get(`/shop/${shopId}/products`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {}
};
