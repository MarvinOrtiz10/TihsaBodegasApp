import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Button } from "galio-framework";

import argonTheme from "../constants/Theme";

const ArButton = ({
  small,
  block,
  shadowless,
  children,
  color,
  style,
  disabled,
  ...props
}) => {
  const colorStyle = color && argonTheme.COLORS[color?.toUpperCase()];

  const buttonStyles = [
    small && styles.smallButton,
    block && styles.block,
    color && { backgroundColor: colorStyle },
    !shadowless && styles.shadow,
    disabled && styles.disabled,
    { ...style },
  ];

  return (
    <Button
      style={buttonStyles}
      shadowless
      textStyle={{ fontSize: 12, fontWeight: "700" }}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "default",
      "primary",
      "secondary",
      "info",
      "error",
      "success",
      "warning",
    ]),
  ]),
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28,
  },
  shadow: {
    //shadowColor: "black",
    //shadowOffset: { width: 0, height: 4 },
    //shadowRadius: 4,
    //shadowOpacity: 0.1,
    //elevation: 2,
  },
  block: {
    width: "100%",
    minHeight: 28,
  },
  disabled: {
    opacity: 0.5, // Cambia la opacidad para dar el aspecto de deshabilitado
  },
});

export default ArButton;
