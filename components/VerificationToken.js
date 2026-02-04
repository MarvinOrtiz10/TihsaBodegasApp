import React, { useState, useRef } from "react";
import { View, Text, Button, TextInput } from "react-native";
import PropTypes from "prop-types";

const getBoundedNumber = (number, max, min = 0) =>
  Math.max(min, Math.min(number, max));

const VerificationToken = ({ tokenLength, inputClass, onTokenChanged }) => {
  const tokenFields = new Array(tokenLength).fill(null).map(() => useRef(null));
  const [values, setValues] = useState(Array(tokenLength).fill(""));

  const updateToken = () => {
    const currentValue = values.filter((value) => /^\d+$/.test(value)).join("");
    onTokenChanged(currentValue);
  };

  const forwardFocusInput = (index) => {
    const totalFields = tokenFields.length;
    const fieldIndex = getBoundedNumber(index, totalFields - 1);

    while (fieldIndex < totalFields) {
      if (tokenFields[fieldIndex].current) {
        tokenFields[fieldIndex].current.focus();
        break;
      }
      fieldIndex++;
    }
  };

  const backwardFocusInput = (index) => {
    const totalFields = tokenFields.length;
    const fieldIndex = getBoundedNumber(index, totalFields - 1);

    while (fieldIndex >= 0) {
      if (tokenFields[fieldIndex].current) {
        tokenFields[fieldIndex].current.focus();
        break;
      }
      fieldIndex--;
    }
  };

  const onInputChanged = (index) => (value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    updateToken();
  };

  const onInputFilled = (index) => (value) => {
    forwardFocusInput(index + 1);
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const onInputEmptied = (index) => () => {
    backwardFocusInput(index - 1);
    const newValues = [...values];
    newValues[index] = "";
    setValues(newValues);
  };

  const onEmptyBackspace = (index) => () => {
    backwardFocusInput(index - 1);
    if (tokenFields[index - 1].current) {
      const value = tokenFields[index - 1].current.value;
      const newValue = value.substr(0, value.length - 1);
      tokenFields[index - 1].current.value = newValue;
      onInputChanged(index - 1)(newValue);
    }
  };

  const onInputAfterFilled =
    (index) =>
    (value, input = "") => {
      forwardFocusInput(index + 1);
      if (
        tokenFields[index + 1].current &&
        !tokenFields[index + 1].current.value
      ) {
        const nextInput = tokenFields[index + 1].current;
        const currentValue = nextInput.value;
        const newValue = `${currentValue}${input[0]}`;
        nextInput.value = newValue;
        onInputChanged(index + 1)(newValue);
      }
    };

  const buildInputFields = () => {
    return Array.from({ length: tokenLength }, (_, index) => (
      <TextInput
        key={index}
        ref={tokenFields[index]}
        style={inputClass}
        maxLength={1}
        onChangeText={onInputChanged(index)}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Backspace" && !values[index]) {
            onEmptyBackspace(index);
          }
        }}
        value={values[index]}
        onFocus={() => {
          if (values[index] && index < tokenLength - 1) {
            forwardFocusInput(index + 1);
          }
        }}
        onBlur={() => {
          if (values[index] && index < tokenLength - 1) {
            forwardFocusInput(index + 1);
          }
        }}
      />
    ));
  };

  return <View style={{ flexDirection: "row" }}>{buildInputFields()}</View>;
};

VerificationToken.propTypes = {
  tokenLength: PropTypes.number.isRequired,
  inputClass: PropTypes.object,
  onTokenChanged: PropTypes.func,
};

export default VerificationToken;
