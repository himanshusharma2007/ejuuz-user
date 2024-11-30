import React, { useState } from "react";
import { StyleSheet, View, Modal } from "react-native";
import {
  Avatar,
  Card,
  Text,
  List,
  Divider,
  Button,
  TextInput,
} from "react-native-paper";

export default function ProfileSettings() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sunny Bhardwaj",
    email: "abcdgfx@gmail.com",
    mobile: "+962 79 890 50 14",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile); // Update the profile state with new values
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Card style={styles.avatarCard}>
          <Avatar.Image
            size={100}
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg",
            }}
          />
        </Card>
        <List.Icon
          icon="check-circle"
          color="#00baf2"
          size={24}
          style={styles.verifyIcon}
        />
        <Text style={styles.title}>{profile.name}</Text>
        <Text style={styles.subtitle}>Joined 2 years ago</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <List.Item
          title="Full name"
          description={profile.name}
          left={(props) => (
            <List.Icon {...props} icon="account" color="#8e44ad" />
          )}
        />
        <Divider bold />

        <List.Item
          title="Mobile"
          description={profile.mobile}
          left={(props) => (
            <List.Icon {...props} icon="phone" color="#2980b9" />
          )}
        />
        <Divider bold />

        <List.Item
          title="Email"
          description={profile.email}
          left={(props) => (
            <List.Icon {...props} icon="email" color="#e67e22" />
          )}
        />
        <Divider bold />

        <List.Item
          title="Change password"
          onPress={() => console.log("Change Password Click")}
          left={(props) => <List.Icon {...props} icon="lock" color="#c0392b" />}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider bold />
      </View>

      {/* Update Profile Button */}
      <View style={styles.updateButtonContainer}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Update Profile
        </Button>
      </View>

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
              value={tempProfile.name}
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              mode="flat"
              style={styles.input}
              placeholder="Mobile Number"
              value={tempProfile.mobile}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setTempProfile((prev) => ({ ...prev, mobile: text }))
              }
            />
            <TextInput
              mode="flat"
              style={styles.input}
              placeholder="Email Address"
              value={tempProfile.email}
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
});
