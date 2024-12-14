import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const LoadingIndicator = () => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateCircle = (animation, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateCircle(animation1, 0);
    animateCircle(animation2, 333);
    animateCircle(animation3, 666);

    return () => {
      animation1.stopAnimation();
      animation2.stopAnimation();
      animation3.stopAnimation();
    };
  }, []);

  const getAnimatedStyle = (animation) => ({
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    }),
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.5, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.circle, styles.circle1, getAnimatedStyle(animation1)]}
      />
      <Animated.View
        style={[styles.circle, styles.circle2, getAnimatedStyle(animation2)]}
      />
      <Animated.View
        style={[styles.circle, styles.circle3, getAnimatedStyle(animation3)]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
  },
  circle1: {
    backgroundColor: "#FF69B4", // Pink
  },
  circle2: {
    backgroundColor: "#8B5CF6", // Purple
  },
  circle3: {
    backgroundColor: "#00CED1", // Turquoise
  },
});

export default LoadingIndicator;
