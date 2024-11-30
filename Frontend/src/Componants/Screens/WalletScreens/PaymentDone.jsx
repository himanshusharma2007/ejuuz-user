import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PaymentDone() {
  const navigation = useNavigation();

  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  // Animation sequence
  React.useEffect(() => {
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
    ]).start();
  }, []);

  // Navigate back to wallet
  const handlebackwallet = () => {
    navigation.reset({
      index: 0, // '0' का मतलब है कि पहला स्क्रीन ही दिखेगा
      routes: [{ name: "Wallet" }], // 'Wallet' स्क्रीन पर नेविगेट करें
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.successContainer,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Image source={require("../../../images/paymentdone.png")} />
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={handlebackwallet}>
        <Text style={styles.buttonText}>Back to wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    bottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#002E6E",
    width: "80%",
    alignSelf: "center",
    marginTop: 100,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
