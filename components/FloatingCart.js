// FloatingCartButton.js
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Dimensions,
  View,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Block } from "galio-framework";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("screen");

const FloatingCartButton = ({ navigation }) => {
  const cartState = []; //useSelector((state) => state.order.cartItems);
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    let animationValue = 0;

    if (shouldShowButton) {
      const animatedLoop = Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animatedLoop.start();
      animationValue = 1;

      // Limpia la animación cuando el componente se desmonta o shouldShowButton cambia
      return () => {
        animatedLoop.stop();
        animation.setValue(0);
      };
    }

    // Detener la animación cuando el botón no se muestra
    animation.setValue(animationValue);
  }, [shouldShowButton]);
  const handleOnPressCart = () => {
    navigation.navigate("CartStack", {
      screen: "Cart",
    });
  };

  const shouldShowButton = cartState.length > 0;
  const cartItems = cartState.length;
  const animatedStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 10, 0],
        }),
      },
    ],
  };
  return (
    shouldShowButton && (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleOnPressCart}
        >
          <Block>
            <Text style={styles.buttonHeaderText}>Ver el carrito</Text>
            <Text style={styles.buttonText}>
              Tienes {cartItems}{" "}
              {cartItems > 1 ? "artículos agregados" : "artículo agregado"}
            </Text>
          </Block>
          <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <Icon
              name="chevron-right"
              size={20}
              color="#555555"
              style={styles.icon}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 5,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
  floatingButton: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 32,
    height: 80,
    borderRadius: 25,
    backgroundColor: "rgba(254, 211, 11, 1)",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
  },
  buttonHeaderText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#555555",
  },
  buttonText: {
    color: "white",
    marginRight: 14,
  },
  icon: {
    marginLeft: 5,
  },
  iconContainer: {
    marginLeft: "auto",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.32,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    border: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backdropFilter: "blur(7.5px)",
    WebkitBackdropFilter: "blur(7.5px)",
  },
});

export default FloatingCartButton;
