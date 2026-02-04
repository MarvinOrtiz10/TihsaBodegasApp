import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
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
const isMovil = width < 650 ? true : false;
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { addNotificationsCustomer } from "../Features/Order/OrderSlice.js";

const NotificationsCustomer = () => {
  const axiosInstance = useAxiosInstance();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const baseUrlNotifications = Notifications.EndPoint;
  const userState = useSelector((state) => state.user);
  const isLogged = userState.length !== 0 ? true : false;
  const CodigoCliente = userState[0].CodigoCliente;
  const CodEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const [notifications, setNotifications] = useState([]);
  const [notificationsHoy, setNotificationsHoy] = useState([]);
  const [notificationsEstaSemana, setNotificationsEstaSemana] = useState([]);
  const [notificationsAnteriores, setNotificationsAnteriores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLogged) {
      axiosInstance
        .get(`${baseUrlNotifications}/${CodEmp}/${CodigoCliente}`)
        .then((response) => {
          const dataApi = response.data;
          setNotifications(categorizarNotificaciones(dataApi.Data));
          dispatch(addNotificationsCustomer(dataApi.Data));
        })
        .catch((error) => console.log(error));
    }
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    axiosInstance
      .get(`${baseUrlNotifications}/${CodEmp}/${CodigoCliente}`)
      .then((response) => {
        const dataApi = response.data;
        setNotifications(categorizarNotificaciones(dataApi.Data));
        dispatch(addNotificationsCustomer(dataApi.Data));
      })
      .catch((error) => console.log(error));
    setRefreshing(false);
  };
  const NotificationItem = ({ notification }) => {
    const fechaTexto = calcularTiempoPasado(notification.FechaRegistro);
    const backgroundC = notification.Visto
      ? styles.notificationItemView
      : styles.notificationItem; // Fondo oscuro translúcido
    let iconNotification = "";
    let colorIcon = "";

    if (notification.TipoNotificacion == 0) {
      iconNotification = "circle-check";
      colorIcon = "#2DCE89";
    } else if (notification.TipoNotificacion == 1) {
      iconNotification = "circle-xmark";
      colorIcon = "#F5365C";
    } else if (notification.TipoNotificacion == 2) {
      iconNotification = "triangle-exclamation";
      colorIcon = "#FB6340";
    } else if (notification.TipoNotificacion == 3) {
      iconNotification = "circle-exclamation";
      colorIcon = "#11CDEF";
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => handleUpdateNotifications(notification.IdNotificacion)}
      >
        <View style={backgroundC}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: "aliceblue",
              marginHorizontal: 16,
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
            <View style={[styles.NotificationIconBtn]}>
              <FontAwesomeIcon
                icon={iconNotification}
                size={isMovil ? 12 : 16}
                color={colorIcon}
              />
            </View>
          </View>
          <View style={{ width: isMovil ? width * 0.73 : width * 0.85 }}>
            <Text style={styles.notificationTitle}>{notification.Titulo}</Text>
            <Text style={styles.notificationDescription} numberOfLines={3}>
              {notification.Subtitulo}
            </Text>
            <Text style={styles.notificationTime}>{fechaTexto}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const handleUpdateNotifications = (id) => {
    var data = {
      CodigoCliente: CodigoCliente.toString(),
      IdNotificacion: id,
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

        if (respuesta.Error == 0) {
          axiosInstance
            .get(`${baseUrlNotifications}/${CodEmp}/${CodigoCliente}`)
            .then((response) => {
              const dataApi = response.data;
              setNotifications(categorizarNotificaciones(dataApi.Data));
              dispatch(addNotificationsCustomer(dataApi.Data));
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    navigation.navigate("View Notification", { idNotification: id });
  };
  const renderHeader = () => {
    return (
      <Header
        back
        onBackPress={() => handlePressBack()}
        scrollTittle={false}
        title={"Notificaciones"}
        right
        logOut
        blur={true}
      />
    );
  };
  const handlePressBack = () => {
    navigation.navigate("HomeStack", {
      screen: "Home",
    });
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
  function categorizarNotificaciones(notificaciones) {
    const hoy = new Date(); // Fecha actual (incluye la hora)
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(hoy.getDate() - 7); // Hace una semana atrás

    // Obtener la fecha actual sin la hora (solo año, mes y día)
    const hoySinHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );

    const notificacionesHoy = [];
    const notificacionesEstaSemana = [];
    const notificacionesAnteriores = [];

    notificaciones.forEach((notificacion) => {
      const fechaRegistro = new Date(notificacion.FechaRegistro); // Fecha de registro de la notificación

      // Obtener la fecha de registro sin la hora (solo año, mes y día)
      const fechaRegistroSinHora = new Date(
        fechaRegistro.getFullYear(),
        fechaRegistro.getMonth(),
        fechaRegistro.getDate()
      );

      if (+fechaRegistroSinHora === +hoySinHora) {
        notificacionesHoy.push(notificacion);
      } else if (fechaRegistro >= unaSemanaAtras) {
        notificacionesEstaSemana.push(notificacion);
      } else {
        notificacionesAnteriores.push(notificacion);
      }
    });
    setNotificationsHoy(notificacionesHoy);
    setNotificationsEstaSemana(notificacionesEstaSemana);
    setNotificationsAnteriores(notificacionesAnteriores);
    return {
      hoy: notificacionesHoy,
      estaSemana: notificacionesEstaSemana,
      anteriores: notificacionesAnteriores,
    };
  }
  return (
    <ImageBackground source={Images.BlueReverse} style={styles.home}>
      <StatusBar
        animated={true}
        barStyle="default"
        hidden={false}
        backgroundColor={"transparent"}
      />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
          width,
          height,
          backgroundColor: "white",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length == 0 && (
          <Block
            style={{
              backgroundColor: "white",
              paddingVertical: 24,
            }}
          >
            <Text
              style={{
                fontSize: isMovil ? 24 : 28,
                marginVertical: 12,
                alignSelf: "flex-start", // Alinea el texto a la izquierda
                paddingHorizontal: 16,
              }}
            >
              ¡Sin notificaciones!
            </Text>
          </Block>
        )}
        {notificationsHoy.length != 0 && (
          <>
            <Block
              row
              style={{
                backgroundColor: "white",
              }}
            >
              <Text
                style={{
                  fontSize: isMovil ? 24 : 28,
                  fontWeight: "bold",
                  marginVertical: 12,
                  alignSelf: "flex-start", // Alinea el texto a la izquierda
                  paddingHorizontal: 16,
                }}
              >
                Hoy
              </Text>
            </Block>
            <Block
              style={{
                backgroundColor: "white",
              }}
            >
              {notificationsHoy.map((item) => {
                return (
                  <NotificationItem
                    notification={item}
                    key={item.IdNotificacion}
                  />
                );
              })}
            </Block>
          </>
        )}
        {notifications.estaSemana !== undefined &&
          notifications.estaSemana.length != 0 && (
            <>
              <Block
                row
                style={{
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: isMovil ? 24 : 28,
                    fontWeight: "bold",
                    marginVertical: 12,
                    alignSelf: "flex-start", // Alinea el texto a la izquierda
                    paddingHorizontal: 16,
                  }}
                >
                  Esta Semana
                </Text>
              </Block>
              <Block
                style={{
                  backgroundColor: "white",
                }}
              >
                {notificationsEstaSemana.map((item) => {
                  return (
                    <NotificationItem
                      notification={item}
                      key={item.IdNotificacion}
                    />
                  );
                })}
              </Block>
            </>
          )}
        {notifications.anteriores !== undefined &&
          notifications.anteriores.length != 0 && (
            <>
              <Block
                row
                style={{
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: isMovil ? 24 : 28,
                    fontWeight: "bold",
                    marginVertical: 12,
                    alignSelf: "flex-start", // Alinea el texto a la izquierda
                    paddingHorizontal: 16,
                  }}
                >
                  Anteriores
                </Text>
              </Block>
              <Block
                style={{
                  backgroundColor: "white",
                }}
              >
                {notificationsAnteriores.map((item) => {
                  return (
                    <NotificationItem
                      notification={item}
                      key={item.IdNotificacion}
                    />
                  );
                })}
              </Block>
            </>
          )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  home: {
    height: height,
    width: width,
    //backgroundColor: "white",
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
  notificationItemView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationDescription: {},
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

export default NotificationsCustomer;
