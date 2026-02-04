import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const NumberInput = ({ value, onValueChange, minValue = 0 }) => {
  const inputRef = useRef(null);

  const handleIncrement = () => {
    onValueChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > minValue) {
      onValueChange(value - 1);
    }
  };

  const handleInputChange = (newValue) => {
    if (newValue == "0" || newValue == 0) {
      onValueChange(minValue);
    } else {
      const parsedValue = parseInt(newValue, 10);
      if (!isNaN(parsedValue)) {
        onValueChange(parsedValue);
      }
    }
  };

  const handleInputPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.decrementButton]}
        onPress={handleDecrement}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.valueContainer}
        onPress={handleInputPress}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder=""
          value={value.toString()}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          returnKeyType="done"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.incrementButton]}
        onPress={handleIncrement}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#007AFF",
    borderRadius: 8,
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  decrementButton: {
    backgroundColor: "#007AFF",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  incrementButton: {
    backgroundColor: "#007AFF",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  valueContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 6,
    borderColor: "#007AFF",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NumberInput;
