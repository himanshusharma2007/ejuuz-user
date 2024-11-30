import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Modal,
  Button,
} from "react-native";
import * as Contacts from "expo-contacts";

import { useNavigation } from "@react-navigation/native";

export default function AddContact() {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [enteredNumber, setEnteredNumber] = useState(""); // Store entered number
  const navigation = useNavigation();

  // React.useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {
  //       display: "none",
  //     },
  //   });
  //   return () =>
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: undefined,
  //     });
  // }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Image,
          ],
        });

        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data); // Initialize the filtered contacts
        }
      } else {
        Alert.alert(
          "Permission Required",
          "Please grant contacts permission to use this feature"
        );
      }
    })();
  }, []);

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = contacts.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(text.toLowerCase()) ||
          contact.phoneNumbers?.some((phone) => phone.number.includes(text))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  // Handle number pad input
  const handleNumberPress = (digit) => {
    setEnteredNumber((prev) => prev + digit); // Add digit to entered number
  };

  const handleBackspace = () => {
    setEnteredNumber((prev) => prev.slice(0, -1)); // Remove last digit
  };

  // Render each contact
  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={
        () =>
          navigation.navigate("WalletTransfer", { item: JSON.stringify(item) })
        //      {
        //     if (item.phoneNumbers && item.phoneNumbers[0]) {
        //       const phoneNumber = item.phoneNumbers[0].number.replace(/[\s-]/g, ""); // Normalize the phone number
        //       Linking.openURL(`tel:${phoneNumber}`);
        //     } else {
        //       Alert.alert(
        //         "No Phone Number",
        //         "This contact does not have a phone number."
        //       );
        //     }
        //   }
      }
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name || "No Name"}</Text>
        {item.phoneNumbers && item.phoneNumbers[0] && (
          <Text style={styles.phoneNumber}>{item.phoneNumbers[0].number}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Contact</Text>
      </TouchableOpacity>

      {/* Modal for static number pad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.numberPad}>
            <TextInput
              style={styles.inputDisplay}
              value={enteredNumber}
              editable={false}
              placeholder="Enter phone number"
            />
            <View style={styles.numberPadButtons}>
              {/* Number Pad Buttons */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(digit.toString())}
                >
                  <Text style={styles.numberButtonText}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.backspaceButton}
              onPress={handleBackspace}
            >
              <Text style={styles.backspaceText}>←</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setModalVisible(false)} />
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
    paddingTop: 10,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactInfo: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  numberPad: {
    backgroundColor: "#fff",
    padding: 20,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  inputDisplay: {
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  numberPadButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  numberButton: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: "#007bff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  numberButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  backspaceButton: {
    width: 60,
    height: 60,
    marginTop: 20,
    backgroundColor: "#ff3333",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backspaceText: {
    color: "#fff",
    fontSize: 24,
  },
});
