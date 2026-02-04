import React from "react";
import { Switch, Platform } from "react-native";

import argonTheme from "../constants/Theme";

const Iphone = Platform.OS === "ios" ? true : false;

const MkSwitch = ({ value, ...props }) => {
  // const thumbColor = Platform.OS === 'ios' ? null :
  // Platform.OS === 'android' && value ? argonTheme.COLORS.SWITCH_ON : argonTheme.COLORS.SWITCH_OFF;
  const thumbColor = null;

  return (
    <Switch
      value={value}
      thumbColor={thumbColor}
      ios_backgroundColor={argonTheme.COLORS.SWITCH_OFF}
      trackColor={{
        false: argonTheme.COLORS.SWITCH_OFF,
        true: "#FED30B",
      }}
      {...props}
    />
  );
};

export default MkSwitch;
