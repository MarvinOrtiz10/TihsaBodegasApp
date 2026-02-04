import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Text, Block } from "galio-framework";
import Icon from "./Icon";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const { width, height } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;

const ToastNotification = forwardRef((props, ref) => {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [toastPosition, setToastPosition] = useState("");
  const [paddingTop, setPaddingTop] = useState(0);

  const translateY = useSharedValue(-100);

  useImperativeHandle(ref, () => ({
    show: (position, message, type, paddingTop) => {
      setIsToastVisible(true);
      setToastMessage(message);
      setToastType(type);
      setToastPosition(position);
      if (paddingTop) {
        setPaddingTop(paddingTop);
      }
      translateY.value = withTiming(0, { duration: 1000 }); // Ajustar la duración de la animación
      setTimeout(() => {
        hideToast();
      }, 5000);
    },
  }));

  const hideToast = () => {
    translateY.value = withTiming(-200, { duration: 1000 }, () => {
      runOnJS(setIsToastVisible)(false);
    });
    setTimeout(() => {
      setPaddingTop(0); // Ajustar el paddingTop después de que la animación haya finalizado
    }, 1000); // Ajustar el tiempo de espera para coincidir con la duración de la animación
  };

  const styles = StyleSheet.create({
    toastContainer: {
      flex: 1,
      width: width - 16,
      top: 0,
      position: "absolute",
      zIndex: 9999999999999,
      marginTop: paddingTop,
      marginBottom: 20,
      alignSelf: "center",
    },
    blurContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.25)",
      overflow: "hidden",
      paddingVertical: 20,
      paddingHorizontal: 8,
      borderRadius: 25,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    iconContainer: {
      flex: 1,
      maxWidth: 30,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 25,
      backgroundColor:"white"
    },
    messageContainer: {
      flex: 1,
      marginLeft: 10,
    },
    toastText: {
      color: "#FFFFFF",
      fontSize: 14,
      lineHeight: 20,
      overflow: "hidden",
    },
  });
  const positionStyle = {
    top: toastPosition === "top" ? 0 : undefined,
    bottom: toastPosition === "bottom" ? 0 : undefined,
  };
  let iconToast = "circle-check";
  let iconColor = "";
  if (toastType === "success") {
    iconToast = "circle-check";
    iconColor = "#25D366";
  } else if (toastType === "error") {
    iconToast = "circle-xmark";
    iconColor = "red";
  } else if (toastType === "warning") {
    iconToast = "triangle-exclamation";
    iconColor = "#FED30B";
  } else if (toastType === "info") {
    iconToast = "circle-exclamation";
    iconColor = "#48bfe3";
  }

  const animatedStyle = useAnimatedStyle(() => {
    let translateYValue = 0;

    // Ajustar el valor de translateY según la posición de la notificación
    if (toastPosition === "top") {
      translateYValue = translateY.value; // Deslizar hacia abajo si la posición es top
    } else if (toastPosition === "center") {
      translateYValue = height * 0.4; //translateY.value / 2; // Deslizar hacia abajo si la posición es center
    } else if (toastPosition === "bottom") {
      translateYValue = -translateY.value; // Deslizar hacia arriba si la posición es bottom
    }

    return {
      transform: [{ translateY: translateYValue }],
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent }) => {
        // Verificar si el usuario está deslizando hacia arriba
        if (nativeEvent.translationY < -20) {
          hideToast(); // Ejecutar hideToast si el deslizamiento es hacia arriba
        }
      }}
    >
      <Animated.View
        style={[styles.toastContainer, positionStyle, animatedStyle]}
      >
        {isToastVisible && (
          <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
            <Block style={styles.iconContainer}>
              <FontAwesomeIcon icon={iconToast} size={32} color={iconColor} />
            </Block>
            <Block style={styles.messageContainer}>
              <Text
                color={"white"}
                style={{ fontWeight: "bold", fontSize: 16 }}
              >
                Notificación Tihsa App
              </Text>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </Block>
          </BlurView>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
});

export default ToastNotification;

//Versión 1.0 Estable
/*import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Toast, Text, Block } from "galio-framework";
import Icon from "./Icon";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
const { width, height } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;

const ToastNotification = forwardRef((props, ref) => {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [toastPosition, setToastPosition] = useState("");
  const [paddingTop, setPaddingTop] = useState(0);

  const translateY = useSharedValue(-100);

  useImperativeHandle(ref, () => ({
    show: (position, message, type, paddingTop) => {
      setIsToastVisible(true);
      setToastMessage(message);
      setToastType(type);
      setToastPosition(position);
      if (paddingTop) {
        setPaddingTop(paddingTop);
      }
      translateY.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        hideToast();
      }, 5000);
    },
  }));

  const hideToast = () => {
    translateY.value = withTiming(-100, { duration: 300 }, () => {
      runOnJS(setIsToastVisible)(false);
    });
    setPaddingTop(0);
  };

  const { width, height } = Dimensions.get("screen");

  const styles = StyleSheet.create({
    toastContainer: {
      marginLeft: 10,
      marginRight: 10,
      paddingVertical: 20,
      paddingHorizontal: 0,
      backgroundColor: "rgba(98, 91, 91, 0.9)",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      position: "absolute",
      zIndex: 9999999999999,
      top: paddingTop,
      bottom: toastPosition === "bottom" ? 20 : undefined,
      left: toastPosition === "center" ? 0 : undefined,
      right: toastPosition === "center" ? 0 : undefined,
      justifyContent: "center",
      alignItems: "center",
      height: 80,
      width: width - 20,
      alignSelf: "center",
    },
    iconContainer: {
      maxWidth: 30,
      width: 30,
      aspectRatio: 1,
      //display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    messageContainer: {
      minWidth: isMovil ? "82%" : "90%",
      maxWidth: isMovil ? "83%" : "90%",
      display: "flex",
      marginLeft: 10,
    },
    toastText: {
      color: "#FFFFFF",
      fontSize: 14, // Ajusta el tamaño de fuente según tus preferencias
      lineHeight: 20, // Ajusta la altura de línea según tus preferencias
      overflow: "hidden", // Recorta el texto que se desborda
      //textOverflow: "ellipsis", // Agrega el ellipsis al texto recortado
    },
  });

  let iconToast = "";

  if (toastType === "success") {
    iconToast = "checkmark-circle";
  } else if (toastType === "error") {
    iconToast = "close-circle";
  } else if (toastType === "warning") {
    iconToast = "warning";
  } else if (toastType === "info") {
    iconToast = "information-circle";
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={() => hideToast()}>
      <Animated.View style={[styles.toastContainer, animatedStyle]}>
        {isToastVisible && (
          <Block row style={{ justifyContent: "center", alignItems: "center" }}>
            <Block style={styles.iconContainer}>
              <Icon
                size={32}
                name={iconToast}
                family="Ionicon"
                color="#ffffff"
              />
            </Block>
            <Block style={styles.messageContainer}>
              <Text color="#FFFFFF" style={{ fontWeight: "600", fontSize: 16 }}>
                Notificación Tihsa App
              </Text>
              <Text color="#FFFFFF" numberOfLines={2} style={styles.toastText}>
                {toastMessage}
              </Text>
            </Block>
          </Block>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
});

export default ToastNotification;
*/
