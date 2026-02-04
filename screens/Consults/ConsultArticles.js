import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";

import argonTheme from "../../constants/Theme.js";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
import { Input } from "../../components/index.js";
import ToastNotification from "../../components/ToastNotification.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Icon from "../../components/Icon.js";
import { Images } from "../../constants/index.js";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  preprocessDataOnce,
  searchEngineAdvance,
} from "../Features/Helpers/SearchEngine.js";
import RenderViewArticle from "./Articles/Helpers/ViewArticle.js";
import CardArticle from "../../components/CardArticle.js";
import { useGetAllArticlesQuery } from "../../services/Api.js";
import Modals from "../../components/Modals.js";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const columns = isMovil ? 2 : 5;
const BACKGROUND_KEY = "app_background";

const ConsultArticles = () => {
  const userState = useSelector((state) => state.user);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const codBodega = userState.length !== 0 ? userState[0].CodBodega : 1;

  const {
    data: dataAllArticles,
    error: errorAllArticles,
    isLoading: loadingAllArticles,
  } = useGetAllArticlesQuery({ codEmp, codBodega });
  const toastRef = useRef(null);
  const [modal, setModal] = useState(false);
  //Variables para confiración de código
  const [searchText, setSearchText] = useState("");
  const [dataArticles, setDataArticles] = useState([]);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);
  const numColumns = width > 650 ? 3 : 2;
  //Variables para el artículo
  const [article, setArticle] = useState({});
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle
  );
  const scanBarRef = useRef(null);

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
  }, []);
  useEffect(() => {
    if (dataAllArticles) {
      var respuestaData = preprocessDataOnce(dataAllArticles, [
        "Codigo",
        "Codigo2",
        "NombreArticulo",
      ]);
      setDataArticles(respuestaData);
      setSearchResults(respuestaData);
    }
  }, [dataAllArticles]);
  const renderHeader = () => {
    return (
      <Header
        back
        scrollTittle={false}
        title={"Consulta de artículos"}
        right
        blur
      />
    );
  };
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
      />
    );
  };
  const searchArticleByCode = () => {
    if (searchResults.length > 0) {
      const article = searchResults.find(
        (item) =>
          item.Codigo?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Codigo2?.toLowerCase().includes(searchText.toLowerCase())
      );


      if (article) {
        setArticle(article);
        setModal(true);
      }
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setShowClearIcon(text.length > 0);

    const dataFuse = searchEngineAdvance(
      dataArticles,
      text,
      "CodTarticulo",
      "asc"
    );

    setSearchResults(text.length > 2 ? dataFuse : dataArticles);

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    if (scanBarRef.current) {
      scanBarRef.current.focus();
    }
  };

  const handleClear = () => {
    setSearchText("");
    setShowClearIcon(false);
    setSearchResults(dataArticles);
    if (scanBarRef.current) {
      scanBarRef.current.focus();
    }
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
    if (scanBarRef.current) {
      scanBarRef.current.focus();
    }
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
      <View style={{ flex: 1, width: width, backgroundColor: "white" }}>
        {renderSearch()}

        {loadingAllArticles ? (
          <View
            style={{
              flex: 1,
              width: width,
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
                height: height * 0.5,
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
        width="80%"
        height="100%"
        fullScreen
        hideFooter
      >
        <RenderViewArticle articulo={article} />
      </Modals>
      <ToastNotification ref={toastRef} />
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
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 25,
    borderColor: argonTheme.COLORS.BORDER,
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
    width: width,
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
export default ConsultArticles;
