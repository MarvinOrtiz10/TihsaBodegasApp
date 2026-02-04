import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Block, Text } from "galio-framework";
import Icon from "./Icon.js";
const { width, height } = Dimensions.get("screen");
import { Images } from "../constants/index.js";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { clearUser } from "../screens/Features/User/UserSlice.js";
import { clearCustomer } from "../screens/Features/Order/OrderSlice";
import { BlurView } from "expo-blur";
const Iphone = Platform.OS === "ios" ? true : false;
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;

const Header = ({
  back,
  onBackPress,
  scrollTittle,
  scrollNum,
  scrollOffset,
  title,
  right,
  logOut,
  blur,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const marginTopDevice = Iphone ? insets.top : StatusBar.currentHeight + 10;
  const navigation = useNavigation();
  const logoViewRef = useRef(null);
  const notifications = []; //useSelector((state) => state.order.notifications);
  const dispatch = useDispatch();
  const bounceAnimation = () => {
    if (logoViewRef.current) {
      logoViewRef.current.bounce(1500); // 800 es la duración de la animación en milisegundos
    }
  };
  const handdleBack = () => {
    if (onBackPress) {
      onBackPress(); // Execute the provided back press function
    } else {
      navigation.goBack();
    }
  };
  function countObjects(arr) {
    if (typeof arr === "undefined" || arr.length === 0) {
      return 0;
    }
    return arr.length;
  }
  const handleNotification = () => {
    navigation.navigate("HomeStack", {
      screen: "Notifications",
    });
  };
  const handleLogout = () => {
    Alert.alert("¿Desea cerrar su sesión actual? ", ``, [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "destructive",
      },
      {
        text: "Si",
        onPress: () => {
          navigation.navigate("Login");
          setTimeout(() => {
            dispatch(clearUser());
            dispatch(clearCustomer());
          }, 1000);
        },
        style: "default",
      },
    ]);
  };
  function contarNotificacionesNoVistas(notificaciones) {
    // Usa Array.prototype.reduce() para contar las notificaciones con Visto en false.
    return notificaciones.reduce((count, notificacion) => {
      return count + (notificacion.Visto === false ? 1 : 0);
    }, 0);
  }

  const notificationesActivas =
    notifications !== null ? contarNotificacionesNoVistas(notifications) : [];
  const notificationsSize = notificationesActivas > 99 ? 8 : 10;
  return blur ? (
    <BlurView
      intensity={30}
      tint="dark"
      style={[
        styles.header,
        {
          marginTop: marginTopDevice,
          backgroundColor: "transparent",
        },
      ]}
    >
      <Block
        flex
        middle
        style={{
          maxWidth: 50,
          alignItems: "flex-start",
        }}
      >
        {back ? (
          <TouchableOpacity
            onPress={handdleBack}
            style={{
              flexDirection: "row",
              width: 80,
              alignItems: "center",
              //paddingLeft: 8,
            }}
          >
            <Icon
              name={"chevron-left"}
              family="entypo"
              size={isMovil ? 30 : 35}
              color={"white"}
            />
            <Text style={{ marginLeft: -8, fontSize: 10, color: "white" }}>
              Regresar
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={bounceAnimation}
            style={{
              width: 80,
            }}
          >
            <Animatable.View ref={logoViewRef}>
              <Image source={Images.TihsaLogoMini} style={styles.logo} />
            </Animatable.View>
          </TouchableOpacity>
        )}
      </Block>
      <Block
        style={{
          paddingLeft: 20,
          paddingRight: 5,
          flexGrow: 1,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {scrollTittle ? (
          scrollOffset > scrollNum && (
            <Text
              style={[styles.textHeader, { color: blur ? "white" : "black" }]}
            >
              {title.toUpperCase()}{" "}
            </Text>
          )
        ) : (
          <Text
            numberOfLines={2} // Establece el número máximo de líneas
            style={[styles.textHeader, { color: blur ? "white" : "black" }]}
          >
            {title.toUpperCase()} {/* Aplica toUpperCase() al valor de title */}
          </Text>
        )}
      </Block>
      <Block style={{flex: 1, justifyContent:"center", alignItems:"center", maxWidth: 60, flexDirection: "row" }}>
        {right && (
          <>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center", // Centra verticalmente
              }}
              onPress={handleNotification}
            >
              <Icon
                family="ArgonExtra"
                size={isMovil ? 20 : 24}
                name="bell"
                color={blur ? "white" : "black"}
              />
              {notificationesActivas > 0 && (
                <Block middle style={styles.notify}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: notificationsSize,
                      fontWeight: "bold",
                    }}
                  >
                    {notificationesActivas > 99 ? "99+" : notificationesActivas}
                  </Text>
                </Block>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: isMovil ? 30 : 35,
                width: isMovil ? 30 : 35,
                alignItems: "center",
                justifyContent: "center", // Centra verticalmente
              }}
              onPress={() => handleLogout()}
            >
              <FontAwesomeIcon
                icon={"power-off"}
                size={isMovil ? 20 : 24}
                color="white"
              />
              <Block
                middle
                style={{
                  height: 20,
                  width: 25,
                  position: "absolute",
                  top: isMovil ? -11 : -13,
                  right: isMovil ? 2 : 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: isMovil ? 6 : 9,
                    fontWeight: "bold",
                  }}
                >
                  Salir
                </Text>
              </Block>
            </TouchableOpacity>
          </>
        )}
      </Block>
    </BlurView>
  ) : (
    <Block
      style={[
        styles.header,
        {
          marginTop: marginTopDevice,
          backgroundColor: blur ? "transparent" : "white",
        },
      ]}
    >
      <Block
        style={{
          flex: 1,
          justifyContent: "center",
          maxWidth: 80,
          alignItems: "flex-start",
        }}
      >
        {back ? (
          <TouchableOpacity
            onPress={handdleBack}
            style={{
              flexDirection: "row",
              width: 80,
              alignItems: "center",
              //paddingLeft: 8,
            }}
          >
            <Icon
              name={"chevron-left"}
              family="entypo"
              size={isMovil ? 30 : 35}
            />
            <Text style={{ marginLeft: -8, fontSize: 10 }}>Regresar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={bounceAnimation}
            style={{
              width: 60,
            }}
          >
            <Animatable.View ref={logoViewRef}>
              <Image source={Images.TihsaLogoMini} style={styles.logo} />
            </Animatable.View>
          </TouchableOpacity>
        )}
      </Block>
      <Block
        style={{
          paddingLeft: 20,
          paddingRight: 5,
          flexGrow: 1,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {scrollTittle ? (
          scrollOffset > scrollNum && (
            <Text style={styles.textHeader}>{title.toUpperCase()} </Text>
          )
        ) : (
          <Text
            numberOfLines={2} // Establece el número máximo de líneas
            style={styles.textHeader}
          >
            {title.toUpperCase()} {/* Aplica toUpperCase() al valor de title */}
          </Text>
        )}
      </Block>
      <Block style={{flex: 1, justifyContent:"center", alignItems:"center", maxWidth: 90, flexDirection: "row" }}>
        {right && (
          <>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center", // Centra verticalmente
              }}
              onPress={handleNotification}
            >
              <Icon
                family="ArgonExtra"
                size={isMovil ? 20 : 24}
                name="bell"
                color={"black"}
              />
              {notificationesActivas > 0 && (
                <Block middle style={styles.notify}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: notificationsSize,
                      fontWeight: "bold",
                    }}
                  >
                    {notificationesActivas > 99 ? "99+" : notificationesActivas}
                  </Text>
                </Block>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                height: 30,
                width: 40,
                alignItems: "center",
                justifyContent: "center", // Centra verticalmente
              }}
              onPress={handdleCart}
            >
              <Ionicons
                name={"cart"}
                size={isMovil ? 26 : 30}
                color={"black"}
              />

              {cartItems > 0 && ( // Show notification circle only if items is greater than 0
                <Block middle style={styles.cartNotify}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {cartItems}
                  </Text>
                </Block>
              )}
                  </TouchableOpacity>*/}
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center", // Centra verticalmente
              }}
              onPress={() => handleLogout()}
            >
              <FontAwesomeIcon
                icon={"power-off"}
                size={isMovil ? 20 : 24}
                color="black"
              />
              <Block
                middle
                style={{
                  height: 18,
                  width: 18,
                  position: "absolute",
                  top: isMovil ? -10 : -11,
                  right: isMovil ? 6 : 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: isMovil ? 6 : 9,
                    fontWeight: "bold",
                  }}
                >
                  Salir
                </Text>
              </Block>
            </TouchableOpacity>
            {/*logOut && (
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center", // Centra verticalmente
                }}
                onPress={() => handleLogout()}
              >
                <FontAwesomeIcon
                  icon={"power-off"}
                  size={isMovil ? 20 : 24}
                  color="black"
                />
                <Block
                  middle
                  style={{
                    height: 18,
                    width: 18,
                    position: "absolute",
                    top: isMovil ? -10 : -11,
                    right: isMovil ? 6 : 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: isMovil ? 6 : 9,
                      fontWeight: "bold",
                    }}
                  >
                    Salir
                  </Text>
                </Block>
              </TouchableOpacity>
            )*/}
          </>
        )}
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  header: {
    flexGrow: 1,
    height: isMovil ? 50 : 50,
    maxHeight: isMovil ? 50 : 50,
    flexDirection: "row",
    width: width,
    paddingLeft: 0,
    paddingRight: 10,
    //marginTop: //Iphone ? 50 : 10,
  },
  textHeader: {
    fontSize: isMovil ? 14 : 16,
    fontWeight: "bold",
    textTransform: "uppercase", // Agrega esta línea para convertir el texto en mayúsculas
    textAlign: "center", // Centra el texto horizontalmente
    paddingLeft: 0,
    paddingRight: 0,
  },
  button: {
    padding: 12,
    position: "relative",
  },
  notify: {
    borderRadius: 4,
    right: -2,
    height: 18,
    width: 18,
    position: "absolute",
    top: isMovil ? -10 : -12,
    borderRadius: 10,
    //backgroundColor: "#F23A50",
    backgroundColor: "#ff3040",
    justifyContent: "center",
    alignItems: "center",
  },
  cartNotify: {
    //backgroundColor: "#F23A50",
    backgroundColor: "#ff3040",
    borderRadius: 25,
    height: 18,
    width: 18,
    position: "absolute",
    top: -10,
    right: isMovil ? 2 : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginLeft: 10,
    zIndex: 3,
    width: isMovil ? 30 : 30,
    height: isMovil ? 30 : 30,
    padding: 5,
  },
});
export default Header;
