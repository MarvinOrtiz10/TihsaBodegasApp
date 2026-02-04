import React from "react";
import { Dimensions, Platform, TouchableOpacity } from "react-native";
const { width, height } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const TabBarButton = ({ accessibilityState, children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopColor: accessibilityState.selected ? "#007AFF" : "#65676B",
        borderTopWidth: accessibilityState.selected ? 2 : 0,
        padding: isMovil ? 5 : 10,
        height: isMovil ? 50 : 55,
        //backgroundColor: "red",
        // Otros estilos personalizados que desees agregar
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default TabBarButton;
