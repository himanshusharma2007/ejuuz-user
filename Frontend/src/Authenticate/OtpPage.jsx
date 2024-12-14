import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import authService from "../service/authService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  const handleOTPChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    try {
      const res = await authService.verifyOtp(otpValue);
      console.log(res);

      navigation.navigate("Home",{screen:"HomeStack"});
      setIsVerified(true);
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      navigation.navigate("/"); // Navigate to Router instead of "/"
      setError("");
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.innerContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={40} color="#2575FC" />
              </View>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to your mobile number
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpInputWrapper}>
                  <TextInput
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={[styles.otpInput, { width: width / 9 }]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleBackspace(nativeEvent.key, index)
                    }
                    placeholderTextColor="#888"
                  />
                </View>
              ))}
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {isVerified && (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4ECB71" />
                <Text style={styles.successText}>
                  OTP Verified Successfully!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                otp.some((digit) => digit === "") && styles.disabledButton,
              ]}
              onPress={verifyOTP}
              disabled={otp.some((digit) => digit === "")}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 25,
    padding: width * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  lockIconContainer: {
    backgroundColor: "rgba(37, 117, 252, 0.1)",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
    alignSelf: "center",
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#2575FC",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.03,
    gap: width * 0.02,
  },
  otpInputWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  otpInput: {
    height: height * 0.08,
    borderWidth: 1,
    borderColor: "#2575FC",
    borderRadius: 15,
    textAlign: "center",
    fontSize: width * 0.06,
    color: "#333",
    backgroundColor: "#F5F5F5",
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 10,
    fontSize: width * 0.035,
    textAlign: "center",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  successText: {
    color: "#4ECB71",
    marginLeft: 10,
    fontSize: width * 0.035,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2575FC",
    borderRadius: 15,
    padding: height * 0.02,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
});

export default OtpPage;