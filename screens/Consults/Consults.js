import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header.js";
import { Block, Text } from "galio-framework";
const { width, height } = Dimensions.get("screen");
import Icon from "../../components/Icon.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Images } from "../../constants/index.js";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;

const Consults = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return <Header back scrollTittle={false} title={"CONSULTAS"} right blur />;
  };
  return (
    <ImageBackground source={Images.BlueReverse} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
      />
      {renderHeader()}
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            width: width,
            paddingBottom: Iphone ? 80 : 150,
          }}
          enableOnAndroid
          scrollEventThrottle={16}
        >
          <Block
            style={{
              backgroundColor: "white",
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                alignSelf: "flex-start", // Alinea el texto a la izquierda
              }}
            >
              CONSULTAS
            </Text>
          </Block>
          <Block
            style={{
              flexDirection: "row",
              marginTop: 16,
              paddingHorizontal: 16,
              backgroundColor: "white",
              marginBottom: 5,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: "#F2F2F2",
                borderRadius: 15,
                marginRight: 5,
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
              onPress={() => navigation.navigate("Consult Article")}
            >
              <View style={{ height: 50 }}>
                <FontAwesomeIcon
                  icon={"boxes-stacked"}
                  size={50}
                  color="#666666"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#666666",
                  }}
                >
                  Productos
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666666",
                  }}
                >
                  Buscar productos por código, nombre o línea.
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  name={"chevron-right"}
                  family="entypo"
                  size={20}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: "#F2F2F2",
                borderRadius: 15,
                marginRight: 5,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
              onPress={() => navigation.navigate("Consult Customer")}
            >
              <View style={{ height: 50 }}>
                <FontAwesomeIcon
                  icon={"users-line"}
                  size={50}
                  color="#666666"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#666666",
                  }}
                >
                  Clientes
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666666",
                  }}
                >
                  Buscar clientes por código, nombre o nit.
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  name={"chevron-right"}
                  family="entypo"
                  size={20}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
          </Block>
          <Block
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              backgroundColor: "white",
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: "#F2F2F2",
                borderRadius: 15,
                marginRight: 5,
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
              onPress={() => navigation.navigate("Articles Request")}
            >
              <View style={{ height: 50 }}>
                <FontAwesomeIcon icon={"upload"} size={40} color="#666666" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#666666",
                  }}
                >
                  Solicitud de Productos
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666666",
                  }}
                >
                  Ingresar solicitud de productos.
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  name={"chevron-right"}
                  family="entypo"
                  size={20}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: "#F2F2F2",
                borderRadius: 15,
                marginRight: 5,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
              onPress={() => navigation.navigate("Weekly Planning")}
            >
              <View style={{ height: 50 }}>
                <FontAwesomeIcon
                  icon={"calendar-week"}
                  size={40}
                  color="#666666"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#666666",
                  }}
                >
                  Planificación semanal
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666666",
                  }}
                >
                  Crear planificaciones por semana
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  name={"chevron-right"}
                  family="entypo"
                  size={20}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
          </Block>
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  home: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: "white",
  },
});
export default Consults;
