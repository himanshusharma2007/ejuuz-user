import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  // Shared values for animations
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  // Animations
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(logoScale.value, { duration: 1000 }) }],
    opacity: withTiming(logoOpacity.value, { duration: 1000 }),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: withTiming(textOpacity.value, { duration: 800 }),
    transform: [
      {
        translateY: withTiming(textTranslateY.value, {
          duration: 800,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
  }));

  // Trigger animations
  useEffect(() => {
    logoScale.value = 1;
    logoOpacity.value = 1;
    textOpacity.value = 1;
    textTranslateY.value = 0;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"light-content"}
      />
      {/* Animated Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("../../../images/ejuuzlogo.png")} // Add your logo here
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Animated Text */}
      {/* <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.text}>Welcome to Ejuuz</Text>
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002E6E", // Set your background color
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: width * 0.5, // 50% of the screen width
    height: width * 0.5, // Maintain square aspect ratio
    marginBottom: height * 0.05, // Responsive spacing
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    marginTop: height * 0.02, // Responsive spacing from logo
  },
  text: {
    fontSize: width * 0.06, // Font size relative to screen width
    fontWeight: "600",
    color: "#fff", // Text color for better contrast
  },
});
