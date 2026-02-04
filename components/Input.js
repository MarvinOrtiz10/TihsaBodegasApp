import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Input } from "galio-framework";
import Icon from "./Icon";
import { argonTheme } from "../constants";

const ArInput = ({
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
    <Input
      placeholder=""
      placeholderTextColor={argonTheme.COLORS.MUTED}
      style={inputStyles}
      color={argonTheme.COLORS.HEADER}
      iconContent={
        <Icon
          size={14}
          color={argonTheme.COLORS.ICON}
          name="link"
          family="AntDesign"
        />
      }
      {...props}
    />
  );
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
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
    //shadowOpacity: 0,
    //elevation: 1,
  },
});

export default ArInput;
