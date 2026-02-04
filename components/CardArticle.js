import React, { memo } from "react";
import { StyleSheet, Image, Dimensions, View } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const { width, height } = Dimensions.get("screen");
const isMovil = width < 650 ? true : false;
const Card = memo(({ navigation, item }) => {
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
    <Block card style={[styles.card, styles.shadow]}>
      <Block row style={{ alignItems: "center" }}>
        <Block style={styles.imageContainer}>
          <Image source={{ uri: item.Foto }} style={styles.horizontalImage} />
        </Block>
        <Block flex style={{ paddingHorizontal: 8 }}>
          <Text size={12} bold>
            Ubicación: {item.Ubicacion}
          </Text>
          <Text size={12} numberOfLines={3}>
            {item.Codigo} - {item.NombreArticulo}
          </Text>
          <Text size={11}>
            Existencia: {item.Existencia} | Costo:{" "}
            {formatCurrency(item.Costo ?? 0, "GTQ")}
          </Text>
          {item.AlreadyAdded && (
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "orange",
                paddingVertical: 2,
                paddingHorizontal: 6,
                borderRadius: 4,
                alignSelf: "flex-start",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FontAwesomeIcon icon='clipboard-check' color="white" size={11} />
              <Text style={{ color: "white", fontSize: 12 }}>En requisición</Text>
            </View>
          )}
        </Block>
      </Block>
    </Block>
  );
});

const styles = StyleSheet.create({
  checkContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: 2,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
});

export default Card;
