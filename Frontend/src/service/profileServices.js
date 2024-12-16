// Frontend/src/service/profileService.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ProfileService {
  async getProfile() {
    try {
      console.log("get profile called");
      const accessToken = await AsyncStorage.getItem("accesstoken");
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response in get profile", response);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data) {
    try {
      console.log("data in update profile", data.name);
      const accessToken = await AsyncStorage.getItem("accesstoken");
      const response = await api.patch("/profile/update", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfileImage(formData) {
    try {
      const accessToken = await AsyncStorage.getItem("accesstoken");
      const response = await api.patch("/api/profile/update-image", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
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

export default new ProfileService();
