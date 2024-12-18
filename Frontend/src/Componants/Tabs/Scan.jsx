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
      })
    ]).start();
  };

  useEffect(() => {
    (async () => {
      // Camera Permission
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");

      // Contacts Permission
      const { status: contactStatus } = await Contacts.requestPermissionsAsync();
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
          Contacts.Fields.PhoneNumbers
        ],
        pageSize: 10, // Limit to 10 contacts
      });

      // Transform contacts to match the existing structure
      const formattedContacts = data.map((contact, index) => ({
        id: contact.id || index,
        name: contact.name,
        avatar: contact.image 
          ? { uri: contact.image.uri } 
          : getRandomEmoji(),
        phoneNumber: contact.phoneNumbers?.[0]?.number || ''
      }));

      setRecentContacts(formattedContacts);
    } catch (error) {
      console.error("Error fetching contacts", error);
      Alert.alert("Error", "Could not fetch contacts");
    }
  };

  // Function to get a random emoji as a fallback
  const getRandomEmoji = () => {
    const emojis = ['🤠', '👨', '👩', '👧', '👦', '👴', '👵'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Function to generate random pastel colors
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 80%, 0.7)`;
  };

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
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject, styles.scanner]}
          />
          <View style={styles.scanOverlay}>
            <View style={styles.scannerFrame}>
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.topLeftCorner,
                  { transform: [{ scale: topLeftScale }] }
                ]}
                onTouchEnd={() => animateCorner(topLeftScale)}
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.topRightCorner,
                  { transform: [{ scale: topRightScale }] }
                ]}
                onTouchEnd={() => animateCorner(topRightScale)}
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.bottomLeftCorner,
                  { transform: [{ scale: bottomLeftScale }] }
                ]}
                onTouchEnd={() => animateCorner(bottomLeftScale)}
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.bottomRightCorner,
                  { transform: [{ scale: bottomRightScale }] }
                ]}
                onTouchEnd={() => animateCorner(bottomRightScale)}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadFromGallery}
          >
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Upload from gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
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
                        ? 'transparent' 
                        : getRandomPastelColor() 
                    }
                  ]}
                >
                  {contact.avatar.uri ? (
                    <Image 
                      source={contact.avatar} 
                      style={styles.avatarImage} 
                    />
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
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  scannerContainer: {
    height: height * 0.6, 
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 30
  },
  recentText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: '#333',
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
    color: '#666',
    textAlign: 'center',
  },
  emptyContactItem: {
    width: 20, // Ensures some extra space at the end of horizontal scroll
  }
});