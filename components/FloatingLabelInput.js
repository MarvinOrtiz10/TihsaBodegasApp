import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Animated } from "react-native";
import PropTypes from "prop-types";

import { Input } from "galio-framework";

import Icon from "./Icon";
import { argonTheme } from "../constants";

const ArInput = ({
  shadowless = false,
  success = false,
  error = false,
  floatingLabel = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = new Animated.Value(floatingLabel ? -20 : 0);
  const labelFontSize = new Animated.Value(floatingLabel ? 12 : 16);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: isFocused ? -20 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(labelFontSize, {
        toValue: isFocused ? 12 : 16,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputStyles = [
    styles.input,
    !shadowless && styles.shadow,
    success && styles.success,
    error && styles.error,
    isFocused && styles.focused,
    { ...props.style },
  ];

  const labelStyles = [
    styles.label,
    {
      transform: [
        {
          translateY: labelPosition,
        },
      ],
      fontSize: labelFontSize,
      color: isFocused
        ? argonTheme.COLORS.PLACEHOLDER
        : argonTheme.COLORS.PLACEHOLDER,
      backgroundColor: isFocused ? "#FFFFFF" : "transparent",
      zIndex: isFocused ? 1 : 0,
    },
  ];

  return (
    <View style={styles.container}>
      <Input
        placeholder={floatingLabel ? "" : "write something here"}
        placeholderTextColor={argonTheme.COLORS.MUTED}
        style={inputStyles}
        color={argonTheme.COLORS.HEADER}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <Animated.View style={labelStyles}>
        <Animated.Text>{floatingLabel}</Animated.Text>
      </Animated.View>
    </View>
  );
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  floatingLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
  },
  input: {
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    borderWidth: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    fontSize: 16,
    color: "#333",
    zIndex: 0,
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR,
  },
  focused: {
    borderColor: argonTheme.COLORS.INFO,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  label: {
    position: "absolute",
    left: 10,
    top: 20,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
});

export default ArInput;
