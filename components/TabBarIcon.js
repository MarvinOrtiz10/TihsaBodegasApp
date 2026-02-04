import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";
const TabBarIcon = ({ name, color, focused }) => {
  const iconColor = focused ? "#007AFF" : color;

  return name == "perfil" ? (
    <FontAwesomeIcon
      icon={focused ? faUser : faUserRegular}
      regular
      size={20}
      color={iconColor}
      style={{ fontWeight: "normal" }}
    />
  ) : (
    <FontAwesomeIcon
      icon={name}
      regular
      size={20}
      color={iconColor}
      style={{ fontWeight: "normal" }}
    />
    /*<Ionicons name={name} size={22} color={iconColor} />*/
  );
  /* return <Ionicons name={name} size={22} color={iconColor} />;*/
};
/* name == "home" ? (
    <FontAwesomeIcon
      icon={focused ? faCircleCheck : faCircleCheckRegular}
      regular
      size={22}
      color={"#007AFF"}
      style={{ fontWeight: "normal" }}
    />
  ) : (
    <Ionicons name={name} size={22} color={iconColor} />
  ); */
export default TabBarIcon;
