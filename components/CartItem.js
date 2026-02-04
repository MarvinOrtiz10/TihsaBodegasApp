import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback } from "react";
import {
  Image,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("screen");
const isMovil = width < 650;
function formatCurrency(amount, currencyCode) {
  if (typeof amount !== "number") {
    return ""; // o puedes retornar un valor predeterminado o lanzar un error
  }
  return amount.toLocaleString("es-GT", {
    style: "currency",
    currency: currencyCode,
  });
}
const CartItem = React.memo(
  ({
    showPacking,
    showPicking,
    showCost,
    showEdit,
    item,
    onPress,
    renderEdit,
  }) => {
    const handlePress = useCallback(() => {
      onPress(item);
    }, [item.Codigo, onPress]);

    const Checked = !!item.Picking;
    const Pending = item.Cantidad != item.CantidadPicking;
    const Packed = showPacking && item.Cantidad === item.CantidadPl;

    return (
      <TouchableHighlight
        underlayColor="#EFEFEF"
        onPress={showPacking ? null : handlePress}
      >
        <View
          style={[
            styles.mainCardView,
            Packed && styles.mainCardViewPacked,
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            {/* Imagen */}
            <View style={[styles.imageWrapper, Packed && styles.imageWrapperPacked]}>
              <Image
                source={{ uri: item.Foto }}
                style={styles.productImageCarrousel}
              />
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={showPacking ? styles.text : styles.textBold}>
                Ubicación: {item.Ubicacion}
              </Text>

              <View style={styles.rowTop}>
                <Text style={styles.title} numberOfLines={3}>
                  <Text style={showPacking ? styles.text : styles.textBold}>
                    {item.Codigo} -{" "}
                  </Text>
                  {item.NombreArticulo}
                </Text>
                <View
                  style={[
                    styles.checkBox,
                    {
                      borderColor: Checked
                        ? Pending
                          ? "#FFA500"
                          : "#25D366"
                        : "gray",
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    icon={Checked ? "square-check" : "square"}
                    size={16}
                    color={Checked ? (Pending ? "#FFA500" : "#25D366") : "gray"}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Packed ? "#EAF7EF":"white",
                        borderRadius: 4,
                        paddingRight: 4,
                        marginHorizontal: 0,
                      }}
                    >
                      <Text style={styles.textBold}>
                        Cantidad: {item.Cantidad}
                      </Text>
                    </View>

                    {/* 🔹 Picking normal */}
                    {showPicking && !showPacking && (
                      <View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 4,
                          paddingHorizontal: 4,
                          marginHorizontal: 0,
                        }}
                      >
                        <Text style={styles.textBold}>
                          {"Cantidad picking: " + item.CantidadPicking}
                        </Text>
                      </View>
                    )}

                    {/* 🔹 Picking pendiente (packing) */}
                    {showPicking && showPacking && Pending && (
                      <View
                        style={{
                          backgroundColor: "#FFA500",
                          borderRadius: 4,
                          paddingHorizontal: 4,
                          marginHorizontal: 0,
                        }}
                      >
                        <Text style={styles.textBold}>
                          {"Picking: " + item.CantidadPicking}
                        </Text>
                      </View>
                    )}

                    {/* 🔹 Packing */}
                    {showPacking && (
                      <View
                        style={{
                          backgroundColor: Packed ? "#EAF7EF":"white",
                          borderRadius: 4,
                          paddingHorizontal: 4,
                          marginHorizontal: 0,
                        }}
                      >
                        <Text style={styles.textBold}>
                          {"Packing: " + item.CantidadPl}
                        </Text>
                      </View>
                    )}
                  </View>

                  {showCost ? (
                    <Text style={styles.text}>
                      Costo: {formatCurrency(item.Costo, "GTQ")}
                    </Text>
                  ) : (
                    <Text style={styles.text}>
                      Precio: {formatCurrency(item.Precio, "GTQ")}
                    </Text>
                  )}
                </View>
                {showEdit && renderEdit}
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
  (prev, next) =>
    prev.item.Picking === next.item.Picking &&
    prev.item.Cantidad === next.item.Cantidad,
);

const styles = StyleSheet.create({
  mainCardView: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 6,
    elevation: 2,
  },

  mainCardViewPacked: {
    backgroundColor: "#EAF7EF",
    borderRadius: 10,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#25D366",
    //opacity: 0.75,
  },
  imageWrapper: {
    flexGrow: 1,
    maxWidth: isMovil ? 90 : 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
imageWrapperPacked: {
    flexGrow: 1,
    maxWidth: isMovil ? 90 : 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor:"#EAF7EF",
  },
  productImageCarrousel: {
    width: isMovil ? 90 : 70,
    height: isMovil ? 90 : 70,
    resizeMode: "contain",
  },
   productImageCarrouselPacked: {
    backgroundColor: "#EAF7EF",
    width: isMovil ? 90 : 70,
    height: isMovil ? 90 : 70,
    resizeMode: "contain",
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  title: {
    flex: 1,
    fontSize: 12,
    color: "black",
  },

  code: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  text: {
    fontSize: isMovil ? 10 : 12,
    color: "black",
  },
  textBold: {
    fontSize: isMovil ? 10 : 12,
    color: "black",
    fontWeight: "bold",
  },

  checkBox: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 6,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },

  buttonText: {
    fontSize: 12,
    color: "#007AFF",
  },
});

export default CartItem;
