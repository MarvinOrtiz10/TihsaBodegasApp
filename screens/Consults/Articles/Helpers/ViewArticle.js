import React, { useEffect, useState } from "react";
import { Text, theme } from "galio-framework";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArticlesImages } from "../../../../settings/EndPoints.js";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Parser } from "htmlparser2";

const { width } = Dimensions.get("screen");
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
const Iphone = Platform.OS === "ios" ? true : false;

const convertTextToList = (htmlText) => {
  const isHTML = /<[a-z][\s\S]*>/i.test(htmlText.trim());

  if (htmlText.trim() === "") {
    return []; // Retorna un array vacío si el string es vacío
  }

  const listItems = [];
  let currentText = "";
  let inLiTag = false;

  if (isHTML) {
    const parser = new Parser(
      {
        onopentag(name) {
          if (name === "li") {
            inLiTag = true;
          }
        },
        ontext(text) {
          if (inLiTag) {
            currentText += text.trim() + " ";
          }
        },
        onclosetag(name) {
          if (name === "li") {
            if (currentText.trim()) {
              listItems.push(currentText.trim());
              currentText = "";
            }
            inLiTag = false;
          }
        },
      },
      { decodeEntities: true }
    );

    parser.write(htmlText);
    parser.end();
  } else {
    // Si no es HTML, devuelve el texto en un array
    return [htmlText.trim()];
  }

  return listItems;
};

