import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const addToCart = async (item) => {
  try {
    console.log('add to cart called', item)
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response =await  api.post("/cart/add", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      item
    });
console.log('response.data in cart service', response.data)
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

export const incrementCartItem = async (productId) => {
  try {
    const token = await AsyncStorage.getItem('accesstoken');
    
    const response = await api.post(
      `/cart/increment/${productId}`, 
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error incrementing cart item:', error);
    throw error;
  }
};

export const decrementCartItem = async (productId) => {
  try {
    const token = await AsyncStorage.getItem('accesstoken');
    
    const response = await api.post(
      `/cart/decrement/${productId}`, 
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error decrementing cart item:', error);
    throw error;
  }
};
export const getCart = async () => {
  try {
    console.log("get cart function called");
    const accessToken = await AsyncStorage.getItem("accesstoken");

    const response =await  api.get("/cart", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  console.log('response', response.data)
    return response.data.cart;
  } catch (error) {
    console.error("failed to get cart product", error);
  }
};
