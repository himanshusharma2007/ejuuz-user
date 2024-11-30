import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import { Text, Card } from "react-native-paper";

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.heading}>
            About Ejuuz
          </Text>
          <Text variant="bodyLarge" style={styles.bodyText}>
            Our app allows you to easily store, manage, and spend your money on
            the go. With our secure platform, you can make transactions, check
            your balance, and track your spending all in one place. Whether
            you're paying bills, shopping online, or sending money to friends
            and family, our app makes it easy and convenient to do so. Plus,
            with our various promotions and discounts, you can save even more
            while using our app. Thank you for choosing us as your preferred
            e-wallet solution. If you have any questions or feedback, please
            don't hesitate to contact us. We're always here to help.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
  },
  heading: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bodyText: {
    color: "gray",
    marginTop: 10,
    lineHeight: 24,
  },
});
