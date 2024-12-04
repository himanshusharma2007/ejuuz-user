import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  TextInput,
  ScrollView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import * as ImagePicker from "expo-image-picker";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState([]);

  const recentContacts = [
    { id: 1, name: "Ali", avatar: "🤠" },
    { id: 2, name: "Steve", avatar: "👨🏾" },
    { id: 3, name: "Ahmed", avatar: "👨🏽" },
    { id: 4, name: "Mike", avatar: "👨" },
    { id: 5, name: "Ahmed", avatar: "👨🏽" },
    { id: 6, name: "Mike", avatar: "👨" },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData([...scannedData, { type, data }]);
    handlePaymentQR(data);
  };

  const handlePaymentQR = (data) => {
    if (data.startsWith("upi://pay")) {
      // Open UPI link
      Linking.openURL(data).catch(() =>
        Alert.alert("Error", "Unable to open UPI payment link.")
      );
    } else if (data.startsWith("http")) {
      // Handle regular URLs
      Linking.openURL(data).catch(() =>
        Alert.alert("Error", "Unable to open link.")
      );
    } else {
      Alert.alert("Scanned Data", data);
    }
  };

  const handleUploadFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      // Simulate extracted data
      const extractedData = "upi://pay?pa=example@upi"; // Replace with actual OCR or barcode extraction logic
      setScannedData([...scannedData, { type: "image", data: extractedData }]);
      handlePaymentQR(extractedData);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.scanner]}
        />
      </View>
      {/* <View style={styles.recentContainer}>
        <FlatList
          data={scannedData}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentItemsContainer}
          renderItem={({ item }) => (
            <View style={styles.recentItem}>
              <Text style={styles.recentItemText}>{item.data}</Text>
            </View>
          )}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadFromGallery}
        >
          <Text style={styles.uploadButtonText}>Upload from gallery</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Enter mobile number or name" />
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.recentText}>Recent</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contactItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{contact.avatar}</Text>
              </View>
              <Text style={styles.contactName}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  scannerContainer: {
    height: "60%",
    width: "100%",
    backgroundColor: "#000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // alignItems: "center",
    // justifyContent: "center",
    justifyContent: "center",
  },

  scanner: {
    width: "100%",
    margin: "auto",
    height: "99.3%",
    borderRadius: 20,
  },
  // recentContainer: {
  //   position: "absolute",
  //   bottom: 80,
  //   height: 80,
  //   width: "100%",
  //   backgroundColor: "rgba(44, 44, 44, 0.5)",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  recentItemsContainer: {
    paddingHorizontal: 16,
  },
  recentItem: {
    marginHorizontal: 8,
    alignItems: "center",
  },
  recentItemText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
  buttonContainer: {
    position: "relative",
    bottom: 56,
    width: "100%",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#D73642",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    alignSelf: "center",
    width: "90%",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  recentContainer: {
    width: "100%",
    paddingVertical: 20,
  },
  recentText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginLeft: 20,
    marginBottom: 10,
  },
  contactItem: {
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
  },
  addAvatar: {
    backgroundColor: "#6B46C1",
  },
  addAvatarText: {
    color: "white",
    fontSize: 24,
  },
  avatarText: {
    fontSize: 40,
  },
  contactName: {
    marginTop: 5,
    fontSize: 12,
  },
});
