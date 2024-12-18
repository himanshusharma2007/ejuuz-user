import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import {
  Avatar,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ProfileService from "../../../service/profileServices";

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [tempProfile, setTempProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await ProfileService.getProfile();
      setProfile(userData.data);
      setTempProfile({ ...userData });
      setProfileImage(userData.data.profileImage);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await ProfileService.updateProfile(tempProfile);
      setProfile(updatedProfile);
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
      fetchProfile();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const pickImage = async (source) => {
    try {
      let result = source === "camera" 
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.7,
          });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const formData = new FormData();
        formData.append("profileImage", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        });

        const updatedProfile = await ProfileService.updateProfileImage(formData);
        if (updatedProfile?.profileImage) {
          setProfileImage(updatedProfile.profileImage);
        }
        setImageModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile image");
    }
  };

  const ProfileInfoItem = ({ icon, title, subtitle, iconColor }) => (
    <View style={styles.profileInfoItem}>
      <View style={styles.profileInfoIconContainer}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.profileInfoTextContainer}>
        <Text style={styles.profileInfoTitle}>{title}</Text>
        <Text style={styles.profileInfoSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => setImageModalVisible(true)}
        >
          <Avatar.Image
            size={120}
            source={
              profileImage
                ? { uri: profileImage.url }
                : require('../../../images/avatar.webp')
            }
          />
          
        </TouchableOpacity>
        <Text style={styles.profileName}>
          {profile?.name || "User Profile"}
        </Text>
        {profile?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfoContainer}>
        {profile?.name && (
          <ProfileInfoItem 
            icon="person" 
            title="Full Name" 
            subtitle={profile.name} 
            iconColor="#8e44ad" 
          />
        )}
        {profile?.mobile && (
          <ProfileInfoItem 
            icon="phone" 
            title="Mobile Number" 
            subtitle={profile.mobile} 
            iconColor="#2980b9" 
          />
        )}
        {profile?.email && (
          <ProfileInfoItem 
            icon="email" 
            title="Email Address" 
            subtitle={profile.email} 
            iconColor="#e67e22" 
          />
        )}
        <TouchableOpacity 
          style={styles.profileInfoItem}
          onPress={() => console.log("Change Password")}
        >
          <View style={styles.profileInfoIconContainer}>
            <MaterialIcons name="lock" size={24} color="#c0392b" />
          </View>
          <View style={styles.profileInfoTextContainer}>
            <Text style={styles.profileInfoTitle}>Change Password</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button 
          mode="contained" 
          onPress={() => setModalVisible(true)}
          style={styles.updateProfileButton}
        >
          Update Profile
        </Button>
      </View>

      {/* Profile Update Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput
              mode="outlined"
              label="Full Name"
              value={tempProfile?.name || ""}
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, name: text }))
              }
              style={styles.modalInput}
            />
            <TextInput
              mode="outlined"
              label="Mobile Number"
              value={tempProfile?.mobile || ""}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, mobile: text }))
              }
              style={styles.modalInput}
            />
            <TextInput
              mode="outlined"
              label="Email Address"
              value={tempProfile?.email || ""}
              keyboardType="email-address"
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, email: text }))
              }
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.modalSaveButton}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        visible={isImageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageModalContent}>
            <Text style={styles.modalTitle}>Select Profile Picture</Text>
            <View style={styles.imagePickerOptions}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => pickImage("camera")}
              >
                <MaterialIcons name="camera-alt" size={50} color="#002E6E" />
                <Text style={styles.imagePickerButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => pickImage("library")}
              >
                <MaterialIcons name="photo-library" size={50} color="#002E6E" />
                <Text style={styles.imagePickerButtonText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
            <Button
              mode="outlined"
              onPress={() => setImageModalVisible(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  verifiedBadge: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  verifiedBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  profileInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfoIconContainer: {
    marginRight: 15,
    width: 40,
    alignItems: "center",
  },
  profileInfoTextContainer: {
    flex: 1,
  },
  profileInfoTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  profileInfoSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  actionButtonsContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  updateProfileButton: {
    paddingVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalInput: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalSaveButton: {
    flex: 1,
    marginRight: 5,
  },
  modalCancelButton: {
    flex: 1,
    marginLeft: 5,
  },
  imageModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePickerOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  imagePickerButton: {
    alignItems: "center",
    width: "40%",
  },
  imagePickerButtonText: {
    marginTop: 10,
    color: "#002E6E",
    fontWeight: "600",
  },
});