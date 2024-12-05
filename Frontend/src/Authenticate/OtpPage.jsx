import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function OtpPage() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const inputs = useRef([]);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const showSuccessAlert = () => {
    setShowSuccessModal(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showErrorAlert = () => {
    setShowErrorModal(true);
    setTimeout(() => {
      setShowErrorModal(false);
    }, 2000);
  };

  const validateOTP = () => {
    const otp = code.join("");
    if (otp.length !== 4) {
      showErrorAlert();
      return;
    }
    showSuccessAlert();
  };

  const handleStart = () => {
    setShowSuccessModal(false);
    navigation.navigate("/");
  };

  const handleResend = () => {
    if (!canResend) return;
    setCode(["", "", "", ""]);
    setTimer(45);
    setCanResend(false);
  };

  // Success Modal Component
  const SuccessModal = () => (
    <Modal transparent visible={showSuccessModal} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.successModalContainer,
            {
              transform: [
                {
                  scale: scaleValue,
                },
              ],
            },
          ]}
        >
          <View style={styles.successIconContainer}>
            <Image
              source={require("../../src/images/success.png")} // Add your success icon
              style={styles.successIcon}
            />
          </View>
          <Text style={styles.successTitle}>Verification Successful!</Text>
          <Text style={styles.successMessage}>
            Your verification has been completed successfully
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  // Error Modal Component
  const ErrorModal = () => (
    <Modal transparent visible={showErrorModal} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.errorModalContainer}>
          <Text style={styles.errorText}>Please enter the complete OTP</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit verification sent to{"\n"}+01234567890
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../src/images/document.png")}
            style={styles.documentIcon}
          />
          <View style={styles.dotOne} />
          <View style={styles.dotTwo} />
        </View>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[styles.codeBox]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => inputs.current[index].setNativeProps({ text: "" })}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
          <Text style={styles.resendText}>
            Resend code in{" "}
            <Text style={styles.highlightText}>{timer}second</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={validateOTP}>
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>

      <SuccessModal />
      <ErrorModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  documentIcon: {
    width: 45,
    height: 45,
    tintColor: "#002B5B",
  },
  dotOne: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0000",
    top: "30%",
    right: 15,
  },
  dotTwo: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#002B5B",
    bottom: 15,
    right: 25,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.7,
    marginBottom: 40,
  },
  codeBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    backgroundColor: "white",
  },
  resendText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },
  highlightText: {
    color: "#002B5B",
  },
  continueButton: {
    backgroundColor: "#002B5B",
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    alignItems: "center",
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    tintColor: "#002B5B",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002B5B",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: "#002B5B",
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorModalContainer: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    width: width * 0.9,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
