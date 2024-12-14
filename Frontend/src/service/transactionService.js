import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// export const getAllTransactions = async () => {
//     try {
//       const accessToken = await AsyncStorage.getItem("accesstoken");
//       const response = await api.get("/transaction/history", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error getAllTransactions", error);
//       throw error;
//     }
//   };