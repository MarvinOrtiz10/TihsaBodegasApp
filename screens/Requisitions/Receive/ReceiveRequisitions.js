import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  useGetBodegasQuery,
  useGetOrdersQuery,
} from "../../../services/Api.js";
import ToastNotification from "../../../components/ToastNotification.js";
import axios from "axios";
import {
  AcuerdoVenta,
  Requisition,
  RequisitionsList,
} from "../../../settings/EndPoints.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Select2 from "../../../components/Select2.js";
import { BlurView } from "expo-blur";
import {
  faBoxesPacking,
  faInbox,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Modals from "../../../components/Modals.js";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 50 : 30;
const BACKGROUND_KEY = "app_background";

const ReceiveRequisitions = () => {
  const { width, height } = useWindowDimensions();
  const isMovil = Math.min(width, height) < 650;
  const isLandscape = width > height;
  const columns = isMovil ? (width > height ? 2 : 1) : 3;
  const baseUrl = Requisition.EndPoint;
  const userState = useSelector((state) => state.user);
  const CodBodega = userState.length !== 0 ? userState[0].CodBodega : 1;
  const {
    data: dataBodegas,
    error: errorBodegas,
    isLoading: loadingBodegas,
  } = useGetBodegasQuery();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const toastRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const PageSize = 50;
  const [codBodegaOrigen, setCodBodegaOrigen] = useState(null);
  const [codBodegaDestino, setCodBodegaDestino] = useState(null);
  const [optionsBodegas, setOptionsBodegas] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isMobilePortrait = isMovil && !isLandscape;
  const isMobileLandscape = isMovil && isLandscape;

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

  const cargarInformacion = async () => {
    try {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);

      const response = await axios.get(`${baseUrl}/Recibido/${CodBodega}`);

      const respuesta = response.data.Data;
      const processedData = preprocessDataOnce(respuesta, [
        "NumTraslado",
        "CodBodegaDestino",
        "Destino",
        "CodBodegaOrigen",
        "Fecha",
      ]);

      setData(processedData);

      const firstPage = processedData.slice(0, PageSize);

      setSearchResults(firstPage);
      setHasMore(processedData.length > PageSize);
    } catch (error) {
      console.log("Error cargando requisiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataBodegas) {
      setOptionsBodegas(dataBodegas.Data);
    }
  }, [dataBodegas]);
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

  useEffect(() => {
    if (!data.length) return;

    const filtered = applyFilters(searchText);

    setPage(1);
    setHasMore(filtered.length > PageSize);
    setSearchResults(filtered.slice(0, PageSize));
  }, [codBodegaOrigen, codBodegaDestino, searchText, data]);

  const handleSearch = (text) => {
    setShowClearIcon(text.length > 0);
    setSearchText(text);
  };

  const handleClear = () => {
    setSearchText("");
    handleSearch("");
    setShowClearIcon(false);
  };
  /* Función para mostrar la barra de búsqueda de cada página, se muestra cuando se agrega search en las props dónde se importa el Header */
  const renderSearch = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* SEARCH SIEMPRE */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Input
            right
            color="black"
            style={styles.search}
            placeholder="¿Qué requisición estás buscando?"
            placeholderTextColor="#8898AA"
            iconContent={
              <TouchableOpacity
                onPress={showClearIcon ? handleClear : null}
                style={showClearIcon && styles.circleCloseButton}
              >
                {showClearIcon ? (
                  <Ionicons name="close" size={16} color="#666" />
                ) : (
                  <Icon
                    size={16}
                    color={theme.COLORS.MUTED}
                    name="search-zoom-in"
                    family="ArgonExtra"
                  />
                )}
              </TouchableOpacity>
            }
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {/* 👉 CASO MOBILE PORTRAIT */}
        {isMobilePortrait && (
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <View
              style={{
                backgroundColor: "#F2F2F2",
                padding: 10,
                borderRadius: 50,
                marginRight: 8,
              }}
            >
              <FontAwesomeIcon icon={"filter"} size={18} color="#666" />
            </View>
          </TouchableOpacity>
        )}

        {/* 👉 CASO DESKTOP o MOBILE LANDSCAPE */}
        {(!isMovil || isMobileLandscape) && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Text>Filtrar por:</Text>

            <View style={{ flex: 1, paddingHorizontal: 4 }}>
              <Select2
                options={optionsBodegas}
                value={codBodegaOrigen}
                setValue={setCodBodegaOrigen}
                onSelect={handleSelectBodegaOrigen}
                placeholder={!isMobilePortrait && "Bodega Origen"}
                doneText="Aceptar"
              />
            </View>

            <View style={{ flex: 1, paddingHorizontal: 4 }}>
              <Select2
                options={optionsBodegas}
                value={codBodegaDestino}
                setValue={setCodBodegaDestino}
                onSelect={handleSelectBodegaDestino}
                placeholder={!isMobilePortrait && "Bodega Destino"}
                doneText="Aceptar"
              />
            </View>

            {(codBodegaDestino || codBodegaOrigen) && (
              <TouchableOpacity
                onPress={() => {
                  setCodBodegaDestino(null);
                  setCodBodegaOrigen(null);
                  cargarInformacion();
                }}
              >
                <View style={styles.clearFilterBtn}>
                  <FontAwesomeIcon icon={"trash"} size={16} color={"#666"} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };
  /*Función que renderiza en el header las props que vienen desde el componente, agrega barra de búsqueda, opciones y tabs en el componente Header */
  const renderHeader = () => {
    return (
      <Header
        back={true}
        scrollTittle={false}
        title={"Recepción de requisiciones de bodegas"}
        right
        blur={true}
      />
    );
  };
  const handlePressReceiveRequisitions = (row) => {
    navigation.navigate("Packing Receive Requisition", {
      order: row.NumTraslado,
    });
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

  const cleanBodegaName = (name = "") => {
    if (!name) return "";

    const index = name.indexOf("-");
    return index !== -1 ? name.substring(index + 1).trim() : name.trim();
  };

  // ✅ ITEM MEMOIZADO (ULTRA IMPORTANTE)
  const renderItemRequisitions = useCallback(({ item }) => {
    const Checked = !!item.Reservado;
    const Send = !!item.Enviada;
    const Receive = !!item.Entregada;
    const Charged = !!item.Trasladada;
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#E6F2EF"
        onPress={() => handlePressReceiveRequisitions(item)}
      >
        <View style={styles.mainCardView}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#0D7C66",
                  fontWeight: "bold",
                }}
              >
                Requisición #{item.NumTraslado}
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                {formatearFecha(item.Fecha)}
              </Text>
            </View>
            <Text
              style={{
                marginTop: 5,
                fontSize: 18,
                color: "gray",
              }}
              numberOfLines={2}
            >
              {item.Destino}
            </Text>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {Checked && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                    paddingHorizontal: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text size={14} color="#0D7C66" bold>
                    Reservada
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      marginLeft: 4,
                      borderColor: Checked ? "#0D7C66" : "#F2F2F2",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={Checked ? "square-check" : "square"}
                      size={15}
                      color={Checked ? "#0D7C66" : "#F2F2F2"}
                    />
                  </View>
                </View>
              )}
              {Receive && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                    paddingHorizontal: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text size={14} color="#007AFF" bold>
                    Recibida
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      marginLeft: 4,
                      borderColor: Receive ? "#007AFF" : "#F2F2F2",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faInbox}
                      size={15}
                      color={Receive ? "#007AFF" : "#F2F2F2"}
                    />
                  </View>
                </View>
              )}
              {Charged && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                    paddingHorizontal: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text size={14} color="#16A34A" bold>
                    Trasladada
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      marginLeft: 4,
                      borderColor: Receive ? "#16A34A" : "#F2F2F2",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBoxesPacking}
                      size={15}
                      color={Receive ? "#16A34A" : "#F2F2F2"}
                    />
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#F2F2F2",
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={"warehouse"}
                  size={20}
                  color={"#0D7C66"}
                  style={{ marginRight: 4 }}
                />
                <Text style={{ fontSize: 12, color: "#333" }}>
                  {cleanBodegaName(item.NombreBodegaOrigen)}
                </Text>
              </View>
              <View style={{ marginHorizontal: 8 }}>
                {Charged ? (
                  // Double check estilo WhatsApp
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesomeIcon
                      icon={"check"}
                      size={18}
                      color={"#16A34A"}
                      style={{ marginRight: -6 }}
                    />
                    <FontAwesomeIcon
                      icon={"check"}
                      size={18}
                      color={"#16A34A"}
                    />
                  </View>
                ) : Receive ? (
                  // Check simple
                  <FontAwesomeIcon icon={"check"} size={20} color={"#007AFF"} />
                ) : (
                  // Default
                  <FontAwesomeIcon
                    icon={"truck-arrow-right"}
                    size={24}
                    color={"#0D7C66"}
                  />
                )}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Charged
                      ? "#16A34A"
                      : Receive
                        ? "#007AFF"
                        : "#0D7C66",
                  }}
                  numberOfLines={1}
                >
                  {cleanBodegaName(item.NombreBodegaDestino)}
                </Text>
                <FontAwesomeIcon
                  icon={"location-dot"}
                  size={20}
                  color={Charged ? "#16A34A" : Receive ? "#007AFF" : "#0D7C66"}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  });
  function formatearFecha(fechaString) {
    if (!fechaString) return "";

    // Separar fecha y hora
    const [fecha] = fechaString.split(" ");
    const [dia, mes, año] = fecha.split("/");

    return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${año}`;
  }

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
      margin: 5,
      minHeight: 180,
      justifyContent: "space-between",
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
      height: "100%",
      width: "100%",
      backgroundColor: "white",
    },
    articles: {
      width: "100%" - theme.SIZES.BASE * 2,
      paddingVertical: theme.SIZES.BASE,
    },
    floatingButton: {
      backgroundColor: "#0D7C66",
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
      width: "35%",
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
  // ✅ PAGINACIÓN REAL
  const loadMoreData = () => {
    if (!hasMore || loadingMore || isLoading) return;

    setLoadingMore(true);

    setTimeout(() => {
      const filtered = applyFilters(searchText);

      const start = page * PageSize;
      const end = start + PageSize;

      const more = filtered.slice(start, end);

      if (more.length > 0) {
        setSearchResults((prev) => [...prev, ...more]);
        setPage((prev) => prev + 1);

        if (end >= filtered.length) setHasMore(false);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 300);
  };
  const isEmptyFilter = (value) => {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      value === 0 ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  // ✅ SEARCH + FILTROS (PRO)
  const applyFilters = useCallback(
    (text) => {
      let filtered = [...data]; // <- copia segura

      // SEARCH
      if (text && text.length > 2) {
        filtered = searchEngineAdvance(filtered, text);
      }

      // ORIGEN
      if (!isEmptyFilter(codBodegaOrigen)) {
        filtered = filtered.filter((i) => i.CodBodegaOrigen == codBodegaOrigen);
      }

      // DESTINO
      if (!isEmptyFilter(codBodegaDestino)) {
        filtered = filtered.filter(
          (i) => i.CodBodegaDestino == codBodegaDestino,
        );
      }

      return filtered;
    },
    [data, codBodegaOrigen, codBodegaDestino],
  );

  const handleSelectBodegaOrigen = (value) => {
    setCodBodegaOrigen(value || null);
  };

  const handleSelectBodegaDestino = (value) => {
    setCodBodegaDestino(value || null);
  };

  const handlePressRequisition = () => {
    navigation.navigate("Requisitions");
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
      <Block
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {renderSearch()}

        {isLoading ? (
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
              key={columns}
              data={searchResults}
              numColumns={columns}
              renderItem={renderItemRequisitions}
              keyExtractor={(item) => item.NumTraslado.toString()}
              estimatedItemSize={190}
              onEndReached={hasMore ? loadMoreData : null}
              onEndReachedThreshold={0.35}
              removeClippedSubviews
              contentContainerStyle={{
                paddingBottom: 60, // 👈 espacio para la barra flotante
              }}
              ListFooterComponent={() =>
                loadingMore && (
                  <View style={{ paddingVertical: 20 }}>
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
              Cargando requisiciones
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
              No tiene requisiciones pendientes.
            </Text>
          </Block>
        )}
      </Block>
      <BlurView
        intensity={40}
        tint="dark"
        style={{
          position: "absolute",
          bottom: isMobilePortrait ? 25 : isMobileLandscape ? 25 : 5, // Adjust this value to control the distance from the bottom
          right: isMovil && columns === 1 ? undefined : 5,
          alignSelf: isMovil && columns === 1 ? "center" : undefined,
          gap: 4,
          padding: 12,
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <View style={{ flexDirection: "row", gap: 4 }}>
          <TouchableOpacity
            onPress={() => handlePressRequisition()}
            style={{
              backgroundColor: "#ff8f44",
              borderRadius: 25,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={"reply"} size={20} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                marginLeft: 4,
              }}
            >
              Requisiciones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => cargarInformacion()}
            style={{
              backgroundColor: "#0D7C66",
              borderRadius: 25,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={"retweet"} size={25} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                marginLeft: 4,
              }}
            >
              Recargar
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
      <Modals
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        width={isMovil ? (isLandscape ? "90%" : "95%") : "50%"}
        height={isMovil ? (isLandscape ? "70%" : "50%") : "60%"}
        hideFooter
        fullScreen
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Filtrar requisiciones por:
          </Text>

          {/* FILTROS */}
          <View style={{ gap: 12 }}>
            <Select2
              options={optionsBodegas}
              value={codBodegaOrigen}
              setValue={setCodBodegaOrigen}
              onSelect={handleSelectBodegaOrigen}
              placeholder="Bodega origen"
              doneText="Aceptar"
            />

            <Select2
              options={optionsBodegas}
              value={codBodegaDestino}
              setValue={setCodBodegaDestino}
              onSelect={handleSelectBodegaDestino}
              placeholder="Bodega destino"
              doneText="Aceptar"
            />
          </View>

          {/* ACCIONES */}
          <View style={{ gap: 10 }}>
            {(codBodegaDestino || codBodegaOrigen) && (
              <TouchableOpacity
                onPress={() => {
                  setCodBodegaDestino(null);
                  setCodBodegaOrigen(null);
                  cargarInformacion();
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FDECEC",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#D32F2F", fontWeight: "bold" }}>
                    Limpiar filtros
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <View
                style={{
                  backgroundColor: "#007AFF",
                  padding: 14,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Aplicar / Cerrar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modals>
      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};

export default ReceiveRequisitions;
