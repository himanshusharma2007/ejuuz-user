import React, { useState } from "react";
import { StyleSheet, View, Alert, Linking, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput, Card, Surface } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle form submission
  const handleSubmit = () => {
    // Reset submission state
    setIsSubmitting(true);

    // Comprehensive validation
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!message.trim()) {
      Alert.alert("Validation Error", "Please enter your message.");
      setIsSubmitting(false);
      return;
    }

    // Simulating form submission
    setTimeout(() => {
      Alert.alert(
        "Thank You!", 
        "Your message has been submitted successfully.",
        [{ text: "OK", onPress: () => {
          setName("");
          setEmail("");
          setMessage("");
          setIsSubmitting(false);
        }}]
      );
    }, 1500);
  };

  // Handle phone call
  const handleCall = () => {
    Linking.openURL("tel:+1234567890").catch((err) =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  // Handle email
  const handleEmail = () => {
    Linking.openURL("mailto:support@example.com").catch((err) =>
      Alert.alert("Error", "Unable to send email")
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Contact Form */}
      <Surface style={styles.card}>
        <View style={styles.cardContent}>
          <TextInput
            label="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            theme={{ colors: { primary: "#0056b3" } }}
          />
          <TextInput
            label="Your Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
            theme={{ colors: { primary: "#0056b3" } }}
          />
          <TextInput
            label="Your Message"
            value={message}
            onChangeText={setMessage}
            style={[styles.input, styles.multilineInput]}
            mode="outlined"
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="message-text" />}
            theme={{ colors: { primary: "#0056b3" } }}
          />
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.buttonText}>Sending...</Text>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.buttonText}>Send Message</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Surface>

      {/* Contact Options */}
      <View style={styles.contactOptionsContainer}>
        <TouchableOpacity style={styles.contactOption} onPress={handleCall}>
          <MaterialIcons name="phone" size={24} color="#002E6E" />
          <Text style={styles.contactOptionText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactOption} onPress={handleEmail}>
          <MaterialIcons name="email" size={24} color="#002E6E" />
          <Text style={styles.contactOptionText}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#002E6E',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  card: {
    borderRadius: 15,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  cardContent: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 120,
  },
  submitButton: {
    backgroundColor: '#002E6E',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  contactOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactOption: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contactOptionText: {
    color: '#002E6E',
    marginLeft: 10,
    fontWeight: '600',
  }
});