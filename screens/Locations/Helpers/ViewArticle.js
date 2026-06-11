import React, { useEffect, useState,useRef } from "react";
import { Text } from "galio-framework";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  InteractionManager,
  useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArticlesImages } from "../../../settings/EndPoints.js";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import InputAutoGrowing from "../../../components/InputAutoGrowing.js";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

const Iphone = Platform.OS === "ios" ? true : false;

const RenderViewArticle = ({ articulo, onSaveLocation, loading, onScanLocation }) => {
  const { width, height } = useWindowDimensions();
  const isMovil = Math.min(width, height) < 650;
  const isLandscape = width > height;

  const {
    Linea,
    Codigo,
    Foto,
    NombreArticulo,
    Descripcion,
    Precio,
    Ubicacion,
    Sustituto,
    Inactivo,
    Descontinuado,
  } = articulo;
  const baseUrlImagesArticle = ArticlesImages.EndPoint;
  const [activeImageSlide, setActiveImageSlide] = useState(0);
  const [listItems, setListItems] = useState([]);
  const [fotosArticulo, setFotosArticulo] = useState([]);
  const [existenciaBodegas, setExistenciaBodegas] = useState([]);
  const [ubicacion, setUbicacion] = useState(articulo?.Ubicacion || "");
  const ubicacionRef = useRef(null);

  useEffect(() => {
    axios.get(`${baseUrlImagesArticle}/${Codigo}`).then((response) => {
      const respuesta = response.data;
      setFotosArticulo(respuesta.Imagenes);
      setExistenciaBodegas(respuesta.Existencias);
    });
    InteractionManager.runAfterInteractions(() => {
                  ubicacionRef.current?.focus();
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
    width: "100%",
    minWidth: width - 10,
    height: isMovil ? 260 : 350,
    maxHeight: isMovil ? 260 : 350,
    paddingHorizontal: 16,
  },
  modalFotoContainer: {
    flex: 1,
    height: "100%",
  },
  modalFotoArticulo: {
    width: "100%",
    height: "100%",
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
    borderColor: "#D9F2EC",
    borderRadius: 5,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#D9F2EC", //"#f2f2f2",
    paddingVertical: isMovil?4:8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0D7C66",
    fontSize: isMovil?12:14,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D9F2EC",
    paddingVertical: isMovil?4:8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: isMovil?12:14,
  },
  required: {
    marginTop: -8,
    fontSize: 10,
    color: "red",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInputWrapper: {
    flex: 1,
  },
  locationScanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9F2EC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#0D7C66",
  },
});
  return (
    <View style={styles.profileCard}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid
      >
        <View
          style={{
            flexDirection: isMovil && !isLandscape ? "column" : "row",
            paddingBottom: 20,
          }}
        >
          <View style={{ flex: 1, alignItems: "center", marginBottom: isMovil && !isLandscape ? 15 : 0 }}>
            {fotosArticulo.length > 1 ? (
              <>
                <Carousel
                  data={fotosArticulo}
                  renderItem={renderModalProducts}
                  width={isMovil ? (isLandscape ? 200 : 150) : 250}
                  height={isMovil ? (isLandscape ? 200 : 150) : 250}
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
                  [{Codigo}] {" "}
                </Text>
                {NombreArticulo}
              </Text>
            </View>
            <View middle style={{ marginTop: 5, marginBottom: 10 }}>
              <View style={styles.divider} />
            </View>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={styles.modalLineaArticulo}>
                Precio:
                <Text
                  style={[
                    styles.modalLineaArticulo,
                    {
                      color: "#0D7C66",
                      textAlign: "left",
                      marginTop: 0,
                      fontWeight: "bold",
                      fontSize: 20,
                    },
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
                    Sustituto:
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
              <Text style={styles.label}>Ubicación:</Text>
              <View style={styles.locationRow}>
                <View style={styles.locationInputWrapper}>
                  <InputAutoGrowing
                    iconContent={<View />}
                    returnKeyType="done"
                    placeholder="Ubicación"
                    value={ubicacion}
                    onChangeText={setUbicacion}
                    editable={true}
                    ref={ubicacionRef}
                    selectTextOnFocus={true}
                    onSubmitEditing={(e) => onSaveLocation(e.nativeEvent.text)}            
                  />
                </View>
                {onScanLocation && (
                  <TouchableOpacity
                    style={styles.locationScanButton}
                    activeOpacity={0.7}
                    onPress={() => {
                      onScanLocation("location", (scannedData) => {
                        setUbicacion(scannedData);
                        // Simular Enter del handheld: guardar automáticamente
                        onSaveLocation(scannedData);
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={"qrcode"} size={18} color="#0D7C66" />
                  </TouchableOpacity>
                )}
              </View>
              {ubicacion == "" ? (
                <Text style={styles.required}>* Obligatorio</Text>
              ): loading ? (
                <ActivityIndicator size="large" color="#0D7C66" />
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#0D7C66",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => onSaveLocation(ubicacion)}
                >
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    color="white"
                    size={16}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Guardar Ubicación
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {existenciaBodegas.length !== 0 && (
            <View style={{ flex: 1 }}>
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

export default RenderViewArticle;
