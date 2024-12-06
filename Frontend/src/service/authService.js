import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";


class AuthService {
  async sendOtp(phoneNumber) {
    try {
      // Save phone number in AsyncStorage
      const response = await api.post("/auth/send-otp", { phoneNumber });
      const numberToken = response.data.data;
      console.log(numberToken);
      await AsyncStorage.setItem("accesstoken", numberToken);
      AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyOtp(otp) {
    try {
      // Retrieve phone number from AsyncStorage
      const numberToken = await AsyncStorage.getItem("accesstoken");

      if (!numberToken) {
        throw new Error("Phone number not found in AsyncStorage.");
      }

      console.log(numberToken);

      // Now send OTP and phone number to verify OTP
      const response = await api.post(
        "/auth/verify-otp",
        {
          otp,
        },
        { headers: { Authorization: `Bearer ${numberToken}` } }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const accessToken = await AsyncStorage.getItem("accesstoken");
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      // Clear cookies by making them expire
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        status: error.response.status,
        message: error.response.data.error || "An error occurred",
        details: error.response.data.details,
      };
    }
    // Network error or other issues
    return {
      status: 500,
      message: "Network error or server is not responding",
      details: error.message,
    };
  }
}

export default new AuthService();
