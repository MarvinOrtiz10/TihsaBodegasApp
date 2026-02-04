import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";

import { Block, theme, Text } from "galio-framework";
import { useSelector, useDispatch } from "react-redux";
import Icon from "../../../components/Icon.js";
import Input from "../../../components/Input.js";
import argonTheme from "../../../constants/Theme.js";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import Header from "../../../components/Header.js";
import { Images } from "../../../constants/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  preprocessDataOnce,
  searchEngineAdvance,
} from "../../Features/Helpers/SearchEngine.js";
import { useGetOrdersQuery } from "../../../services/Api.js";
import ToastNotification from "../../../components/ToastNotification.js";
import axios from "axios";
import { AcuerdoVenta, PickingOrders } from "../../../settings/EndPoints.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 50 : 30;
const BACKGROUND_KEY = "app_background";

const Orders = () => {
  const { width, height } = useWindowDimensions();
  const isMovil = width < 650 ? true : false;
  const baseUrl = PickingOrders.EndPoint;
  const userState = useSelector((state) => state.user);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const usuario = userState[0].Usuario;
  const {
    data: dataOrders,
    error: errorOrders,
    isLoading: loadingOrders,
  } = useGetOrdersQuery({ codEmp, usuario });
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const toastRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const PageSize = 10;

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

  const cargarInformacion = () => {
    setIsLoading(true);
    axios.get(`${baseUrl}/${usuario}`).then((response) => {
      const respuesta = response.data;
      if (respuesta.Data.length === 0) {
        setData([]);
        setSearchResults([]);
      } else {
        const processedData = preprocessDataOnce(respuesta.Data, [
          "NumOrden",
          "CodigoCliente",
          "Nombre",
          "Nit",
          "Fecha",
        ]);
        setData(processedData);
        if (processedData.length < PageSize) {
          setSearchResults(processedData);
        } else {
          setSearchResults(processedData.slice(0, PageSize));
        }
      }

      setIsLoading(false);
    });
  };
  useEffect(() => {
    cargarInformacion();
    loadBackground();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Lógica para cargar la información de los pedidos al recibir el foco
      cargarInformacion();
    });

    // Lógica para limpiar cualquier suscripción o recurso si es necesario
    return unsubscribe;
  }, [navigation]); // Se ejecuta cada vez que el componente recibe el foco
  const handleSearch = (text) => {
    setShowClearIcon(text.length > 0);
    setSearchText(text);

    const newData = searchEngineAdvance(data, text);
    setSearchResults(text.length > 2 ? newData : data);
  };
  const handleClear = () => {
    setSearchText("");
    handleSearch("");
    setShowClearIcon(false);
  };
  /* Función para mostrar la barra de búsqueda de cada página, se muestra cuando se agrega search en las props dónde se importa el Header */
  const renderSearch = () => {
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="¿Qué pedido estás buscando?"
        placeholderTextColor="#8898AA"
        iconContent={
          <TouchableOpacity
            onPress={showClearIcon ? handleClear : null}
            style={showClearIcon && styles.circleCloseButton}
          >
            {showClearIcon ? (
              <Ionicons name={"close"} size={16} color={"#666666"} />
            ) : (
              <Icon
                size={16}
                color={theme.COLORS.MUTED}
                name={"search-zoom-in"}
                family="ArgonExtra"
              />
            )}
          </TouchableOpacity>
        }
        value={searchText}
        onChangeText={handleSearch}
      />
    );
  };
  /*Función que renderiza en el header las props que vienen desde el componente, agrega barra de búsqueda, opciones y tabs en el componente Header */
  const renderHeader = () => {
    return (
      <Header
        back={true}
        scrollTittle={false}
        title={"Picking de Pedidos"}
        right
        blur={true}
      />
    );
  };
  const handlePressPicking = (row) => {
    navigation.navigate("Picking Order", { order: row.NumOrden });
  };

  function formatCurrency(amount, currencyCode) {
    var moneda = amount;
    if (typeof moneda !== "number") {
      // Eliminar las comas y convertir el string en un número
      moneda = parseFloat(amount.replace(/,/g, ""));
    }
    return moneda.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }

  const renderItemOrder = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#EFEFEF"
        onPress={() => handlePressPicking(item)}
        style={{ flex: 1, margin: 3 }}
      >
        <View style={styles.mainCardView}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#007AFF",
              }}
            >
              Pedido #{item.NumOrden}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#007AFF",
              }}
            >
              {item.Fecha}
            </Text>
          </View>
          <View
            style={{
              minHeight: 30,
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 18,
              }}
              numberOfLines={3}
            >
              {item.CodigoCliente} - {item.Nombre}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  paddingRight: 5,
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: 18,
                  }}
                  numberOfLines={2}
                >
                  Nit {item.Nit}
                </Text>
              </View>
              <View
                style={{ flex: 1, justifyContent: "flex-end", paddingRight: 5 }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  Total {formatCurrency(item.Total, "GTQ")}
                </Text>
                <View
                  style={{
                    backgroundColor: item.PickingCompleto
                      ? "#DCFCE7"
                      : "#FEF3C7",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: item.PickingCompleto ? "#166534" : "#92400E",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {item.PickingCompleto
                      ? "Picking completo"
                      : "Picking pendiente"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 35,
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#007AFF", //"#FB6340",
                  borderRadius: 15,
                }}
                onPress={() => handlePressPicking(item)}
              >
                <FontAwesomeIcon icon={"dolly"} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  const handlePressNewOrder = () => {
    navigation.navigate("New Order");
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const styles = StyleSheet.create({
    mainCardView: {
      flex: 1,
      backgroundColor: "white",
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "#EFEFEF",
      padding: 8,
      minHeight: 180,
    },
    subCardView: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: "#666666",
      borderColor: "#eeeeee",
      borderWidth: 1,
      borderStyle: "solid",
      alignItems: "center",
      justifyContent: "center",
    },
    home: {
      flex: 1,
      height: height,
      width: width,
      backgroundColor: "white",
    },
    articles: {
      width: width - theme.SIZES.BASE * 2,
      paddingVertical: theme.SIZES.BASE,
    },
    floatingButton: {
      backgroundColor: "#007AFF",
      borderRadius: 50,
      height: isMovil ? 45 : 50,
    },
    cartText: {
      color: "white",
      textTransform: "uppercase", // Convierte el texto a mayúsculas
      fontWeight: "bold",
      fontSize: isMovil ? 16 : 20,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      padding: 12,
      position: "relative",
    },
    title: {
      width: "100%",
      fontSize: 16,
      fontWeight: "bold",
    },

    shadow: {
      backgroundColor: theme.COLORS.WHITE,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.2,
      //elevation: 3,
    },

    header: {
      backgroundColor: theme.COLORS.WHITE,
    },
    divider: {
      borderRightWidth: 0.3,
      borderRightColor: theme.COLORS.ICON,
    },
    search: {
      height: 48,
      width: width - 32,
      marginHorizontal: 16,
      borderRadius: 25,
      borderColor: argonTheme.COLORS.BORDER,
    },
    options: {
      marginBottom: 24,
      marginTop: 10,
      // elevation: 4,
    },
    tab: {
      backgroundColor: theme.COLORS.TRANSPARENT,
      width: width * 0.35,
      borderRadius: 0,
      borderWidth: 0,
      height: 24,
      //elevation: 0,
    },
    tabTitle: {
      lineHeight: 19,
      fontWeight: "400",
      color: argonTheme.COLORS.HEADER,
    },
    circleCloseButton: {
      backgroundColor: "#F2F2F2",
      padding: 3,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    circleEditButton: {
      width: 70,
      height: 40,
      backgroundColor: "#F2F2F2",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    badge: {
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  // Función para cargar más datos
  /*  const loadMoreData = () => {
    if(data.length < PageSize)return;
    if (searchText.length == 0) {
      setIsLoading(true);
      // Simulando una solicitud de red asíncrona
      setTimeout(() => {
        // Aquí debes obtener los nuevos datos del servidor y agregarlos a la lista existente
        const newData = [...searchResults, ...getMoreData()];
        setSearchResults(newData);
        setPage(page + 1);
        setIsLoading(false);
      }, 1000); // Simulación de tiempo de carga
    }
  }; */
  const loadMoreData = () => {
    if (searchText.length === 0 && !isLoading) {
      if (searchResults.length >= data.length) {
        return;
      }
      setIsLoading(true);

      setTimeout(() => {
        const newPage = page + 1;
        const newData = getMoreData(newPage);

        if (newData.length > 0) {
          setSearchResults((prevResults) => [...prevResults, ...newData]);
          setPage(newPage); // Solo aumentamos la página si hay datos nuevos
        } else {
          console.log("No hay más datos para cargar.");
        }

        setIsLoading(false);
      }, 1000);
    }
  };
  // Función para simular obtener más datos
  const getMoreData = () => {
    // Aquí deberías realizar una solicitud a tu servidor para obtener más datos
    // utilizando 'page' y 'pageSize' para controlar qué datos se obtienen.
    // Por ahora, asumiremos que 'data' contiene todos los registros y simularemos
    // la obtención de datos adicionales a partir de 'data'.
    const start = (page - 1) * PageSize;
    const end = start + PageSize;
    const newData = data.slice(start, end); // Obtener los datos correspondientes a la página actual
    return newData;
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
      />
      {renderHeader()}
      <ScrollView
        style={{ flexGrow: 1, width: width, backgroundColor: "white" }}
      >
        <Block
          style={{
            backgroundColor: "white",
            width: width,
            minHeight: height * 0.8,
            borderTopWidth: 0.5,
            borderColor: "#F2F2F2",
          }}
        >
          {renderSearch()}

          {
            // Pantalla con la data de pedidos actuales
            loadingOrders ? (
              <ActivityIndicator size="large" color="#FED30B" />
            ) : searchResults.length === 0 && searchText ? (
              <Block style={{ padding: 24 }}>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  No se ha encontrado ningún resultado para "{searchText}"
                </Text>
              </Block>
            ) : searchResults.length !== 0 ? (
              <Block style={{ flex: 1, minHeight: 200, paddingHorizontal: 8 }}>
                <FlashList
                  data={searchResults}
                  numColumns={3}
                  renderItem={renderItemOrder}
                  keyExtractor={(item, index) => index}
                  ListHeaderComponent={<View style={{ width: "100%" }} />}
                  estimatedItemSize={200}
                  contentContainerStyle={{
                    paddingBottom: 65,
                  }}
                  onEndReached={() => {
                    if (!isLoading) {
                      loadMoreData();
                    }
                  }}
                  onEndReachedThreshold={1} // Cuando el 50% de los elementos se ha alcanzado, se cargan más
                  ListFooterComponent={() =>
                    isLoading && (
                      <View style={{ paddingTop: 16 }}>
                        <ActivityIndicator size="large" color="#FED30B" />
                      </View>
                    )
                  }
                />
              </Block>
            ) : isLoading ? (
              <View
                style={{
                  flex: 1,
                  paddingTop: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#FED30B" />
                <Text style={{ color: "gray", fontSize: 18 }}>
                  Cargando pedidos
                </Text>
              </View>
            ) : (
              <Block style={{ padding: 24 }}>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 18,
                  }}
                >
                  No tiene pedidos pendientes para hacer picking.
                </Text>
              </Block>
            )
          }
        </Block>
      </ScrollView>
      <TouchableOpacity
        onPress={() => cargarInformacion()}
        style={{
          position: "absolute",
          bottom: 10, // Adjust this value to control the distance from the bottom
          right: 8, // Adjust this value to control the distance from the right
          backgroundColor: "#007AFF",
          borderRadius: 30,
          padding: 8,
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            padding: 5,
            borderRadius: 50,
            backgroundColor: "white",
            justifyContent: "center", // Centra verticalmente
            alignItems: "center", // Centra horizontalmente
            width: Iphone ? 25 : 30,
          }}
        >
          <FontAwesomeIcon icon={"retweet"} size={16} color="#007AFF" />
        </View>
        <Text
          style={{
            padding: 5,
            color: "white",
            fontSize: 14,
          }}
        >
          Recargar
        </Text>
      </TouchableOpacity>

      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};

export default Orders;
