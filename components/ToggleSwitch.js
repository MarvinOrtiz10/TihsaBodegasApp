/*Versión estable 1.2 toggle animación más lenta - Ing. José Ortiz*/
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ToggleSwitch = ({ toggleOn, toggleOff, isEnabled, onSwitchToggle }) => {
  return (
    <TouchableOpacity onPress={onSwitchToggle} style={styles.container}>
      <View
        style={
          isEnabled ? styles.toggleContainerEnabled : styles.toggleContainer
        }
      >
        <Text style={isEnabled ? styles.leftText : styles.rightText}>
          {isEnabled ? toggleOn : toggleOff}
        </Text>
        <View
          style={[
            styles.circleContainer,
            isEnabled ? styles.circleRight : styles.circleLeft,
          ]}
        >
          <View style={[styles.circle]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleContainer: {
    width: 180,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    transition: "background-color 4s cubic-bezier(0.5, 0.1, 0.7, 1)", // Añade una transición aún más lenta
  },
  toggleContainerEnabled: {
    width: 180,
    height: 40,
    backgroundColor: "#fed30b",
    borderRadius: 20,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    transition: "background-color 4s cubic-bezier(0.5, 0.1, 0.7, 1)", // Añade una transición aún más lenta
  },
  leftText: {
    flex: 1,
    textAlign: "left",
    paddingLeft: 10,
    color: "#0f334f",
  },
  rightText: {
    flex: 1,
    textAlign: "right",
    paddingRight: 10,
    color: "white",
  },
  circleContainer: {
    width: 36,
    height: 36,
    backgroundColor: "lightgray",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 2s cubic-bezier(0.5, 0.1, 0.7, 1)", // Añade una transición más lenta
    marginHorizontal: 2,
  },
  circle: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 16,
  },
  circleLeft: {
    position: "absolute",
    left: 0,
  },
  circleRight: {
    position: "absolute",
    right: 0,
  },
});

export default ToggleSwitch;

/*Versión estable 1.1 toggle animación rápida - Ing. José Ortiz

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ToggleSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const onSwitchToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <TouchableOpacity onPress={onSwitchToggle} style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={isEnabled ? styles.leftText : styles.rightText}>
          {isEnabled ? "Activado" : "Desactivado"}
        </Text>
        <View
          style={[
            styles.circleContainer,
            isEnabled ? styles.circleRight : styles.circleLeft,
          ]}
        >
          <View style={[styles.circle]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleContainer: {
    width: 180,
    height: 40,
    backgroundColor: "lightgray",
    borderRadius: 20,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  leftText: {
    flex: 1,
    textAlign: "left",
    paddingLeft: 10,
  },
  rightText: {
    flex: 1,
    textAlign: "right",
    paddingRight: 10,
  },
  circleContainer: {
    width: 36,
    height: 36,
    backgroundColor: "lightgray",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 16,
  },
  circleLeft: {
    position: "absolute",
    left: 0,
  },
  circleRight: {
    position: "absolute",
    right: 0,
  },
});

export default ToggleSwitch;*/
