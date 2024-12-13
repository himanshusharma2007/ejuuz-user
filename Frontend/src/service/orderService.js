import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const PlaceOrder = async (cartItems) => {
    console.log('PlaceOrder called cartItems', cartItems)
    try {
      const accessToken = await AsyncStorage.getItem("accesstoken");
  
      const response = await api.post(`/order/place-order`,cartItems, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    console.log('response', response.data)
      return response.data;
    } catch (error) {
      console.error("Error PlaceOrder", error);
      throw error;
    }
  };
export const getCustomerOrders = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accesstoken");
  
      const response = await api.get(`/order`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    console.log('response', response.data)
      return response.data;
    } catch (error) {
      console.error("Error getCustomerOrders", error);
      throw error;
    }
  };
export const getOrderById = async (orderId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accesstoken");
  
      const response = await api.post(`/order/${orderId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    console.log('response', response.data)
      return response.data;
    } catch (error) {
      console.error("Error getOrderById", error);
      throw error;
    }
  };