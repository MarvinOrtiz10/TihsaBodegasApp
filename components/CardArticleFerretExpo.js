import React, { memo } from "react";
import { StyleSheet, Image, Dimensions, View } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const { width, height } = Dimensions.get("screen");
const isMovil = width < 650 ? true : false;

const CardArticleFerretExpo = memo(
  ({ item, horizontal, full, style, imageStyle }) => {
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
      (item.Inactivo || item.Descontinuado) && styles.ImageInactive,
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
    ];
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
      <Block row={horizontal} card flex style={cardContainer}>
        <Block style={imgContainer}>
            <Image
              source={{
                uri: item.Foto,
              }}
              style={imageStyles}
            />
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {item.Inactivo && (
                <View style={styles.inactiveFlag}>
                  <FontAwesomeIcon icon={"ban"} color="white" size={10} />
                  <Text size={12} color="white" style={{ marginLeft: 3 }}>
                    Inactivo
                  </Text>
                </View>
              )}
              {item.Existencia == 0 && (
                <View style={styles.inactiveFlag}>
                  <FontAwesomeIcon icon={"ban"} color="white" size={10} />
                  <Text size={12} color="white" style={{ marginLeft: 3 }}>
                    Agotado
                  </Text>
                </View>
              )}
              {item.Descontinuado && (
                <View style={styles.discontinuateFlag}>
                  <FontAwesomeIcon
                    icon={"triangle-exclamation"}
                    color="black"
                    size={10}
                  />
                  <Text size={12} color="black" style={{ marginLeft: 3 }}>
                    Descontinuado
                  </Text>
                </View>
              )}
            </View>
          </Block>
        <Block>
          <Block style={styles.cardDescription}>
            <Text
              size={12}
              style={[
                styles.cardTitle,
                (item.Inactivo || item.Descontinuado) && styles.textInactive,
              ]}
              numberOfLines={3}
            >
              [{item.Codigo}] - {item.NombreArticulo}
            </Text>
          </Block>
          <Block style={styles.cardPrice}>
            <Block
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 122, 255, 0.2)",
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            >
              <Text
                size={10}
                color={item.Inactivo || item.Descontinuado ? "gray" : "#007AFF"}
              >
                Precio
              </Text>
              <Text
                size={10}
                color={item.Inactivo || item.Descontinuado ? "gray" : "#007AFF"}
              >
                {formatCurrency(Number(item.Precio), "GTQ")}
              </Text>
            </Block>
            {item.Ordenado > 0 && (
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 94, 34, 0.2)",
                }}
              >
                <Text
                  size={10}
                  color={
                    item.Inactivo || item.Descontinuado ? "gray" : "#FF5E22"
                  }
                >
                  En Camino
                </Text>
                <Text
                  size={10}
                  color={
                    item.Inactivo || item.Descontinuado ? "gray" : "#FF5E22"
                  }
                >
                  {item.Ordenado}
                </Text>
              </Block>
            )}
            <Block
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 122, 255, 0.1)",
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
            >
              <Text
                size={10}
                color={item.Inactivo || item.Descontinuado ? "gray" : "#007AFF"}
              >
                Disponible
              </Text>
              <Text
                size={10}
                color={item.Inactivo || item.Descontinuado ? "gray" : "#007AFF"}
              >
                {item.Existencia}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: 4,
    borderWidth: 0,
    minHeight: 114,
    borderWidth: 0.9,
    borderColor: "#DBEAFE"
  },
  cardInactive: {
    opacity: 0.7,
  },
  ImageInactive: {
    opacity: 0.5,
  },
  textInactive: {
    color: "gray",
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
  },
  cardDescription: {
  flex: 1,
  flexDirection:"row",
  justifyContent: "center",
    minHeight: 55,
    padding: 5,
    paddingBottom: 0,
  },
  cardPrice: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 30,
    padding: 5,
    paddingTop: 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    padding: 5,
    paddingBottom: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  image: {
    // borderRadius: 3,
    //borderWidth: 1,
  },
  horizontalImage: {
    height: 122,
    width: "auto",
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  fullImage: {
    height: 120,
    width: 120,
  },
  shadow: {
    /*shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,*/
  },
  inactiveFlag: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.6)", // Fondo rojo semitransparente
    color: "white",
    fontWeight: "bold",
    padding: 5,
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
    padding: 5,
    borderRadius: 5,
    zIndex: 10, // Asegura que esté por encima de otros elementos
  },
});

export default CardArticleFerretExpo;
