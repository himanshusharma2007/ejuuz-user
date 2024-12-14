import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function Categories({ onPress, category }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9); // Shrink effect
  };

  const handlePressOut = () => {
    scale.value = withSpring(1); // Return to original size
  };

  return (
    <Animated.View style={[styles.categoryItem, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.category}>{category}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    width: 100,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: "#bbb",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: "white",
  },
  category: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
});