const RenderViewArticle = ({ articulo }) => {
  const {
    Linea,
    Codigo,
    Foto,
    NombreArticulo,
    Descripcion,
    Precio,
    MasterPack,
    Sustituto,
    Inactivo,
    Descontinuado,
  } = articulo;
  const baseUrlImagesArticle = ArticlesImages.EndPoint;
  const [activeImageSlide, setActiveImageSlide] = useState(0);
  const [listItems, setListItems] = useState([]);
  const [fotosArticulo, setFotosArticulo] = useState([]);
  const [existenciaBodegas, setExistenciaBodegas] = useState([]);

  useEffect(() => {
    setListItems(convertTextToList(Descripcion));

    axios.get(`${baseUrlImagesArticle}/${Codigo}`).then((response) => {
      const respuesta = response.data;
      setFotosArticulo(respuesta.Imagenes);
      setExistenciaBodegas(respuesta.Existencias);
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
  const renderIndicator = ({ index, currentIndex, item }) => {
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
  return (
    <View style={styles.profileCard}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            {fotosArticulo.length > 1 ? (
              <>
                <Carousel
                  data={fotosArticulo}
                  renderItem={renderModalProducts}
                  width={isMovil ? (Iphone ? 250 : 250) : 250}
                  height={isMovil ? (Iphone ? 250 : 250) : 250}
                  sliderWidth={width - 20} // El ancho total del carrusel (ajustar según tus necesidades)
                  itemWidth={width} // El ancho de cada elemento dentro del carrusel (ajustar según tus necesidades)
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
                  {fotosArticulo.map((_, index, item) => (
                    <View key={index} style={styles.indicatorWrapper}>
                      {renderIndicator({
                        index,
                        currentIndex: activeImageSlide,
                        item,
                      })}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.modalFotoContainer}>
                <View middle style={{ flex: 1 }}>
                  <ImageBackground
                    source={{ uri: Foto }}
                    style={styles.modalFotoArticulo}
                    imageStyle={styles.modalFotoArticulo}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                justifyContent: "center",
                alignItems: "flex-start",
                zIndex: 10, // Asegura que esté por encima de otros elementos
              }}
            >
              {Inactivo && (
                <View style={styles.inactiveFlag}>
                  <FontAwesomeIcon icon={"ban"} color="white" size={12} />
                  <Text size={14} color="white" style={{ marginLeft: 3 }}>
                    Inactivo
                  </Text>
                </View>
              )}
              {Descontinuado && (
                <View style={styles.discontinuateFlag}>
                  <FontAwesomeIcon
                    icon={"triangle-exclamation"}
                    color="black"
                    size={12}
                  />
                  <Text size={14} color="black" style={{ marginLeft: 3 }}>
                    Descontinuado
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameInfo}>
              <Text style={styles.modalCodigo}>
                <Text
                  style={{
                    fontSize: isMovil ? 16 : 16,
                    color: "black",
                    marginRight: 5,
                    fontWeight: "bold",
                  }}
                >
                  [{Codigo}]
                </Text>{" "}
                {NombreArticulo}
              </Text>
            </View>
            <View middle style={{ marginTop: 5, marginBottom: 10 }}>
              <View style={styles.divider} />
            </View>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={styles.modalLineaArticulo}>
                Precio:{" "}
                <Text
                  style={[
                    styles.modalLineaArticulo,
                    { color: "#007AFF", textAlign: "left", marginTop: 0, fontWeight:"bold", fontSize: 20 },
                  ]}
                >
                  {formatCurrency(Precio, "GTQ")}
                </Text>
              </Text>
            </View>
            {Sustituto && (
              <>
                <View middle style={{ marginVertical: 10 }}>
                  <View style={styles.divider} />
                </View>
                <View style={{ paddingHorizontal: 8 }}>
                  <Text style={styles.modalLineaArticulo}>
                    Sustituto:{" "}
                    <Text
                      style={[
                        styles.modalLineaArticulo,
                        { color: "#525F7F", textAlign: "left", marginTop: 0 },
                      ]}
                    >
                      {Sustituto}
                    </Text>
                  </Text>
                </View>
              </>
            )}
            <View middle style={{ marginTop: 10, marginBottom: 10 }}>
              <View style={styles.divider} />
            </View>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={styles.modalLineaArticulo}>
                Linea:{" "}
                <Text
                  style={[
                    styles.modalLineaArticulo,
                    { color: "#525F7F", textAlign: "left", marginTop: 0 },
                  ]}
                >
                  {Linea}
                </Text>
              </Text>
            </View>

            <View middle style={{ marginTop: 10, marginBottom: 10 }}>
              <View style={styles.divider} />
            </View>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={styles.modalLineaArticulo}>
                Master Pack:{" "}
                <Text
                  style={[
                    styles.modalLineaArticulo,
                    { color: "#525F7F", textAlign: "left", marginTop: 0 },
                  ]}
                >
                  {MasterPack}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1,}}>
          {existenciaBodegas.length !== 0 && (
            <View style={{flex: 1,}}>
              <View middle style={{ marginTop: 10, marginBottom: 10 }}>
                <View style={styles.divider} />
              </View>
              <View style={{ paddingHorizontal: 8 }}>
                <Text style={styles.modalCodigo}>Existencias en Bodegas</Text>
                <View style={styles.tableContainer}>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Bodega</Text>
                    <Text style={styles.headerCell}>Existencia</Text>
                    <Text style={styles.headerCell}>Reservado</Text>
                    <Text style={styles.headerCell}>Disponible</Text>
                  </View>
                  {existenciaBodegas.map((item) => (
                    <View key={item.CodBodega} style={styles.row}>
                      <Text style={styles.cell}>{item.NombreBodega}</Text>
                      <Text style={styles.cell}>{item.Existencia}</Text>
                      <Text style={styles.cell}>{item.Reservado}</Text>
                      <Text style={styles.cell}>{item.Disponible}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {listItems.length !== 0 && listItems !== undefined && (
            <>
              <View middle style={{ marginTop: 10, marginBottom: 10 }}>
                <View style={styles.divider} />
              </View>
              <View style={{ paddingHorizontal: 8 }}>
                <Text style={styles.modalCodigo}>Descripción</Text>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  {listItems.map((item, index) => (
                    <View row key={index}>
                      <Text style={styles.modalDescriptionArticulo}>-</Text>
                      <Text
                        style={[
                          styles.modalDescriptionArticulo,
                          {
                            paddingHorizontal: 5,
                            color: "#525F7F",
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          <View middle style={{ marginTop: 10, marginBottom: 10 }}>
            <View style={styles.divider} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  productPrice: {
    fontSize: isMovil ? 16 : 20,
    paddingVertical: 0,
  },
  column: { flex: 1, flexGrow: 1, paddingVertical: 8 },
  column0: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  column1: { backgroundColor: "#64C3ED", paddingVertical: 5 },
  column2: {
    backgroundColor: "#C6EFF9",
    paddingVertical: 5,
  },
  text0: { color: "white", fontSize: Iphone ? 16 : 14 },
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
    marginTop: 10,
  },
  indicatorWrapper: {
    marginHorizontal: 5,
  },
  indicator: {
    width: 30,
    height: 2,
    borderRadius: 2,
  },
  profileCard: {
    flex: 1,
    zIndex: 2,
    width: "100%",
  },
  modalCodigo: {
    fontSize: isMovil ? 16 : 16,
    color: "black",
    marginRight: 5,
  },
  info: {
    paddingHorizontal: 10,
  },
  divider: {
    width: "98%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  blockContainerCategories: {
    backgroundColor: "white",
    width: width,
    minWidth: width - 10,
    height: isMovil ? 260 : 350,
    maxHeight: isMovil ? 260 : 350,
    paddingHorizontal: 16,
  },
  modalFotoContainer: {
    flex: 1,
    height: 250,
  },
  modalFotoArticulo: {
    width: 250,
    height: 250,
  },
  nameInfo: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  modalDescriptionArticulo: {
    fontSize: isMovil ? 12 : 16,
  },
  modalLineaArticulo: {
    fontSize: isMovil ? 16 : 16,
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
  modalCodigo: {
    fontSize: isMovil ? 16 : 16,
    color: "black",
    marginBottom: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 5,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",//"#f2f2f2",
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color:"#007AFF"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
export default RenderViewArticle;
