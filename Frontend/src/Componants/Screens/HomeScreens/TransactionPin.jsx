import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function TransactionPin() {
  const [pin, setPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const route = useRoute();
  const { orderItem } = route.params;
  const navigation = useNavigation();

  const orderItemWithPin = orderItem;
  const maxLength = 6;

  // Animation values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  const handleNumberPress = (num) => {
    if (pin.length < maxLength) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleDone = () => {
    setShowSuccess(true);
    // Start scale animation for checkmark
    Animated.sequence([
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 400,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigation.navigate("OrderStatus", { pin, orderItemWithPin });
      }, 1000);
    });
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < maxLength; i++) {
      dots.push(
        <View key={i} style={styles.dotContainer}>
          <View style={[styles.dot, pin.length > i && styles.dotFilled]} />
        </View>
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeValue }]}>
        <Text style={styles.title}>Enter Your Transition Pin</Text>

        <View style={styles.pinContainer}>{renderPinDots()}</View>

        <View style={styles.keypadContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.keypadButton}
              onPress={() => handleNumberPress(num.toString())}
            >
              <Text style={styles.keypadText}>{num}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.keypadButton}>
            <Text style={styles.keypadText}>.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handleNumberPress("0")}
          >
            <Text style={styles.keypadText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keypadButton}
            onPress={handleBackspace}
          >
            <Text style={styles.keypadText}>⌫</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.doneButton}
          disabled={pin.length !== maxLength}
          labelStyle={styles.doneButtonText}
          onPress={handleDone}
        >
          Done
        </Button>
      </Animated.View>

      {/* Success Animation Container */}
      {showSuccess && (
        <Animated.View
          style={[
            styles.successContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <AntDesign name="checkcircle" size={100} color="#4CAF50" />
          <Text style={styles.successText}>Payment Done </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
  },
  dotContainer: {
    padding: 10,
    marginHorizontal: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },
  dotFilled: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  keypadButton: {
    width: "30%",
    aspectRatio: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  keypadText: {
    fontSize: 24,
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: "#003087",
  },
  doneButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  successContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});
