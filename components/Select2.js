import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import DropDownPicker from "react-native-dropdown-picker";

import Icon from "./Icon";
import { argonTheme } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Select2 = ({
  options,
  onSelect,
  placeholder,
  iconSize = 10,
  iconColor = argonTheme.COLORS.HEADER,
  textStyle,
  error,
  success,
  value,
  setValue,
}) => {
  const [open, setOpen] = useState(false);

  // 🔥 Memo para evitar renders peligrosos
  const items = useMemo(
    () =>
      options.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [options],
  );

  const handleChange = useCallback(
    (val) => {
      if (!onSelect) return;

      const selected = options.find((o) => o.value === val);

      onSelect(selected?.value ?? null, selected?.label ?? null);
    },
    [options, onSelect],
  );

  return (
    <View style={{ zIndex: open ? 1000 : 1 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue} // 🔥 directo
        onChangeValue={handleChange} // 🔥 aquí reaccionas
        placeholder={placeholder || "Select..."}
        style={[styles.input, success && styles.success, error && styles.error]}
        textStyle={[styles.textInput, textStyle]}
        dropDownContainerStyle={styles.dropdown}
        listMode="MODAL" // 🔥 evita bugs en Android
        ArrowDownIconComponent={() => (
          <View 
            style={{height: "50%", justifyContent:"center", borderLeftWidth: 1, borderLeftColor: "#CAD1D7", paddingLeft: 10}}
          >
          <FontAwesomeIcon
            icon={"chevron-down"}
            size={iconSize}
            color={iconColor}
            
          />
          </View>
        )}
        ArrowUpIconComponent={() => (
           <View 
            style={{height: "50%", justifyContent:"center", borderLeftWidth: 1, borderLeftColor: "#CAD1D7", paddingLeft: 10}}
          >
          <FontAwesomeIcon
            icon={"chevron-up"}
            size={iconSize}
            color={iconColor}
          />
          </View>
        )}
      />
    </View>
  );
};

Select2.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  textStyle: PropTypes.any,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: "#CAD1D7",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
  },
  textInput: {
    fontSize: 12,
    color: "#525F7F", //"#ADB5BD",
  },
  dropdown: {
    borderColor: "#cce0ff",
  },
  success: {
    borderColor: "#7BDEB2",
  },
  error: {
    borderColor: "#FCB3A4",
  },
});

export default React.memo(Select2);

/* versión 1.0.0 - 2024-06-20

import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";

import Icon from "./Icon";
import { argonTheme } from "../constants";

const Select2 = ({
  options,
  onSelect,
  placeholder,
  iconName,
  iconFamily,
  iconSize,
  iconColor,
  color,
  textStyle,
  style,
  error,
  success,
  ...props
}) => {
  const [value, setValue] = useState(null);

  const handleOnSelect = (selectedValue) => {
    const selectedItem = options.find(
      (option) => option.value === selectedValue
    );
    if (selectedItem) {
      setValue(selectedValue);
      onSelect && onSelect(selectedItem.value, selectedItem.label);
    } else {
      setValue(null);
      onSelect && onSelect(null, null);
    }
  };

  const pickerStyles = useMemo(() => ({
    inputIOS: [
      styles.input,
      styles.textInput,
      textStyle,
      success && styles.success,
      error && styles.error,
    ],
    inputAndroid: [
      styles.input,
      styles.textInput,
      textStyle,
      success && styles.success,
      error && styles.error,
    ],
    iconContainer: styles.iconContainer,
    wheel: {
      width: "80%",
      height: 200,
      borderRadius: 10,
     // backgroundColor: "rgba(255, 255, 255, 0.3)",
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
  }), [textStyle, success, error]);

  const pickerIconStyles = {
    marginRight: 10,
  };

  const pickerItems = useMemo(() =>
  options.map(o => ({
    value: o.value,
    label: o.label,
  })),
[options]);


  return (
    <RNPickerSelect
      value={value}
      onValueChange={handleOnSelect}
      items={pickerItems}
      style={pickerStyles}
      useNativeAndroidPickerStyle={false}
      placeholder={{
        label: placeholder ? placeholder : "Select...",
      }}
      Icon={() => (
        <Icon
          name={iconName || "nav-down"}
          family={iconFamily || "ArgonExtra"}
          size={iconSize || 10}
          color={iconColor || argonTheme.COLORS.DEFAULT}
          style={pickerIconStyles}
        />
      )}
      {...props}
    />
  );
};

Select2.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.any,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 200,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // A semi-transparent color
    backdropFilter: "blur(10px)", // Adjust the blur strength as desired
    overflow: "hidden", // Ensure the content is clipped within the container
  },
  text: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    color: "#FFFFFF",
  },
  wheel: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    //backgroundColor: "rgba(255, 255, 255, 0.3)", // Adjust the opacity as desired
    backdropFilter: "blur(10px)", // Adjust the blur strength as desired
  },
  input: {
    borderRadius: 4,
    borderColor: "#cce0ff",//argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    padding: 5,
  },
  textInput: {
    color: "black",
  },
  iconContainer: {
    marginVertical: 10,
    position: "absolute",
    height: "60%",
    right: 2,
    borderLeftWidth: 1,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    borderColor: "#cce0ff",//argonTheme.COLORS.BORDER,
    backgroundColor: "#FFFFFF",
  },
  success: {
    borderColor: "#2DCE89",
  },
  error: {
    borderColor: "#FCB3A4",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#000",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#000",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Select2;
 */
