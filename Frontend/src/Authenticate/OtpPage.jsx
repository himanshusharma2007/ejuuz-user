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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import authService from "../service/authService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  // Handle input change for OTP
  const handleOTPChange = (text, index) => {
    // Only allow numeric input
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move focus to next input
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to move to previous input
  const handleBackspace = (key, index) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    const otpValue = otp.join("");

    // Simple validation
    if (otpValue.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    try {
      const res = await authService.verifyOtp(otpValue);
      console.log(res);

      navigation.navigate("/");
      setIsVerified(true);
      setError("");
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    }
  };

  // Reset OTP
  const resetOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsVerified(false);
    inputRefs.current[0].focus();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#6A11CB", "#2575FC"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Verify OTP</Text>

            {/* OTP Input Container */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOTPChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleBackspace(nativeEvent.key, index)
                  }
                  placeholderTextColor="#888"
                />
              ))}
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Verification Success */}
            {isVerified && (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4ECB71" />
                <Text style={styles.successText}>
                  OTP Verified Successfully!
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.verifyButton,
                  otp.some((digit) => digit === "") && styles.disabledButton,
                ]}
                onPress={verifyOTP}
                disabled={otp.some((digit) => digit === "")}
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={resetOTP}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: "#2575FC",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    color: "#333",
    backgroundColor: "#F5F5F5",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 10,
    fontSize: 14,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  successText: {
    color: "#4ECB71",
    marginLeft: 10,
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: "#2575FC",
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: "#F0F0F0",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
});

export default OtpPage;
