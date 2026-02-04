import React, { memo } from "react";
import { StyleSheet, Image, Dimensions, View } from "react-native";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
const isMovil = width < 650 ? true : false;
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Card = memo(
  ({
    navigation,
    item,
    horizontal,
    full,
    style,
    ctaColor,
    imageStyle,
    tipoCliente,
  }) => {
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle, (item.Inactivo || item.Descontinuado) && styles.ImageInactive,
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
        <Block>
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
        </Block>
        <Block>
          <Block  style={styles.cardDescription}>
            <Text size={12} style={[styles.cardTitle, (item.Inactivo || item.Descontinuado) && styles.textInactive,]} numberOfLines={4}>
              [{item.Codigo}] - {item.NombreArticulo}
            </Text>
          </Block>
          <Block style={styles.cardPrice}>
            <Text size={10} color={(item.Inactivo || item.Descontinuado) ? "gray" : "#007AFF"} bold>
              Precio{" "}
              {formatCurrency(
                tipoCliente == 1 ? item.Precio : item.PrecioFeria,
                "GTQ"
              )}
            </Text>
            <Text size={10} color={(item.Inactivo || item.Descontinuado) ? "gray" : "#007AFF"} bold>
              Disponible {item.Existencia}
            </Text>
          </Block>
        </Block>
      </Block>
    );
  }
);

/*Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
};*/

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: 4,
    borderWidth: 0,
    minHeight: 114,
  },
  cardInactive:{
    opacity: 0.7,
  },
  ImageInactive:{
    opacity: 0.5,
  },
  textInactive:{
    color:"gray",
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
    //paddingBottom: 6,
    //lineHeight: 20,
    //maxHeight: 4 * 18, // 3 líneas * 20px (línea de altura)
  },
  cardDescription: {
    flex: 1, 
    justifyContent: "space-between",
    minHeight: 70,
    //padding: theme.SIZES.BASE / 2,
    padding: 5,
  },
  cardPrice: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    //padding: theme.SIZES.BASE / 2,
    padding: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 3,
    //elevation: 1,
    //overflow: "hidden",
    backgroundColor: "white",
    padding: 5,
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
    height: isMovil ? 140 : 200,
    width: isMovil ? 140 : 200,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
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

export default Card;
