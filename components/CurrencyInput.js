import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Input } from "galio-framework";
import { argonTheme } from "../constants";

const CurrencyInput = ({
  shadowless = false,
  success = false,
  error = false,
  value = "",
  onChangeText,
  style,
  placeholder,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value]);

  const formatValue = (value) => {
    const rawValue = value.replace(/[^\d.]/g, "");
    if (rawValue === "") {
      return "";
    }
    const delimiter = ",";
    const delimiterRegExp = new RegExp(`\\B(?=(\\d{3})+(?!\\d))`, "g");
    let formattedValue = `Q${rawValue}`;
    if (rawValue.length >= 4) {
      formattedValue = `Q${rawValue.replace(delimiterRegExp, delimiter)}`;
    }
    return formattedValue;
  };

  const handleInputChange = (text) => {
    const rawValue = text.replace(/[^\d.]/g, "");
    setInputValue(formatValue(rawValue));
    onChangeText(rawValue);
  };

  const handleInputBlur = () => {
    if (inputValue !== "") {
      const rawValue = inputValue.replace(/[^\d.]/g, "");
      let formattedValue = inputValue;
      if (!formattedValue.includes(".")) {
        formattedValue = `${formattedValue}.00`;
        onChangeText(rawValue + ".00");
      } else {
        const decimalIndex = formattedValue.indexOf(".");
        const decimalPart = formattedValue.slice(decimalIndex + 1);
        if (decimalPart.length === 0) {
          formattedValue += "00";
          onChangeText(rawValue + "00");
        } else if (decimalPart.length === 1) {
          formattedValue += "0";
          onChangeText(rawValue + "0");
        }
      }
      setInputValue(formatValue(formattedValue));
    }
  };

  const handleInputClear = () => {
    setInputValue("");
    onChangeText("");
  };

  const inputStyles = [
    styles.input,
    !shadowless && styles.shadow,
    success && styles.success,
    error && styles.error,
    style,
  ];

  return (
    <Input
      placeholder={placeholder}
      placeholderTextColor={argonTheme.COLORS.MUTED}
      style={inputStyles}
      color={argonTheme.COLORS.HEADER}
      value={inputValue}
      onChangeText={handleInputChange}
      onBlur={handleInputBlur}
      onClear={handleInputClear}
      {...props}
    />
  );
};

CurrencyInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  style: PropTypes.object,
  placeholder: PropTypes.string,
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

export default CurrencyInput;
