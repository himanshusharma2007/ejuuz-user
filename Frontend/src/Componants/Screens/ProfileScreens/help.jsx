import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Help() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse products, add them to your cart, and proceed to checkout.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support credit/debit cards, UPI, and net banking.",
    },
    {
      question: "How can I track my order?",
      answer: "Go to the 'My Orders' section and select the order to track.",
    },
    {
      question: "What is the return policy?",
      answer: "You can return products within 7 days of delivery.",
    },
  ];

  const handleCallSupport = () => {
    const phoneNumber = "tel:+1234567890"; // Replace with your support number
    Linking.openURL(phoneNumber).catch((err) =>
      alert("Unable to open phone dialer")
    );
  };

  const handleEmailSupport = () => {
    const email = "mailto:support@example.com"; // Replace with your support email
    Linking.openURL(email).catch((err) => alert("Unable to open email client"));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleCallSupport}
        >
          <MaterialIcons name="phone" size={24} color="#fff" />
          <Text style={styles.contactButtonText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleEmailSupport}
        >
          <MaterialIcons name="email" size={24} color="#fff" />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
