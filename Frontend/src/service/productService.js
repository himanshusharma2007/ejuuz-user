import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAllProducts = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");
    const response = await api.get("/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching all products", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.get(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    throw error;
  }
};

export const getShopByProductId = async (shopId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.get(`/shops/${shopId}/shop`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    throw error;
  }
};

export const getProductByCategory = async (category) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.get(`/products/category/${category}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {}
};

export const searchProducts = async (keyword) => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response = await api.get(
      `/products/search`,
      { params: keyword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Return the products array from the response
    return response.data.products || [];
  } catch (error) {
    console.error("Full Search Error:", error);

    // More detailed error logging
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    } else if (error.request) {
      console.error("Error Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }

    throw error;
  }
};

export const getAllDiscountedProducts = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accesstoken");
    const response = await api.get("/products/top-discounted", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discounted products", error);
    throw error;
  }
};
