import React, { useState } from "react";
import { StyleSheet, View, Alert, Linking, ScrollView } from "react-native";
import { TextInput, Button, Title, Card, Subheading } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (name && email && message) {
      Alert.alert("Form Submitted", "Thank you for reaching out!");
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  // Handle phone call
  const handleCall = () => {
    Linking.openURL("tel:+1234567890").catch((err) =>
      alert("Unable to make a call")
    );
  };

  // Handle email
  const handleEmail = () => {
    Linking.openURL("mailto:support@example.com").catch((err) =>
      alert("Unable to send email")
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subheading}>
            We'd love to hear from you!
          </Subheading>
          <TextInput
            label="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#007bff" } }}
          />
          <TextInput
            label="Your Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#007bff" } }}
          />
          <TextInput
            label="Your Message"
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
            theme={{ colors: { primary: "#007bff" } }}
          />
          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}
            buttonColor="#007bff" // Green color for submit button
            color="#fff" // Text color white for contrast
          >
            Submit
          </Button>
        </Card.Content>
      </Card>

      {/* Contact Options Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subheading}>
            Other Ways to Reach Us:
          </Subheading>
          <Button
            icon={() => <MaterialIcons name="phone" size={20} color="#fff" />}
            mode="contained"
            style={styles.contactButton}
            onPress={handleCall}
            buttonColor="#007bff" // Light Blue color for call button
            color="#fff" // Text color white
          >
            Call Us
          </Button>
          <Button
            icon={() => <MaterialIcons name="email" size={20} color="#fff" />}
            mode="contained"
            style={styles.contactButton}
            onPress={handleEmail}
            buttonColor="#007bff" // Yellow color for email button
            color="#fff" // Text color white
          >
            Email Us
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  submitButton: {
    marginTop: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButton: {
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
