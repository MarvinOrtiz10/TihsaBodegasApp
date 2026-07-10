import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../components/Header.js";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
  Alert,
  Linking,
  useWindowDimensions,
} from "react-native";

import argonTheme from "../../constants/Theme.js";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
const isMovil = Math.min(width, height) < 650 ? true : false;

import { Input } from "../../components/index.js";
import ToastNotification from "../../components/ToastNotification.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Icon from "../../components/Icon.js";
import { Images } from "../../constants/index.js";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FlashList } from "@shopify/flash-list";
import {
  preprocessDataOnce,
  searchEngineAdvance,
} from "../Features/Helpers/SearchEngine.js";
import RenderViewArticle from "./Helpers/ViewArticle.js";
import CardArticle from "./Helpers/CardArticle.js";
import { useGetAllArticlesQuery } from "../../services/Api.js";
import Modals from "../../components/Modals.js";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Articles as ArticlesEndpoint } from "../../settings/EndPoints.js";
import axios from "axios";

//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const BACKGROUND_KEY = "app_background";
const paddingTopNotification = Iphone ? 55 : 40;

const Articles = () => {
  const { width, height } = useWindowDimensions();
  const isMovil = Math.min(width, height) < 650;
  const isLandscape = width > height;
  const SCAN_WINDOW_SIZE = isMovil
    ? isLandscape
      ? height * 0.5
      : width * 0.65
    : width * 0.35;
  const columns = isMovil ? (isLandscape ? 3 : 2) : 4;

  const userState = useSelector((state) => state.user);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const codBodega = userState.length !== 0 ? userState[0].CodBodega : 1;
  const baseUrl = ArticlesEndpoint.EndPoint;

  const {
    data: dataAllArticles,
    error: errorAllArticles,
    isLoading: loadingAllArticles,
    isFetching,
    refetch,
  } = useGetAllArticlesQuery({ codBodega });
  const toastRef = useRef(null);
  const [modal, setModal] = useState(false);
  //Variables para confiración de código
  const [searchText, setSearchText] = useState("");
  const [dataArticles, setDataArticles] = useState([]);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);
  //Variables para el artículo
  const [article, setArticle] = useState({});
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );
  const [loading, setLoading] = useState(false);
  const scanBarRef = useRef(null);

  // ── QR / Barcode Scanner ──
  const [cameraModal, setCameraModal] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const laserAnim = useRef(new Animated.Value(0)).current;
  const scanModeRef = useRef("article"); // "article" | "location"
  const onLocationScannedRef = useRef(null);

  // ── Animación del láser ──
  useEffect(() => {
    if (cameraModal) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [cameraModal]);

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
  useEffect(() => {
    loadBackground();
    refocusScanBar();
  }, []);

  useEffect(() => {
    if (dataAllArticles) {
      var response = dataAllArticles;
      if (response.Error == 0) {
        var respuestaData = preprocessDataOnce(dataAllArticles.Data, [
          "Codigo",
          "Codigo2",
          "NombreArticulo",
          "Ubicacion",
          "Linea",
        ]);
        setDataArticles(respuestaData);
        setSearchResults(respuestaData);
      }
    }
  }, [dataAllArticles]);
  const handleRefresh = async () => {
  try {
    setLoading(true);
    await refetch();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
  const refocusScanBar = () => {
    InteractionManager.runAfterInteractions(() => {
      scanBarRef.current?.focus();
    });
  };
  const renderHeader = () => {
    return (
      <Header
        back
        scrollTittle={false}
        title={"Ubicación de artículos"}
        right
        blur
      />
    );
  };
  // ── Función para abrir la cámara con manejo de permisos ──
  const handleOpenCamera = useCallback(
    async (mode = "article", onScannedCallback = null) => {
      scanModeRef.current = mode;
      onLocationScannedRef.current = onScannedCallback;
      try {
        if (!permission) return; // Aún cargando permisos

        if (permission.granted) {
          // Ya tiene permisos, abrir cámara
          setCameraModal(true);
          return;
        }

        // Solicitar permisos
        const result = await requestPermission();

        if (result.granted) {
          setCameraModal(true);
        } else if (!result.canAskAgain) {
          // El usuario denegó permanentemente, redirigir a configuración
          Alert.alert(
            "Permisos de cámara requeridos",
            "Has denegado el acceso a la cámara. Para usar el escáner de QR/códigos de barras, por favor habilita los permisos de cámara en la configuración de tu dispositivo.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Abrir Configuración",
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        } else {
          // El usuario denegó pero puede volver a preguntar
          Alert.alert(
            "Permisos de cámara",
            "Necesitamos acceso a la cámara para escanear códigos QR y códigos de barras.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Reintentar",
                onPress: () => handleOpenCamera(),
              },
            ],
          );
        }
      } catch (error) {
        console.error("Error solicitando permisos de cámara:", error);
      }
    },
    [permission, requestPermission],
  );

  // ── Función que se ejecuta al escanear un QR/barcode ──
  const handleScanQR = useCallback(
    (data) => {
      if (!data) return;
      const scannedValue = data.trim().toUpperCase();
      if (!scannedValue) return;

      console.log("QR/Barcode Scanned:", scannedValue);

      // Buscar en dataArticles por Codigo o Codigo2
      const articleFound = dataArticles.find(
        (item) =>
          item.Codigo?.toUpperCase() === scannedValue ||
          item.Codigo2?.toUpperCase() === scannedValue,
      );

      if (articleFound) {
        // Artículo encontrado: abrir modal de detalle
        setArticle(articleFound);
        setModal(true);
        notificar(
          "top",
          `Artículo encontrado: ${articleFound.NombreArticulo || articleFound.Codigo}`,
          "success",
          paddingTopNotification,
        );
      } else {
        // No encontrado: notificar al usuario
        notificar(
          "top",
          `No se encontró artículo con código: ${scannedValue}`,
          "error",
          paddingTopNotification,
        );
      }

      refocusScanBar();
    },
    [dataArticles],
  );

  /* Función para mostrar la barra de búsqueda de cada página, se muestra cuando se agrega search en las props dónde se importa el Header */
  const renderSearch = () => {
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="Buscar artículos por código, nombre o keywords"
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
        ref={scanBarRef}
        selectTextOnFocus={true}
        onSubmitEditing={(e) => scanArticleByCode(e.nativeEvent.text)}
      />
    );
  };
  const handleSearch = (text) => {
    setSearchText(text);
    setShowClearIcon(text.length > 0);

    const dataFuse = searchEngineAdvance(
      dataArticles,
      text,
      "CodTarticulo",
      "asc",
    );

    setSearchResults(text.length > 2 ? dataFuse : dataArticles);

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    refocusScanBar();
  };
  const scanArticleByCode = async (event) => {
    try {
      if (!event) return;

      // 🔥 Normalizar input (clave en scanners)
      const scannedValue = event.trim().toUpperCase();

      if (!scannedValue) return;

      console.log("Scanned:", scannedValue);

      // 🔎 Buscar en lista (puedes cambiar el orden según tu lógica)
      const articleFound =
        dataArticles.find(
          (item) =>
            item.Codigo?.toUpperCase() === scannedValue ||
            item.Codigo2?.toUpperCase() === scannedValue,
        ) ||
        searchResults.find(
          (item) =>
            item.Codigo?.toUpperCase() === scannedValue ||
            item.Codigo2?.toUpperCase() === scannedValue,
        );

      // ❌ No encontrado
      if (!articleFound) {
        refocusScanBar();
        return;
      }

      // ✅ Encontrado
      setArticle(articleFound);
      setModal(true);
    } catch (error) {
      console.error("Error escaneando:", error);
    }
  };
  const handleClear = () => {
    setSearchText("");
    setShowClearIcon(false);
    setSearchResults(dataArticles);
    refocusScanBar();
  };
  const renderCard = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setArticle(item);
        setModal(true);
      }}
    >
      <Block style={styles.columnProd}>
        <CardArticle item={item} full />
      </Block>
    </TouchableWithoutFeedback>
  );
  const handleCloseModal = () => {
    setModal(false);
    refocusScanBar();
  };
  const handleUpdateLocation = async (ubicacion) => {
    try {
      setLoading(true);
      const body = {
        Codigo: article.Codigo,
        Ubicacion: ubicacion,
        CodBodega: codBodega,
      };
      const response = await axios.put(
        `${baseUrl}/Location/${codBodega}`,
        body,
        {
          headers: { "content-type": "application/json" },
        },
      );

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        const articleModified = respuesta.Data;
        // 🔹 Actualizar solo el artículo escaneado
        setDataArticles((prev) =>
          prev.map((detail) =>
            detail.Codigo === articleModified.Codigo
              ? { ...detail, Ubicacion: articleModified.Ubicacion }
              : detail,
          ),
        );
        setSearchResults((prev) =>
          prev.map((detail) =>
            detail.Codigo === articleModified.Codigo
              ? { ...detail, Ubicacion: articleModified.Ubicacion }
              : detail,
          ),
        );
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const styles = StyleSheet.create({
    home: {
      flex: 1,
      height: "100%",
      width: "100%",
      backgroundColor: "white",
    },
    search: {
      height: 48,
      width: "100%" - 32,
      marginHorizontal: 16,
      borderRadius: 25,
      borderColor: argonTheme.COLORS.BORDER,
    },
    // ── FAB Flotante ──
    fab: {
      position: "absolute",
      right: 20,
      bottom: 24,
      width: 80,
      height: 80,
      borderRadius: 50,
      backgroundColor: "#0D7C66",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#0D7C66",
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 14,
      shadowOpacity: 0.45,
      elevation: 10,
      zIndex: 0,
    },
    fabInner: {
      alignItems: "center",
      justifyContent: "center",
    },
    // ── Camera Styles ──
    cameraContainer: {
      flex: 1,
      backgroundColor: "#000",
    },
    camera: {
      flex: 1,
    },
    cameraHeaderBtn: {
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.15)",
      justifyContent: "center",
      alignItems: "center",
    },
    cameraHeaderCenter: {
      flexDirection: "row",
      alignItems: "center",
    },
    cameraHeaderTitle: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
    // Overlay layers to create dark frame with transparent center
    overlayTop: {
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    overlayMiddle: {
      flexDirection: "row",
      height: SCAN_WINDOW_SIZE,
    },
    overlaySide: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    overlayBottom: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    scanWindow: {
      width: SCAN_WINDOW_SIZE,
      height: SCAN_WINDOW_SIZE,
    },
    corner: {
      position: "absolute",
      width: isMovil ? 30 : 40,
      height: isMovil ? 30 : 40,
      borderColor: "#00E676",
    },
    cornerTL: {
      top: 0,
      left: 0,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderTopLeftRadius: 20,
    },
    cornerTR: {
      top: 0,
      right: 0,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderTopRightRadius: 20,
    },
    cornerBL: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderBottomLeftRadius: 20,
    },
    cornerBR: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomRightRadius: 20,
    },
    laserLine: {
      position: "absolute",
      top: 0,
      left: 16,
      right: 16,
      height: 3,
      backgroundColor: "#00E676",
      borderRadius: 2,
      shadowColor: "#00E676",
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 12,
      shadowOpacity: 1,
      elevation: 8,
    },
    cameraInstructionContainer: {
      position: "absolute",
      top: (height - SCAN_WINDOW_SIZE) / 2 + SCAN_WINDOW_SIZE + 24,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    cameraTitle: {
      color: "#FFFFFF",
      fontSize: isMovil ? 16 : 18,
      fontWeight: "600",
      marginBottom: 6,
      letterSpacing: 0.2,
    },
    cameraSubtitle: {
      color: "rgba(255,255,255,0.6)",
      fontSize: isMovil ? 13 : 15,
      textAlign: "center",
      paddingHorizontal: 40,
    },
    // ── Bottom bar estilo iPhone ──
    cameraBottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.55)",
      maxWidth: width,
    },
    cameraBottomBtn: {
      alignItems: "center",
      justifyContent: "center",
    },
    cameraBottomIcon: {
      borderRadius: 23,
      backgroundColor: "rgba(255,255,255,0.12)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 5,
    },
    cameraBottomIconActive: {
      backgroundColor: "rgba(255,214,0,0.25)",
    },
    cameraBottomLabel: {
      color: "rgba(255,255,255,0.75)",

      fontWeight: "500",
    },
    cameraCancelBtn: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    cameraCancelText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    columnProd: {
      flex: 1,
      paddingHorizontal: 5,
    },
    circle: {
      width: 25,
      height: 25,
      borderWidth: 2, // Añadimos un ancho de borde
      borderColor: "#007AFF", // Color del borde
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },

    //Modal Styles
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingTop: 30,
      paddingBottom: 0,
    },
    modalContent: {
      backgroundColor: "white",
      borderTopEndRadius: 40,
      borderTopStartRadius: 40,
      width: "100%",
      alignItems: "center", // Cambiado a "center" en lugar de "flex-start"
      marginBottom: 0,
      height: Iphone ? height - 55 : height - 100,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between", // Cambio en justifyContent
      alignItems: "flex-end", // Cambio en alignItems
      alignItems: "center",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingVertical: 0,
      backgroundColor: "white",
      width: "100%",
    },
    modalBody: {
      flex: 1,
      minHeight: isMovil ? "85%" : "90%",
      //marginBottom: 30,
    },
    modalFooter: {
      flex: 1,
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    circleCloseButton: {
      backgroundColor: "#F2F2F2",
      padding: 3,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    line: {
      width: "100%",
      height: 4,
      backgroundColor: "#666666",
      alignSelf: "center",
      marginVertical: 15,
      borderRadius: 2,
    },
    elementoDerecha: {
      marginLeft: "auto",
    },

    closeButton: {
      backgroundColor: "#333333",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
  });
  return (
    <ImageBackground source={backgroundImage} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
      />
      {renderHeader()}
      <View style={{ flex: 1, width: "100%", backgroundColor: "white" }}>
        {renderSearch()}

       {(loadingAllArticles || isFetching) ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "white",
              paddingVertical: 48,
            }}
          >
            <ActivityIndicator size="large" color="#FED30B" />
          </View>
        ) : searchResults.length !== 0 ? (
          <FlashList
            data={searchResults}
            ref={flatListRef}
            numColumns={columns}
            renderItem={renderCard}
            keyExtractor={(item) => item.Codigo}
            showsVerticalScrollIndicator={true}
            estimatedItemSize={200}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
          />
        ) : (
          searchText.length > 2 &&
          searchResults.length == 0 && (
            <Block
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
                backgroundColor: "white",
                borderRadius: 10,
                height: "50%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                No se encontraron resultados para "{searchText}"
              </Text>
            </Block>
          )
        )}
      </View>
      <Modals
        visible={modal}
        onClose={() => {
          handleCloseModal();
        }}
        width={isMovil ? (isLandscape ? "90%" : "98%") : "80%"}
        height={isMovil ? (isLandscape ? "90%" : "90%") : "100%"}
        fullScreen
        hideFooter
      >
        <RenderViewArticle
          articulo={article}
          onSaveLocation={handleUpdateLocation}
          loading={loading}
          onScanLocation={handleOpenCamera}
        />
      </Modals>

      {/* ── Modal de Cámara para escanear QR / Barcode ── */}
      <Modal
        visible={cameraModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCameraModal(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            flash={flash}
            animateShutter
            onBarcodeScanned={({ data }) => {
              setCameraModal(false);
              if (
                scanModeRef.current === "location" &&
                onLocationScannedRef.current
              ) {
                onLocationScannedRef.current(data);
              } else {
                handleScanQR(data);
              }
            }}
          />

          {/* Header bar */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: isMovil ? (isLandscape ? 8 : 26) : 26,
              paddingBottom: isMovil ? (isLandscape ? 8 : 12) : 12,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.45)",
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.cameraHeaderBtn,
                {
                  width: isMovil ? (isLandscape ? 22 : 44) : 44,
                  height: isMovil ? (isLandscape ? 22 : 44) : 44,
                },
              ]}
              onPress={() => setCameraModal(false)}
            >
              <FontAwesomeIcon
                icon={"arrow-left"}
                size={isMovil ? (isLandscape ? 16 : 20) : 20}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.cameraHeaderCenter}>
              <FontAwesomeIcon
                icon={"barcode"}
                size={16}
                color="#00E676"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cameraHeaderTitle}>
                {scanModeRef.current === "location"
                  ? "Escanear Ubicación"
                  : "Escanear Artículo"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.cameraHeaderBtn,
                {
                  width: isMovil ? (isLandscape ? 22 : 44) : 44,
                  height: isMovil ? (isLandscape ? 22 : 44) : 44,
                },
              ]}
              onPress={() => setFlash(flash === "off" ? "on" : "off")}
            >
              <FontAwesomeIcon
                icon={flash === "off" ? "bolt-lightning" : "bolt"}
                size={isMovil ? (isLandscape ? 16 : 20) : 20}
                color={flash === "off" ? "white" : "#FFD600"}
              />
            </TouchableOpacity>
          </View>

          {/* Overlay oscuro con ventana central transparente */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Top overlay */}

            <View
              style={[
                styles.overlayTop,
                {
                  flex: isMovil ? (isLandscape ? 0.5 : 1) : 1,
                },
              ]}
            />
            {/* Middle row */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              {/* Ventana de escaneo */}
              <View style={styles.scanWindow}>
                {/* Esquinas decorativas */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                {/* Láser animado */}
                <Animated.View
                  style={[
                    styles.laserLine,
                    {
                      transform: [
                        {
                          translateY: laserAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, SCAN_WINDOW_SIZE - 4],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.overlaySide} />
            </View>
            {/* Bottom overlay */}
            <View style={styles.overlayBottom}>
              {isLandscape && isMovil && (
                <View style={{ alignItems: "center", paddingBottom: 10 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: isMovil ? (isLandscape ? 14 : 10) : 14,
                      fontWeight: "600",
                    }}
                  >
                    Alinea el código dentro del recuadro
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Barra inferior estilo iPhone */}
          <View
            style={[
              styles.cameraBottomBar,
              {
                paddingBottom: isMovil
                  ? isLandscape
                    ? 4
                    : Iphone
                      ? 36
                      : 20
                  : 20,
                paddingTop: isMovil ? (isLandscape ? 4 : 8) : 8,
                paddingHorizontal: 4,
              },
            ]}
          >
            {/* Voltear */}
            <TouchableOpacity
              style={[
                styles.cameraBottomBtn,
                {
                  minWidth: isMovil ? (isLandscape ? 36 : 72) : 72,
                },
              ]}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <View style={styles.cameraBottomIcon}>
                <FontAwesomeIcon
                  icon={"camera-rotate"}
                  size={20}
                  color="white"
                />
              </View>
              <Text
                style={[
                  styles.cameraBottomLabel,
                  {
                    fontSize: isMovil ? (isLandscape ? 8 : 11) : 11,
                  },
                ]}
              >
                Voltear
              </Text>
            </TouchableOpacity>
            {!isLandscape && (
              <View>
                {/* Texto de instrucciones debajo del cuadro */}
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: isMovil ? (isLandscape ? 14 : 10) : 18,
                    fontWeight: "600",
                    marginBottom: 6,
                    letterSpacing: 0.2,
                  }}
                >
                  Alinea el código dentro del recuadro
                </Text>
                <Text
                  style={[
                    styles.cameraSubtitle,
                    { fontSize: isMovil ? (isLandscape ? 13 : 10) : 15 },
                  ]}
                >
                  QR ó código de barras
                </Text>
              </View>
            )}
            {/* Cancelar */}
            <TouchableOpacity
              style={styles.cameraBottomBtn}
              onPress={() => setCameraModal(false)}
            >
              <View
                style={[
                  styles.cameraBottomIcon,
                  {
                    width: isMovil ? (isLandscape ? 28 : 46) : 46,
                    height: isMovil ? (isLandscape ? 28 : 46) : 46,
                  },
                ]}
              >
                <FontAwesomeIcon
                  icon={"times-circle"}
                  size={isMovil ? (isLandscape ? 14 : 20) : 20}
                  color="white"
                />
              </View>
              <Text
                style={[
                  styles.cameraBottomLabel,
                  {
                    fontSize: isMovil ? (isLandscape ? 8 : 11) : 11,
                  },
                ]}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ── Botón Flotante Escanear ── */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 110, // 40 + 80 + espacio
          bottom: 24,
          width: 80,
          height: 80,
          borderRadius: 50,
          backgroundColor: "#007AFF",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#007AFF",
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 14,
          shadowOpacity: 0.45,
          elevation: 10,
          zIndex: 10,
        }}
        onPress={handleRefresh}
        activeOpacity={0.8}
      >
        <View style={styles.fabInner}>
          <FontAwesomeIcon icon={"sync"} size={26} color="#FFFFFF" />
          <Text color="white">Refrescar</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenCamera}
        activeOpacity={0.8}
      >
        <View style={styles.fabInner}>
          <FontAwesomeIcon icon={"qrcode"} size={26} color="#FFFFFF" />
          <Text color="white">Escanear</Text>
        </View>
      </TouchableOpacity>

      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};

export default Articles;
