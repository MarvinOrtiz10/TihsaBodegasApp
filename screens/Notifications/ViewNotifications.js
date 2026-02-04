import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Block, Text } from "galio-framework";
import Header from "../../components/Header.js";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import { Notifications } from "../../settings/EndPoints.js";
import useAxiosInstance from "../../settings/AxiosConfig.js";
import { Images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
const isMovil = width < 650 ? true : false;
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FlashList } from "@shopify/flash-list";
import { useRoute } from "@react-navigation/native";

const ViewNotifications = () => {
  const axiosInstance = useAxiosInstance();
  const navigation = useNavigation();
  const route = useRoute();
  const { idNotification } = route.params;
  const baseUrlNotifications = Notifications.EndPoint;
  const userState = useSelector((state) => state.user);
  const CodigoCliente = userState[0].CodigoCliente;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [notificationImage, setNotificationImage] = useState("");
  const ImageSizeWidth = isMovil ? width * 0.85 : width * 0.9;
  const ImageSizeHeight = isMovil ? width * 0.85 : width * 0.9;
  const [iconNotification, setIconNotification] = useState("");
  const [colorIcon, setColorIcon] = useState("");

  useEffect(() => {
    /*Primero se realiza el put para modificar el estado de la notificación a visto y luego de la respuesta se llenan los campos */
    var data = {
      CodigoCliente: CodigoCliente.toString(),
      IdNotificacion: idNotification,
      Visto: true,
    };
    axiosInstance({
      method: "put",
      url: `${baseUrlNotifications}`,
      headers: { "content-type": "text/json" },
      data: data,
    })
      .then((response) => {
        var respuesta = response.data;
        var respuesta2 = [respuesta.Data];
        respuesta2.map((item) => {
          setTitle(item.Titulo);
          setDescription(item.Subtitulo);
          setNotificationImage(item.Url);
          setDate(calcularTiempoPasado(item.FechaRegistro));
          if (item.TipoNotificacion == 0) {
            setIconNotification("circle-check");
            setColorIcon("#2DCE89");
          } else if (item.TipoNotificacion == 1) {
            setIconNotification("circle-xmark");
            setColorIcon("#F5365C");
          } else if (item.TipoNotificacion == 2) {
            setIconNotification("triangle-exclamation");
            setColorIcon("#FB6340");
          } else if (item.TipoNotificacion == 3) {
            setIconNotification("circle-exclamation");
            setColorIcon("#11CDEF");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderHeader = () => {
    return (
      <Header
        back={true}
        scrollTittle={false}
        scrollNum={23}
        title={"Ver Notificación"}
      />
    );
  };
  function calcularTiempoPasado(fecha) {
    const fechaActual = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferenciaEnMilisegundos = fechaActual - fechaPublicacion;

    // Calcular el tiempo transcurrido en segundos, minutos, horas o días
    const segundos = Math.floor(diferenciaEnMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `hace ${dias} día${dias > 1 ? "s" : ""}`;
    } else if (horas > 0) {
      return `hace ${horas} hora${horas > 1 ? "s" : ""}`;
    } else if (minutos > 0) {
      return `hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    } else {
      return `hace unos segundos`;
    }
  }

  return (
    <Block style={styles.home}>
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, width }}
      >
        <>
          <Block style={styles.notificationContainer}>
            <View style={styles.notificationHeader}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "aliceblue",
                  borderRadius: 50, // Para hacerlo redondeado, mitad del ancho/alto
                  marginRight: 10, // Espacio entre el avatar y el texto
                  justifyContent: "center", // Centra verticalmente
                  alignItems: "center", // Centra horizontalmente
                }}
              >
                <Image
                  source={Images.TihsaLogoMini}
                  style={{ width: 40, height: 40 }}
                />
                {iconNotification && (
                  <View style={[styles.NotificationIconBtn]}>
                    <FontAwesomeIcon
                      icon={iconNotification}
                      size={isMovil ? 12 : 16}
                      color={colorIcon}
                    />
                  </View>
                )}
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.notificationTitle}>{title}</Text>
                <Text style={styles.notificationTime}>{date}</Text>
              </View>
            </View>
            {notificationImage && (
              <View style={styles.notificationImage}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: notificationImage }}
                    resizeMode="contain" // Ajusta la imagen al contenedor sin cortarla
                    style={{
                      width: ImageSizeWidth,
                      height: ImageSizeHeight,
                      borderRadius: 5,
                    }} // Establece un valor de ancho y alto predeterminado
                  />
                </View>
              </View>
            )}
            <View style={styles.notificationDescription}>
              <View style={styles.descriptionContainer}>
                <Text style={{ fontSize: 16 }}>{description}</Text>
              </View>
            </View>
          </Block>
        </>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: "white",
  },
  notificationList: {
    backgroundColor: "aliceblue",
    //paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 15,
    paddingVertical: 16,
    shadowColor: "rgba(255, 255, 255, 0.2)", // Color de sombra translúcida
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  notificationContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 8,
    borderColor: "#F2F2F2",
  },
  notificationItemView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "rgba(255, 255, 255, 0.2)", // Color de sombra translúcida
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  notificationHeader: {
    flexDirection: "row",
    //alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: "rgba(255, 255, 255, 0.2)", // Color de sombra translúcida
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  notificationImage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: 16,
    paddingRight: 16,
    shadowColor: "rgba(255, 255, 255, 0.2)", // Color de sombra translúcida
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  imageContainer: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "aliceblue",
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
  notificationDescription: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    shadowColor: "rgba(255, 255, 255, 0.2)", // Color de sombra translúcida
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  descriptionContainer: {
    flex: 1,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    backgroundColor: "aliceblue",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  NotificationIconBtn: {
    position: "absolute",
    bottom: 0,
    right: -5,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    width: 20,
    height: 20,
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    zIndex: 999,
  },
  notificationTitle: {
    color: "black",
    fontSize: isMovil ? 16 : 20,
    fontWeight: "bold",
  },
  notificationTime: {
    color: "grey",
  },
  floatingButton: {
    alignItems: "center",
    width: width - 40,
    backgroundColor: "rgba(29, 161, 242, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  settingList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderBottomColor: "grey",
    paddingVertical: 16,
  },
  button: {
    padding: 12,
    position: "relative",
  },
  cartText: {
    color: "white",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    fontWeight: "bold",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ViewNotifications;
