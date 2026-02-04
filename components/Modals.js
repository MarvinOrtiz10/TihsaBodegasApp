import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useRef, useEffect } from "react";
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
const Iphone = Platform.OS === "ios" ? true : false;

const Modals = ({
  visible,
  onClose,
  children,
  renderFooter,
  width = "60%",
  height = "60%",
  hideHeader = false,
  hideFooter = false,
  fullScreen = false,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim, height: fullScreen ? screenHeight : Iphone ? screenHeight : screenHeight * 0.94, }]}>
      <View style={[styles.modalContent, { width, height }]}>
        {!hideHeader && (
          <View style={[styles.modalHeader, { height: "10%" }]}>
            <View style={{ width: "33%" }}></View>
            <View style={{ width: "33%", alignItems: "center" }}>
              <View style={styles.line}></View>
            </View>
            <TouchableOpacity
              style={[styles.circleCloseButton, styles.elementoDerecha]}
              onPress={onClose}
            >
              <FontAwesomeIcon icon={"xmark"} size={18} color={"#666666"} />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[
            styles.modalBody,
            {
              height:
                hideHeader && hideFooter
                  ? "100%"
                  : hideHeader
                  ? "90%"
                  : hideFooter
                  ? "80%"
                  : "80%",
            },
          ]}
        >
          {children}
        </View>

        {!hideFooter && (
          <View style={[styles.modalFooter, { height: "10%" }]}>
            {renderFooter}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth,
    //height: Iphone ? screenHeight : screenHeight * 0.94,
    padding: 5,
    paddingBottom: 10,
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#F2F2F2",
  },
  modalBody: {
    flex: 1,
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  modalFooter: {
    borderTopWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor:"white"
  },
  circleCloseButton: {
    backgroundColor: "#E5E5E5",
    padding: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "40%",
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
  },
  elementoDerecha: {
    marginLeft: "auto",
  },
});

export default Modals;
