import React from "react";
import { StyleSheet, TextInput } from "react-native";
import PropTypes from "prop-types";
import { argonTheme } from "../constants";

const InputAutoGrowing = ({
  shadowless = false,
  success = false,
  error = false,
  style,
  ...props
}) => {
  const inputStyles = [
    styles.input,
    !shadowless && styles.shadow,
    success && styles.success,
    error && styles.error,
    style,
  ];

  return (
    <TextInput
      placeholder=""
      placeholderTextColor={argonTheme.COLORS.MUTED}
      style={inputStyles}
      multiline
      blurOnSubmit={true}
      {...props}
    />
  );
};

InputAutoGrowing.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    maxHeight: 85,
    marginVertical: 7,
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    paddingHorizontal: 16,
    color: "#6c757d",
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    //shadowColor: argonTheme.COLORS.BLACK,
    //shadowOffset: { width: 0, height: 1 },
    //shadowRadius: 2,
    //shadowOpacity: 0.1,
    //elevation: 1,
  },
});

export default InputAutoGrowing;
