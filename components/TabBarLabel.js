import React from "react";
import { Dimensions, Platform, View, Text, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const CustomTabBarLabel = ({ label, focused }) => {
  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
    paddingHorizontal: 1,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  containerFocused: {
    //backgroundColor: "#F0F2F5",
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: isMovil ? 9 : 14,
    color: "#65676B",
  },
  labelFocused: {
    color: "#007AFF",
  },
});

export default CustomTabBarLabel;
