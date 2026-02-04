import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const AnimatedText = ({ title }) => {
  const textRef = useRef(null);
  const textWidth = useRef(new Animated.Value(0)).current;
  const textDuration = 5000; // Duración de la animación en milisegundos

  useEffect(() => {
    if (textRef.current) {
      textWidth.setValue(0);
      Animated.timing(textWidth, {
        toValue: textRef.current.offsetWidth,
        duration: textDuration,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  return (
    <View style={styles.textContainer}>
      <Animated.View ref={textRef} style={[styles.text, { width: textWidth }]}>
        <Text
          style={[
            styles.textContent,
            {
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "uppercase",
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  text: {
    flexDirection: "row",
    overflow: "hidden",
  },
  textContent: {
    flexShrink: 1,
  },
});

export default AnimatedText;
