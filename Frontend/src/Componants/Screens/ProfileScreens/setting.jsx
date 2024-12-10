import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, TouchableOpacity, Alert, Image } from "react-native";
import {
  Avatar,
  Card,
  Text,
  List,
  Divider,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
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
      console.log('userData', userData)
      console.log('userData.data.profileImage', userData.data.profileImage.url)
      setProfile(userData.data);

      setTempProfile({ ...userData });
      setProfileImage(userData.data.profileImage);
    } catch (error) {
      console.log('error', error)
      Alert.alert("Error", error.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('tempProfile', tempProfile)
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
    let result;
    try {
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.7,
        });
      }

      if (!result.canceled) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile.jpg'
        });

        const updatedProfile = await ProfileService.updateProfileImage(formData);
        setProfileImage(updatedProfile.profileImage);
        setImageModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile image");
    }
  };

  const isProfileIncomplete = () => {
    return !profile?.name || !profile?.email;
  };

  const renderProfileStatus = () => {
    if (isProfileIncomplete()) {
      return (
        <View style={styles.incompleteProfileContainer}>
          <Text style={styles.incompleteProfileText}>
            Complete your profile to personalize your experience
          </Text>
          <Button 
            mode="contained" 
            onPress={() => setModalVisible(true)}
            style={styles.completeProfileBtn}
          >
            Complete Profile
          </Button>
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
          <Avatar.Image
            size={100}
            source={
           profileImage 
                ? { uri: profileImage.url } 
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
          />
        </TouchableOpacity>
        {profile?.isVerified && (
          <List.Icon
            icon="check-circle"
            color="#00baf2"
            size={24}
            style={styles.verifyIcon}
          />
        )}
        <Text style={styles.title}>{profile?.name || "User"}</Text>
        <Text style={styles.subtitle}>
          Joined {new Date(profile?.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {renderProfileStatus()}

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {profile?.name && (
          <>
            <List.Item
              title="Full name"
              description={profile.name}
              left={(props) => (
                <List.Icon {...props} icon="account" color="#8e44ad" />
              )}
            />
            <Divider bold />
          </>
        )}

        {profile?.mobile && (
          <>
            <List.Item
              title="Mobile"
              description={profile.mobile}
              left={(props) => (
                <List.Icon {...props} icon="phone" color="#2980b9" />
              )}
            />
            <Divider bold />
          </>
        )}

        {profile?.email && (
          <>
            <List.Item
              title="Email"
              description={profile.email}
              left={(props) => (
                <List.Icon {...props} icon="email" color="#e67e22" />
              )}
            />
            <Divider bold />
          </>
        )}

        <List.Item
          title="Change password"
          onPress={() => console.log("Change Password Click")}
          left={(props) => <List.Icon {...props} icon="lock" color="#c0392b" />}
          right={() => <List.Icon icon="chevron-right" />}
        />
      </View>

      {/* Update Profile Button */}
      <View style={styles.updateButtonContainer}>
        <Button 
          mode="contained" 
          onPress={() => setModalVisible(true)}
          disabled={!profile}
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
              mode="flat"
              style={styles.input}
              placeholder="Full Name"
              value={tempProfile?.name || ''}
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              mode="flat"
              style={styles.input}
              placeholder="Mobile Number"
              value={tempProfile?.mobile || ''}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, mobile: text }))
              }
            />
            <TextInput
              mode="flat"
              style={styles.input}
              placeholder="Email Address"
              value={tempProfile?.email || ''}
              keyboardType="email-address"
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, email: text }))
              }
            />
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
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
                onPress={() => pickImage('camera')}
              >
                <List.Icon icon="camera" />
                <Text>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.imagePickerButton} 
                onPress={() => pickImage('library')}
              >
                <List.Icon icon="image" />
                <Text>Choose from Library</Text>
              </TouchableOpacity>
            </View>
            <Button 
              mode="outlined" 
              onPress={() => setImageModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCard: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#00baf2",
  },
  verifyIcon: {
    position: "absolute",
    bottom: 60,
    right: 150,
    backgroundColor: "white",
    borderRadius: 12,
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "gray",
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  updateButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    marginBottom: 15,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    flex: 1,
    marginRight: 5,
    // backgroundColor: "#4caf50",
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    borderColor: "#f44336",
  },
  incompleteProfileContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  incompleteProfileText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  completeProfileBtn: {
    width: '80%',
  },
  imagePickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  imagePickerButton: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});