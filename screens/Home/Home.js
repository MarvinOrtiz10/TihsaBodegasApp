import React, { useState, useEffect, useRef } from "react";
import { Block, Text, theme } from "galio-framework";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header.js";
const { width, height } = Dimensions.get("screen");
//import Carousel, { Pagination } from "react-native-snap-carousel";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ToastNotification from "../../components/ToastNotification.js";
import { Images } from "../../constants/index.js";
import { BlurView } from "expo-blur";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Modals from "../../components/Modals.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  faBan,
  faBoxesPacking,
  faCashRegister,
  faDolly,
  faDollyBox,
  faDollyFlatbed,
  faGears,
  faMagnifyingGlass,
  faMagnifyingGlassLocation,
  faMobileRetro,
  faMobileScreen,
  faMoneyBillTransfer,
  faPeopleCarryBox,
  faReceipt,
  faTruckFast,
  faTruckRampBox,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import { AppVersion } from "../../settings/AppSettings.js";

const cardWidth = width - 60;
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = Math.min(width, height) < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;

const thumbMeasure = (width - 48 - 32) / 3;
const columns = isMovil ? 2 : 4;
const BACKGROUND_KEY = "app_background";
const paddingTopNotification = Iphone ? 55 : 40;
const Version = AppVersion.Version;

