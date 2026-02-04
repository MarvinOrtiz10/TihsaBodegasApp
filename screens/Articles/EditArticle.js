import React, { useEffect, useRef, useState } from "react";
import { Text, theme } from "galio-framework";
import {
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import InputSpinner from "react-native-input-spinner";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArticlesImages } from "../../settings/EndPoints.js";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";

const { width } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
const Iphone = Platform.OS === "ios" ? true : false;

const RenderEditArticle = ({ articulo, cantidad, onCantidadChange }) => {
  const { Codigo, Foto, NombreArticulo, Existencia, Costo } = articulo;
  const baseUrlImagesArticle = ArticlesImages.EndPoint;
  const [activeImageSlide, setActiveImageSlide] = useState(0);
  //const listItems = convertTextToList(Descripcion);
  const [fotosArticulo, setFotosArticulo] = useState([]);
  useEffect(() => {
    axios.get(`${baseUrlImagesArticle}/${Codigo}`).then((response) => {
      const respuesta = response.data;
      setFotosArticulo(respuesta.Imagenes);
    });
  }, []);

  const renderModalProducts = ({ item }) => {
    return (
      <Image
        source={{ uri: item.Imagen }}
        style={styles.modalFotoArticulo}
        imageStyle={styles.modalFotoContainer}
      />
    );
  };
  const renderIndicator = ({ index, currentIndex }) => {
    const isActive = index === currentIndex;

    return (
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 5,
          backgroundColor: isActive ? "#666666" : "#CFCFCF",
        }}
      />
    );
  };
  function formatCurrency(amount, currencyCode) {
    if (typeof amount !== "number") {
      return ""; // o puedes retornar un valor predeterminado o lanzar un error
    }
    return amount.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }
  const styles = StyleSheet.create({
    productPrice: {
      fontSize: Iphone ? 16 : 14,
      paddingVertical: 0,
    },
    column: {
      flex: 1,
      flexGrow: 1,
      paddingVertical: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    column0: {
      backgroundColor: "#0D7C66",
      borderRadius: 10,
    },
    column1: {
      backgroundColor: "#41B3A2",
      borderTopEndRadius: 10,
      borderBottomEndRadius: 10,
    },
    column2: {
      backgroundColor: "#C6EFF9",
    },
    text0: { color: "white", fontSize: Iphone ? 16 : 18 },
    text1: { color: "white", fontSize: Iphone ? 16 : 14 },
    text2: { color: "black", fontSize: Iphone ? 16 : 14 },
    soldOutFlagContainer: {
      width: 150,
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "rgba(255, 0, 0, 0.6)", // Fondo rojo con transparencia
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    soldOutFlagText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    indicatorContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: -20,
    },
    indicatorWrapper: {
      marginHorizontal: 5,
    },
    indicator: {
      width: 30,
      height: 2,
      borderRadius: 2,
    },
    activeIndicator: {
      backgroundColor: "#007AFF",
    },
    inactiveIndicator: {
      backgroundColor: "#C4C4C4",
    },
    cartButton: {
      backgroundColor: "#007AFF",
      borderRadius: 50,
      height: isMovil ? 45 : 50,
      width: isMovil ? width - 100 : width - 200,
    },
    textCartButton: {
      paddingHorizontal: 32,
      color: "white",
      textTransform: "uppercase", // Convierte el texto a mayúsculas
      letterSpacing: 0, // Ajusta el espaciado entre las letras
      fontWeight: "bold",
      fontSize: isMovil ? 16 : 20,
    },
    iconCarButton: { fontSize: isMovil ? 16 : 24 },
    profileCard: {
      zIndex: 2,
      width: "100%",
    },
    promotionCard: {
      marginTop: 0,
      marginBottom: 0,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      zIndex: 2,
      width: "100%",
    },
    fotoContainerPromotion: {
      width: isMovil ? (Iphone ? 250 : 200) : 400,
      height: isMovil ? (Iphone ? 250 : 200) : 400,
    },
    fotoPromotion: {
      width: isMovil ? (Iphone ? 250 : 200) : 400,
      height: isMovil ? (Iphone ? 250 : 200) : 400,
    },
    titlePromotionContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      paddingHorizontal: 0,
      marginBottom: 10,
    },
    titlePromotion: {
      fontSize: isMovil ? 20 : 32,
      fontWeight: "bold",
      color: "black",
    },
    modalDescriptionPromotion: {
      fontSize: isMovil ? 18 : 24,
    },
    modalExpirationPromotion: {
      fontSize: isMovil ? 14 : 20,
      color: "grey",
    },
    modalNombreArticulo: {
      fontSize: isMovil ? 12 : 20,
      color: "#525F7F",
      marginTop: 10,
    },
    info: {
      paddingHorizontal: 10,
    },
    divider: {
      width: "98%",
      borderWidth: 1,
      borderColor: "#E9ECEF",
    },
    modalFotoContainer: {
      flex: 1,
      height: isMovil ? (Iphone ? 250 : 200) : 200,
    },
    modalFotoArticulo: {
      width: isMovil ? (Iphone ? 250 : 200) : 200,
      height: isMovil ? (Iphone ? 250 : 200) : 200,
    },
    nameInfo: {
      paddingVertical: 8,
    },
    modalCodigo: {
      fontSize: isMovil ? 16 : 16,
      color: "black",
      marginRight: 5,
    },
    modalNombreArticulo: {
      fontSize: isMovil ? 12 : 20,
      color: "#525F7F",
      marginTop: 10,
    },
    modalLineaArticulo: {
      fontSize: isMovil ? 16 : 22,
    },
    inactiveFlag: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 0, 0, 0.6)", // Fondo rojo semitransparente
      color: "white",
      fontWeight: "bold",
      padding: 10,
      borderRadius: 5,
      zIndex: 10, // Asegura que esté por encima de otros elementos
      marginBottom: 3,
    },
    discontinuateFlag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 165, 0, 0.9)", // Fondo rojo semitransparente
      color: "white",
      fontWeight: "bold",
      padding: 10,
      borderRadius: 5,
      zIndex: 10, // Asegura que esté por encima de otros elementos
    },
  });
  return (
    <View style={styles.profileCard}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid
        extraHeight={Iphone ? 0 : 100}
      >
        <View style={{ alignItems: "center" }}>
          {fotosArticulo.length > 0 ? (
            <>
              <Carousel
                data={fotosArticulo}
                renderItem={renderModalProducts}
                width={isMovil ? (Iphone ? 250 : 200) : 200}
                height={isMovil ? (Iphone ? 250 : 200) : 200}
                sliderWidth={"100%"} // El ancho total del carrusel (ajustar según tus necesidades)
                itemWidth={"100%"} // El ancho de cada elemento dentro del carrusel (ajustar según tus necesidades)
                activeSlideAlignment={"start"}
                onSnapToItem={(index) => setActiveImageSlide(index)}
              />
              <View
                style={[
                  styles.indicatorContainer,
                  {
                    backgroundColor: "#ebebeb",
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                  },
                ]}
              >
                {fotosArticulo.map((_, index) => (
                  <View key={index} style={styles.indicatorWrapper}>
                    {renderIndicator({
                      index,
                      currentIndex: activeImageSlide,
                    })}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.modalFotoContainer}>
              <View style={{ width: "90%", justifyContent: "center" }}>
                <ImageBackground
                  source={{ uri: Foto }}
                  style={styles.modalFotoArticulo}
                  imageStyle={styles.modalFotoArticulo}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameInfo}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.modalCodigo}>
                Código: [{Codigo}] {NombreArticulo}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.column, styles.column0]}>
              <Text center color={theme.COLORS.WHITE} style={styles.text0}>
                Costo {formatCurrency(Costo, "GTQ")}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <View style={styles.divider} />
          </View>
          <View style={{ flexDirection: "row", width: "100%", paddingTop: 5 }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Text center color={"black"} style={styles.productPrice}>
                Cantidad:
              </Text>
              <InputSpinner
                min={0}
                max={Existencia <= 0 ? 1000 : Existencia}
                value={cantidad}
                onChange={(num) => {
                  onCantidadChange(num);
                }}
                precision={1}
                step={0.1}
                returnKeyType="done"
                color={"#0D7C66"}
                skin="default"
                shadow={false}
                showBorder={true}
                rounded={false}
                height={40} // Altura máxima del componente
                style={{ height: 40 }} // Estilo para el componente en sí (input y botones)
                buttonStyle={{ height: 40, width: 40 }} // Estilo para los botones
                inputStyle={{ height: 40, fontSize: 18, borderWidth: 0 }} // Estilo para el input
                iconSize={12} // Tamaño de los iconos de los botones
                onBlur={() => {
                  if (!cantidad || cantidad === 0) {
                    onCantidadChange(1);
                  }
                }}
                selectTextOnFocus={true}
                autoFocus
              />
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#41B3A2",
                  marginLeft: 5,
                  borderRadius: 5,
                  justifyContent: "center",
                }}
              >
                <Text center color={"white"} style={styles.productPrice}>
                  Existencia:
                </Text>
                <Text center color={"white"} style={styles.productPrice}>
                  {Existencia}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View style={styles.divider} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default RenderEditArticle;
