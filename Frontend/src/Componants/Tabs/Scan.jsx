import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Make sure to install this

export default function Scan() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [recentContacts, setRecentContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentScan, setCurrentScan] = useState({
    title: "Transfer money",
    subtitle: "asghjk",
    data: "",
  });
  const [scanning, setScanning] = useState(true);

  // Animated values for corner pop effect
  const [topLeftScale] = useState(new Animated.Value(1));
  const [topRightScale] = useState(new Animated.Value(1));
  const [bottomLeftScale] = useState(new Animated.Value(1));
  const [bottomRightScale] = useState(new Animated.Value(1));

  // Animation function for corner pop effect
  const animateCorner = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    (async () => {
      // Camera Permission
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");

      // Contacts Permission
      const { status: contactStatus } =
        await Contacts.requestPermissionsAsync();
      if (contactStatus === "granted") {
        await fetchRecentContacts();
      }
    })();
  }, []);

  // Fetch recent contacts from phone
  const fetchRecentContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.Image,
          Contacts.Fields.PhoneNumbers,
        ],
        pageSize: 10, // Limit to 10 contacts
      });

      // Transform contacts to match the existing structure
      const formattedContacts = data.map((contact, index) => ({
        id: contact.id || index,
        name: contact.name,
        avatar: contact.image ? { uri: contact.image.uri } : getRandomEmoji(),
        phoneNumber: contact.phoneNumbers?.[0]?.number || "",
      }));

      setRecentContacts(formattedContacts);
    } catch (error) {
      console.error("Error fetching contacts", error);
      Alert.alert("Error", "Could not fetch contacts");
    }
  };

  // Function to get a random emoji as a fallback
  const getRandomEmoji = () => {
    const emojis = ["🤠", "👨", "👩", "👧", "👦", "👴", "👵"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Function to generate random pastel colors
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 80%, 0.7)`;
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setScannedData([...scannedData, { type, data }]);

    // Parse the scanned data to extract title and subtitle
    // You might need to adjust this based on your QR code format
    let title = "Payment Request";
    let subtitle = "Please verify the payment details";

    setCurrentScan({
      title,
      subtitle,
      data,
    });
    setIsModalVisible(true);
  };

  const handlePaymentQR = (data) => {
    if (data.startsWith("upi://pay")) {
      // Show modal instead of immediately opening UPI link
      setCurrentScan({
        title: "UPI Payment",
        subtitle: "Verify and proceed with payment",
        data,
      });
      setIsModalVisible(true);
    } else if (data.startsWith("http")) {
      setCurrentScan({
        title: "Web Link",
        subtitle: "External link detected",
        data,
      });
      setIsModalVisible(true);
    } else {
      setCurrentScan({
        title: "Scanned Content",
        subtitle: "Please verify the details",
        data,
      });
      setIsModalVisible(true);
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

  const handlePayNow = () => {
    setIsModalVisible(false);
    console.log("current scan", currentScan);
    navigation.navigate("WalletTab", {
      screen: "TopUp",
      params: {
        title: currentScan.title,
        subtitle: currentScan.subtitle,
        isTransfer: true,
        scannedData: currentScan.data,
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setScanning(true);
    setCurrentScan({
      title: "",
      subtitle: "",
      data: "",
    });
  };

  // Handle contact selection
  const handleContactSelect = (contact) => {
    Alert.alert(
      "Contact Selected",
      `Name: ${contact.name}\nPhone: ${contact.phoneNumber}`
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {scanning && (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={[StyleSheet.absoluteFillObject, styles.scanner]}
            />
            <View style={styles.scanOverlay}>
              <View style={styles.scannerFrame}>
                {/* Keep your existing corner animations */}
                <Animated.View
                  style={[
                    styles.corner,
                    styles.topLeftCorner,
                    { transform: [{ scale: topLeftScale }] },
                  ]}
                  onTouchEnd={() => animateCorner(topLeftScale)}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.topRightCorner,
                    { transform: [{ scale: topRightScale }] },
                  ]}
                  onTouchEnd={() => animateCorner(topRightScale)}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.bottomLeftCorner,
                    { transform: [{ scale: bottomLeftScale }] },
                  ]}
                  onTouchEnd={() => animateCorner(bottomLeftScale)}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.bottomRightCorner,
                    { transform: [{ scale: bottomRightScale }] },
                  ]}
                  onTouchEnd={() => animateCorner(bottomRightScale)}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadFromGallery}
          >
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Upload from gallery</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCancel}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              {/* Header Section */}
              <View style={modalStyles.modalHeader}>
                <View style={modalStyles.modalHeaderIcon}>
                  <Ionicons name="qr-code-outline" size={32} color="#002E6E" />
                </View>
                <Text style={modalStyles.modalTitle}>{currentScan.title}</Text>
                <Text style={modalStyles.modalSubtitle}>
                  {currentScan.subtitle}
                </Text>
              </View>

              {/* Content Section */}
              <View style={modalStyles.modalContent}>
                <View style={modalStyles.dataContainer}>
                  <Text style={modalStyles.dataLabel}>Payment ID</Text>
                  <View style={modalStyles.dataBox}>
                    <Text style={modalStyles.dataText}>{currentScan.data}</Text>
                  </View>
                </View>
              </View>

              {/* Button Section */}
              <View style={modalStyles.buttonSection}>
                <TouchableOpacity
                  style={[modalStyles.button, modalStyles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={modalStyles.cancelButtonText}>
                    Cancel Payment
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[modalStyles.button, modalStyles.payButton]}
                  onPress={handlePayNow}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color="white"
                    style={modalStyles.buttonIcon}
                  />
                  <Text style={modalStyles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Enter mobile number or name"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.recentText}>Recent Contacts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contactScrollContainer}
          >
            {recentContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleContactSelect(contact)}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: contact.avatar.uri
                        ? "transparent"
                        : getRandomPastelColor(),
                    },
                  ]}
                >
                  {contact.avatar.uri ? (
                    <Image source={contact.avatar} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{contact.avatar}</Text>
                  )}
                </View>
                <Text style={styles.contactName} numberOfLines={1}>
                  {contact.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.emptyContactItem}></View>
        </View>
      </ScrollView>
      {renderScannedItemsList()}
      {renderScannedDataModal()}
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Changed to flex-end to slide from bottom
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 46, 110, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002E6E",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dataContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dataLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dataBox: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  dataText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  buttonSection: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E7FF",
    paddingTop: 20,
  },
  button: {
    borderRadius: 15,
    padding: 16,
    elevation: 2,
    width: "100%",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#002E6E",
  },
  payButton: {
    backgroundColor: "#002E6E",
    shadowColor: "#002E6E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cancelButtonText: {
    color: "#002E6E",
    fontWeight: "600",
    fontSize: 16,
  },
  payButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  scannerContainer: {
    height: height * 0.6,
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
    borderWidth: 3,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  buttonContainer: {
    position: "relative",
    bottom: 56,
    width: "100%",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#002E6E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  inputContainer: {
    alignSelf: "center",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  recentContainer: {
    width: "100%",
    paddingVertical: 20,
    marginBottom: 30,
  },
  recentText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#333",
  },
  contactScrollContainer: {
    paddingHorizontal: 15,
  },
  contactItem: {
    alignItems: "center",
    marginRight: 15,
    width: 100,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
  },
  contactName: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  emptyContactItem: {
    width: 20, // Ensures some extra space at the end of horizontal scroll
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#002E6E",
  },
  scanDetailRow: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 5,
  },
  scanDetailLabel: {
    fontWeight: "bold",
    marginRight: 10,
    width: 80,
  },
  scanDetailValue: {
    flex: 1,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: "#002E6E",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  modalButtonPrimaryText: {
    color: "white",
    fontWeight: "bold",
  },

  // Scanned items styles
  scannedItemsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  scannedItemsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scannedItemCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scannedItemText: {
    fontWeight: "bold",
  },
  scannedItemTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
