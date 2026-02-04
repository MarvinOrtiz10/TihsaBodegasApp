/*
 Módulo de countDown Versión Estable 1.1 
 Created by: Ing Ortiz.
 last updated: 10-10-2023
 All rights reserved. © 2023
*/
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;

const CountdownApp = ({
  targetDate,
  title,
  horizontal,
  imageBackground,
  backgroundColor,
  textColor,
  boxTextColor,
  boxBackgroundColor,
  textSize,
}) => {
  const [countdown, setCountdown] = useState(calculateCountdown(targetDate));
  const [isVisible, setIsVisible] = useState(true);

  // Función para detener el contador y ocultar el componente
  const stopCountdown = () => {
    setCountdown(0);
    setIsVisible(false);
  };

  useEffect(() => {
    // Configuramos un temporizador para actualizar el contador cada segundo
    const timer = setInterval(() => {
      const remainingTime = calculateCountdown(targetDate);
      setCountdown(remainingTime);

      // Si el tiempo restante es menor o igual a 0, detenemos el temporizador y ocultamos el componente
      if (remainingTime <= 0) {
        clearInterval(timer);
        setIsVisible(false);
      }
    }, 1000);

    // Devolvemos una función de limpieza para detener el temporizador cuando el componente se desmonta
    return () => {
      clearInterval(timer);
    };
  }, [targetDate]);

  // Función para calcular el tiempo restante en segundos
  function calculateCountdown(targetDate) {
    const currentTime = new Date().getTime() / 1000;
    const targetTime = targetDate.getTime() / 1000;
    return Math.max(0, targetTime - currentTime);
  }

  // Función para formatear el tiempo restante en días, horas, minutos y segundos
  const formatTime = () => {
    const days = Math.floor(countdown / (3600 * 24));
    const hours = Math.floor((countdown % (3600 * 24)) / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = Math.floor(countdown % 60);

    // Función auxiliar para agregar un cero delante de valores menores a 10
    const formatValue = (value) => {
      return value < 10 ? `0${value}` : `${value}`;
    };

    return {
      days: formatValue(days),
      hours: formatValue(hours),
      minutes: formatValue(minutes),
      seconds: formatValue(seconds),
    };
  };

  const { days, hours, minutes, seconds } = formatTime();
  const backgroundColorCustom = backgroundColor ? backgroundColor : "#F2F2F2";

  // Diseño del countdown para los colores de texto y fondo
  const stylesCustom = StyleSheet.create({
    container: {
      width: width - 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      paddingVertical: isMovil ? 5 : 20,
      backgroundColor: backgroundColorCustom,
      marginBottom: 5,
    },
    horizontalContainer: { flexDirection: "row" },
    textHorizontal: {
      fontSize: textSize - 8,
      fontWeight: "bold",
      textTransform: "uppercase", // Hace que el texto sea en mayúscula
      color: textColor,
    },
    textVertical: {
      fontSize: textSize,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: textColor,
      textAlign: "center", // Centra el texto horizontalmente
    },
    textHorizontalContainer: {
      flex: 1,
    },
    textContainer: {
      width: isMovil ? width * 0.3 : width * 0.5,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    countdownContainer: {
      flexDirection: "row",
      flex: 1,
    },
    timeContainer: {
      justifyContent: "center",
      alignItems: "center",
    },

    timeBox: {
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 5,
      padding: 5,
      backgroundColor: boxBackgroundColor, // Color de fondo del cuadro
      borderRadius: 10, // Bordes redondeados
    },
    time: {
      fontSize: 24,
      fontWeight: "bold",
      color: boxTextColor, // Color del texto
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: boxTextColor, // Color del texto
    },
    separator: {
      fontSize: 24,
      fontWeight: "bold",
      color: "black", // Color del separador
    },
  });

  // Diseños según las props que recibe el componente
  const textStylesContainer = horizontal
    ? stylesCustom.textContainer
    : stylesCustom.textHorizontalContainer;
  const textHorizontal = horizontal
    ? stylesCustom.textHorizontal
    : stylesCustom.textVertical;
  const horizontalStylesContainer =
    horizontal && stylesCustom.horizontalContainer;
  const imageContainer = imageBackground || false;

  return (
    <>
      {isVisible &&
        (imageContainer ? (
          <ImageBackground
            source={{ uri: imageContainer }}
            resizeMode="cover"
            style={[stylesCustom.container, horizontalStylesContainer]}
          >
            <View style={textStylesContainer}>
              <Text style={textHorizontal}>{title}</Text>
            </View>
            <View style={stylesCustom.countdownContainer}>
              {parseInt(days) > 0 && (
                <View style={stylesCustom.timeContainer}>
                  <View style={stylesCustom.timeBox}>
                    <Text style={stylesCustom.time}>{days}</Text>
                  </View>
                  <Text style={stylesCustom.label}>Días</Text>
                </View>
              )}
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{hours}</Text>
                </View>
                <Text style={stylesCustom.label}>Horas</Text>
              </View>
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{minutes}</Text>
                </View>
                <Text style={stylesCustom.label}>Minutos</Text>
              </View>
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{seconds}</Text>
                </View>
                <Text style={stylesCustom.label}>Segundos</Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          // Agregamos una condición para renderizar o no el componente
          <View style={[stylesCustom.container, horizontalStylesContainer]}>
            <View style={textStylesContainer}>
              <Text style={textHorizontal}>{title}</Text>
            </View>
            <View style={stylesCustom.countdownContainer}>
              {parseInt(days) > 0 && (
                <View style={stylesCustom.timeContainer}>
                  <View style={stylesCustom.timeBox}>
                    <Text style={stylesCustom.time}>{days}</Text>
                  </View>
                  <Text style={stylesCustom.label}>Días</Text>
                </View>
              )}
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{hours}</Text>
                </View>
                <Text style={stylesCustom.label}>Horas</Text>
              </View>
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{minutes}</Text>
                </View>
                <Text style={stylesCustom.label}>Minutos</Text>
              </View>
              <View style={stylesCustom.timeContainer}>
                <View style={stylesCustom.timeBox}>
                  <Text style={stylesCustom.time}>{seconds}</Text>
                </View>
                <Text style={stylesCustom.label}>Segundos</Text>
              </View>
            </View>
          </View>
        ))}
    </>
  );
};

export default CountdownApp;
