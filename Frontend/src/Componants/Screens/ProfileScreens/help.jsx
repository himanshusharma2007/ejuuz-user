import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Help() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse products, add them to your cart, and proceed to checkout. You can review your order details before final confirmation.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support credit/debit cards, UPI, net banking, and digital wallets for your convenience.",
    },
    {
      question: "How can I track my order?",
      answer: "Go to the 'My Orders' section and select the specific order. You'll see real-time tracking information and estimated delivery date.",
    },
    {
      question: "What is the return policy?",
      answer: "You can return products within 7 days of delivery. Items must be unused, in original packaging, and accompanied by the original invoice.",
    },
  ];

  const handleToggleFAQ = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Header */}
      {/* <View style={styles.header}>
        <Ionicons name="help-circle-outline" size={50} color="#002E6E" />
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View> */}

      {/* FAQs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqContainer}>
            <TouchableOpacity 
              style={styles.faqHeader}
              onPress={() => handleToggleFAQ(index)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <MaterialIcons 
                name={expandedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#002E6E" 
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Contact Options */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Need More Help?</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#002E6E",
    marginTop: 10,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#002E6E",
  },
  faqContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 15,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    lineHeight: 22,
  },
  contactSection: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002E6E",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
});