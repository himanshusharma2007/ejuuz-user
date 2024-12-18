import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Card, Title, Paragraph } from "react-native-paper";

export default function ManageAccount() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.ManageAccountTitle}>Manage Your Account</Title>
          <Paragraph>Update your account details and settings.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={styles.button} onPress={() => {}}>
            Update Profile
          </Button>
          <Button mode="outlined" style={styles.button} onPress={() => {}}>
            Change Password
          </Button>
        </Card.Actions>
      </Card>
      <Button
        mode="contained"
        style={[styles.button, styles.logoutButton]}
        onPress={() => {}}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  card: {

    marginBottom: 20,
    backgroundColor: "white",
    elevation: 2,

  },
  ManageAccountTitle: {
    color: "  "
  },
  button: {
    marginRight: 10,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
});
