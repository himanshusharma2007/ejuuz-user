import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function Categories({ onPress, category }) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        // { backgroundColor: category.categorycolor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* <Text style={styles.categoryIcon}>
                    {category.categoryicon}
                  </Text> */}
      <Text>😃</Text>
      <Text style={styles.category}>{category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    width: 90,
    height: 30,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 8,
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderWidth: 1,
  },
});