const Home = () => {
  const { width: currentWidth, height: currentHeight } = useWindowDimensions();
  const isLandscape = currentWidth > currentHeight;
  const navigation = useNavigation();
  const userState = useSelector((state) => state.user);
  const toastRef = useRef(null);
  const nombre = userState[0].Nombre;
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );

  const loadBackground = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem(BACKGROUND_KEY);
      if (savedBackground && Images[savedBackground]) {
        setBackgroundImage(Images[savedBackground]); // Asignar imagen al estado
      }
    } catch (error) {
      console.error("Error cargando el background:", error);
    }
  };

  // Cargar el background guardado al iniciar la app
  useEffect(() => {
    console.log("Medida de pantalla: ", width, height);
    loadBackground();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Lógica para cargar la información de los pedidos al recibir el foco
      loadBackground();
    });

    // Lógica para limpiar cualquier suscripción o recurso si es necesario
    return unsubscribe;
  }, [navigation]); // Se ejecuta cada vez que el componente recibe el foco
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const renderHeader = () => {
    return (
      <Header
        back={false}
        scrollTittle={false}
        title={"INICIO"}
        right
        logOut
        blur={true}
      />
    );
  };
  const menuItems = [
    {
      title: "Picking",
      subtitle: "Recolección de pedidos",
      icon: faPeopleCarryBox,
      color: "#2ab1e6",
      bgColor: "#e9f9ff",
      onPress: () => navigation.navigate("Orders Picking"),
      show: true,
    },
    {
      title: "Packing",
      subtitle: "Packing list de pedidos.",
      icon: faBoxesPacking,
      color: "#84c184",
      bgColor: "#e9f9e9",
      onPress: () => navigation.navigate("Orders Packing"),
      show: true,
    },
    {
      title: "Ubicaciones Artículos",
      subtitle: "Visualiza ó cambia ubicaciones",
      icon: faMagnifyingGlassLocation,
      color: "#0077b6",
      bgColor: "#DBEAFE",
      onPress: () => navigation.navigate("Location Articles"),
      show: true,
    },

    {
      title: "Guías de Guatex",
      subtitle: "Crea, edita e imprime guías de Guatex",
      icon: faTruckFast,
      //color: "#0077b6",
      //bgColor: "#DBEAFE",
      color: "#5eaaa8",
      bgColor: "#e6f9f8",
      onPress: () => {
        notificar(
          "top",
          "Opción estará disponible próximamente",
          "info",
          paddingTopNotification,
        );
      },
      show: true,
    },

    {
      title: "Requisiciones de bodega",
      subtitle: "Picking, packing y envío de requisiciones",
      icon: faDolly,
      color: "#ff8f44", //"#f4a261",
      bgColor: "#fef6e6",
      onPress: () => navigation.navigate("Requisitions"),
      show: true,
    },

    {
      title: "Recepción de requisiciones",
      subtitle: "Recepción y carga de requisiciones",
      icon: faTruckRampBox,
      //color: "#ff8f44", //"#f4a261",
      //bgColor: "#fef6e6",
      color: "#ff6f61",
      bgColor: "#ffe6e1",
      onPress: () => navigation.navigate("Receive Requisitions"),
      show: true,
    },
  ];
  const menuItems2 = [
    {
      title: "Cuadre de caja",
      subtitle: "Proceso para cuadre de caja diario",
      icon: faCashRegister,
      color: "#5eaaa8",
      bgColor: "#e6f9f8",
      onPress: () => {
        console.log("Opción");
      },
      show: false,
    },

    {
      title: "POS BAC",
      subtitle: "Reimprimir, anulación y cierre.",
      icon: faMobileScreen,
      color: "#ff6f61",
      bgColor: "#ffe6e1",
      onPress: () => {
        console.log("Opción");
      },
      show: false,
    },

    {
      title: "POS NEONET",
      subtitle: "Reimprimir, anulación, cierre y resumen.",
      icon: faMobileRetro,
      color: "#707bff",
      bgColor: "#eff0ff",
      onPress: () => {
        console.log("Opción");
      },
      show: false,
    },
    /*{
      title: "Caja registradora",
      subtitle: "Realiza la prueba de abrir la caja registradora",
      icon: faMoneyBillTransfer,
      color: "#5eaaa8",
      bgColor: "#e6f9f8",
      onPress: () => reimprimirFacturas(), //() => navigation.navigate("Metas FerretExpo"),
      show: superAdmin,
    },*/
    {
      title: "Configuraciones",
      subtitle: "Configuración de la app.",
      icon: faGears,

      color: "#0d47a1",
      bgColor: "#e3f2fd",
      onPress: () => navigation.navigate("App Settings"),
      show: false,
    },
  ];
  return (
    <ImageBackground source={backgroundImage} style={styles.home}>
      <StatusBar
        animated={true}
        barStyle="default"
        hidden={false}
        backgroundColor={"transparent"}
      />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingVertical: isMovil ? (isLandscape ? 4 : 16) : 16,
            flexGrow: 1,
          }}
        >
          <BlurView intensity={40} tint="dark" style={styles.profileCard}>
            <Block style={styles.avatarContainer}>
              <Image
                source={Images.Customer}
                style={[
                  styles.avatar,
                  {
                    width: isMovil ? (isLandscape ? 60 : 100) : 125,
                    height: isMovil ? (isLandscape ? 60 : 100) : 125,
                  },
                ]}
                resizeMode="contain"
              />
            </Block>
            <View style={{ flex: 1 }}>
              <BlurView
                intensity={50}
                tint="light"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: isMovil ? (isLandscape ? 4 : 4) : 8,
                  padding: isMovil ? (isLandscape ? 4 : 4) : 8,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    fontSize: isMovil ? (isLandscape ? 16 : 20) : 24,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {nombre}
                </Text>
              </BlurView>
              <BlurView
                intensity={50}
                tint="light"
                style={{
                  flex: 1,
                  marginTop: isMovil ? (isLandscape ? 4 : 4) : 8,
                  padding: isMovil ? (isLandscape ? 4 : 4) : 8,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: isMovil ? (isLandscape ? 0 : 0) : 4,
                  }}
                >
                  {menuItems
                    .filter((item) => item.show) // Filtra solo los elementos con show en true
                    .map((item, index) => {
                      const dynamicColumns = isMovil
                        ? isLandscape
                          ? 3
                          : 2
                        : 4;
                      const btnHeight = isMovil
                        ? isLandscape
                          ? 105
                          : 150
                        : 130;
                      const iconSize = isMovil ? (isLandscape ? 24 : 28) : 35;
                      const titleSize = isMovil ? (isLandscape ? 14 : 16) : 16;
                      const subtitleSize = isMovil
                        ? isLandscape
                          ? 11
                          : 12
                        : 12;

                      return (
                        <View
                          key={index}
                          style={{
                            width: `${100 / dynamicColumns}%`,
                            height: btnHeight,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              padding: isMovil ? (isLandscape ? 16 : 12) : 16,
                              backgroundColor: item.bgColor,
                              borderRadius: 15,
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              margin: 5,
                            }}
                            onPress={item.onPress}
                          >
                            <View style={{ height: iconSize + 5 }}>
                              <FontAwesomeIcon
                                icon={item.icon}
                                size={iconSize}
                                color={item.color}
                              />
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: titleSize,
                                  fontWeight: "bold",
                                  color: item.color,
                                }}
                              >
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: subtitleSize,
                                  color: item.color,
                                }}
                              >
                                {item.subtitle}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              </BlurView>
            </View>
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={{ color: "white", fontSize: 14 }}>
                App Versión {Version}
              </Text>
            </View>
          </BlurView>
        </ScrollView>
      </View>
      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  home: {
    height: "100%",
    width: "100%",
    //backgroundColor: "#FED30B",
    backgroundColor: "white",
  },
  label: {
    marginBottom: -3,
    fontSize: 14,
  },
  selectLabel: {
    marginBottom: 0,
    fontSize: 14,
  },
  requiredSelect: { marginTop: 5, fontSize: 10, color: "red" },

  required: {
    marginTop: -8,
    fontSize: 10,
    color: "red",
  },

  profileCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 15,
    overflow: "hidden",
    borderRadius: 15,
  },

  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    //marginTop: -80,
    zIndex: 999,
    alignItems: "center",
  },
  avatar: {
    width: isMovil ? 100 : 150,
    height: isMovil ? 100 : 150,
    borderRadius: 100,
    borderWidth: isMovil ? 6 : 8,
    borderColor: "white",
  },
  button: {
    padding: 8,
  },
  nameInfo: {},

  thumb: {
    borderRadius: 4,
    margin: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
});

export default Home;
