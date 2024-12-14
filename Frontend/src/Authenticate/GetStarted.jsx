import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Surface,
  Provider as PaperProvider,
  Portal,
  Modal,
  List,
  Searchbar,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import authService from "../service/authService";
import axios from "axios";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const countryCodes = [
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  // Add more country codes as needed
];

export default function GetStarted() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Phone number is required.",
      });
      return false;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Phone number must contain only digits.",
      });
      return false;
    }

    if (phoneNumber.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Phone number must be exactly 10 digits.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validatePhoneNumber()) {
      try {
        const res = await authService.sendOtp(
          selectedCountry.code + phoneNumber
        );
        console.log(res);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP sent successfully!",
        });
        navigation.navigate("OtpPage", {
          phoneNumber: selectedCountry.code + phoneNumber,
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP. Please try again.",
        });
      }
    }
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const filteredCountries = countryCodes.filter((country) =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PaperProvider>
      <StatusBar barStyle="light-content" backgroundColor="#002E6E" />
      <ScrollView style={styles.main} bounces={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require("../../src/images/ejuuzlogo.png")}
              resizeMode="contain"
            />
          </View>
          <View style={styles.content}>
            <Image
              style={styles.cartoon}
              source={require("../../src/images/cartoon_1.png")}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={showModal}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCode}>{selectedCountry.code}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#002E6E"
              />
            </TouchableOpacity>

            <TextInput
              style={styles.phoneInput}
              mode="outlined"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="number-pad"
              outlineColor="#E0E0E0"
              activeOutlineColor="#002E6E"
              theme={{ colors: { primary: "#002E6E" } }}
            />
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>SEND VIA SMS</Text>
          </TouchableOpacity>
        </View>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Searchbar
              placeholder="Search countries"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
            <ScrollView>
              {filteredCountries.map((country) => (
                <List.Item
                  key={country.code}
                  title={`${country.flag} ${country.country}`}
                  description={country.code}
                  onPress={() => {
                    setSelectedCountry(country);
                    hideModal();
                  }}
                  style={styles.countryItem}
                />
              ))}
            </ScrollView>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#002E6E",
    height: height * 0.55,
    borderBottomRightRadius: 120,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 15 : 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.15, // Added fixed height for the header
  },
  logo: {
    width: 200, // Increased from 0.4 to 0.6 (60% of screen width)
    height: 210, // Increased height to 10% of screen height
    alignSelf: "center",
    marginTop: 70,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // Reduced from 20 to accommodate larger logo
  },
  cartoon: {
    width: 300,
    height: 250,
    marginTop: 50,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 14,
    color: "#002E6E",
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#fff",
    height: 48,
  },
  btn: {
    backgroundColor: "#002E6E",
    borderRadius: 4,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  modal: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: height * 0.7,
  },
  searchbar: {
    marginBottom: 10,
  },
  countryItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
