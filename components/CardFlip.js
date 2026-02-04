import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
const { width, height } = Dimensions.get("screen");
const Iphone = Platform.OS === "ios";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;

const CardFlip = ({ front, back }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);

    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
  });

  const frontAnimatedStyle = {
    transform: [
      { rotateY: frontInterpolate },
      { scaleX: Iphone ? 1 : isFlipped ? 0 : 1 },
    ],
  };
  const backAnimatedStyle = {
    transform: [
      { rotateY: backInterpolate },
      { scaleX: Iphone ? -1 : isFlipped ? 1 : 0 }, // Invertir horizontalmente solo cuando el reverso esté visible
    ],
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { perspective: 1000 },
                {
                  rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            {front}
          </Animated.View>
          <Animated.View
            style={[styles.card, styles.cardBack, backAnimatedStyle]}
          >
            {back}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1, // Hacer que el contenedor de la tarjeta sea flexible
    width: "100%", // Ajustar al ancho completo
    aspectRatio: 1, // Mantener una relación de aspecto cuadrada
    maxWidth: isMovil ? 300 : 350, // Ancho máximo para limitar el tamaño si es necesario
    maxHeight: isMovil ? 300 : 350, // Alto máximo para limitar el tamaño si es necesario
    perspective: 1000,
  },
  card: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    //backgroundColor: "transparent",
    transform: [{ rotateY: "180deg" }],
  },
});

export default CardFlip;

/* Versión 1.0 funciona pero no correctamente el flip es raro

import React, { useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

const CardFlip = ({ front, back }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);

    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                {
                  perspective: 1000,
                },
                {
                  rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            {front}
          </Animated.View>
          <Animated.View
            style={[styles.card, styles.cardBack, backAnimatedStyle]}
          >
            {back}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1, // Hacer que el contenedor de la tarjeta sea flexible
    width: "100%", // Ajustar al ancho completo
    aspectRatio: 1, // Mantener una relación de aspecto cuadrada
    maxWidth: 300, // Ancho máximo para limitar el tamaño si es necesario
    maxHeight: 300, // Alto máximo para limitar el tamaño si es necesario
    perspective: 1000,
  },
  card: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  cardFront: {
    backgroundColor: "transparent",
  },
  cardBack: {
    backgroundColor: "transparent",
    transform: [{ rotateY: "180deg" }],
  },
});

export default CardFlip;
*/
