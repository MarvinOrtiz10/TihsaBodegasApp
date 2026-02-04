import React, { useState } from "react";
import { View, TextInput } from "react-native";
import PropTypes from "prop-types";

const TokenInput = ({
  maxLength,
  onInputChanged,
  onInputFilled,
  onInputEmptied,
  onEmptyBackspace,
  onInputAfterFilled,
  onShiftLeft,
  onShiftRight,
  ...restProps
}) => {
  const [value, setValue] = useState("");

  const resolveInputHandler = (handlerFn) => {
    return handlerFn || (() => {});
  };

  const inputIsEmpty = () => value.length === 0;
  const inputIsFilled = () => value.length === maxLength;

  const changeInputValue = (newValue) => {
    const maxlength = maxLength;
    const cleanedValue = newValue.replace(/[^0-9]/gi, "");

    if (cleanedValue.length <= maxlength) {
      setValue(cleanedValue);
      onInputChanged && onInputChanged(cleanedValue);

      if (cleanedValue.length === 0) {
        onInputEmptied && onInputEmptied();
      } else if (cleanedValue.length === maxlength) {
        onInputFilled && onInputFilled(cleanedValue);
      }
    } else {
      onInputAfterFilled &&
        onInputAfterFilled(
          cleanedValue.substr(0, maxlength),
          cleanedValue.substr(maxlength)
        );
    }
  };

  const handleKeyUp = (evt) => {
    const cleanedValue = evt.replace(/[^0-9]/gi, "");
    const cursorPosition = evt.selection;
    const keycode = evt.nativeEvent.key;
    const isLeft = keycode === "ArrowLeft";
    const isRight = keycode === "ArrowRight";
    const isEmpty = cleanedValue.length === 0;
    const isBackspace = keycode === "Backspace";

    if (isEmpty && isBackspace) {
      onEmptyBackspace && onEmptyBackspace();
    }

    if ((isEmpty || cursorPosition === 0) && isLeft) {
      onShiftLeft && onShiftLeft();
    }

    if ((isEmpty || cursorPosition === cleanedValue.length) && isRight) {
      onShiftRight && onShiftRight();
    }
  };

  const handleChange = (text) => {
    changeInputValue(text);
  };

  const handleFocus = () => {
    setValue("");
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        ref={(input) => (this.inputField = input)}
        value={value}
        onChangeText={(text) => handleChange(text)}
        onFocus={() => handleFocus()}
        onKeyPress={(e) => handleKeyUp(e)}
        {...restProps}
      />
    </View>
  );
};

TokenInput.propTypes = {
  maxLength: PropTypes.number,
  onInputChanged: PropTypes.func,
  onInputFilled: PropTypes.func,
  onInputEmptied: PropTypes.func,
  onEmptyBackspace: PropTypes.func,
  onInputAfterFilled: PropTypes.func,
  onShiftLeft: PropTypes.func,
  onShiftRight: PropTypes.func,
};

export default TokenInput;
