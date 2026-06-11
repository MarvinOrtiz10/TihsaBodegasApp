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
  useWindowDimensions,
} from "react-native";

const { width, height } = Dimensions.get("screen");
const isMovil = Math.min(width, height) < 650 ? true : false;

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
    showPackingEnv, // ✅ NUEVO
    showPicking,
    showCost,
    showEdit,
    item,
    onPress,
    renderEdit,
    isPickingApp,
  }) => {
    const { width, height } = useWindowDimensions();
    const isMovil = Math.min(width, height) < 650;
    const isLandscape = width > height;

    const handlePress = useCallback(() => {
      onPress(item);
    }, [item.Codigo, onPress]);

    // 🔥 Bloqueo si existencia es menor a cantidad (SOLO si estamos en modo picking)
    const isIncomplete = isPickingApp && (item.Existencia ?? 0) < item.Cantidad;

    const Checked = !!item.Picking;
    const Pending = showPicking ? item.Cantidad != item.CantidadPicking : false;

    // 🔥 Packing original (NO se toca)
    const Packed = showPacking && item.Cantidad === item.CantidadPL;

    // 🔥 NUEVO packing salida
    const PackedSend =
      showPackingEnv && item.Cantidad === (item.CantidadEnv ?? 0);

    // 🔥 Centralización (sin cambiar lógica original)
    const isPacked = showPacking ? Packed : showPackingEnv ? PackedSend : false;

    const packingCantidad = showPacking
      ? item.CantidadPL
      : showPackingEnv
        ? item.CantidadEnv
        : null;

    return (
      <TouchableHighlight
        underlayColor="#EFEFEF"
        onPress={showPacking || showPackingEnv || isIncomplete ? null : handlePress} // ✅ soporta ambos y bloquea incompleto
      >
        <View
          style={[
            styles.mainCardView,
            isPacked && styles.mainCardViewPacked, // ✅ centralizado
            isIncomplete && styles.mainCardViewIncomplete, // 🔴 fondo rojo si es incompleto
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            {/* Imagen */}
            <View
              style={[
                styles.imageWrapper,
                isPacked && styles.imageWrapperPacked, // ✅ centralizado
              ]}
            >
              <Image
                source={{ uri: item.Foto }}
                style={[
                  styles.productImageCarrousel,
                  {
                    width: isMovil ? (isLandscape ? 60 : 90) : 70,
                    height: isMovil ? (isLandscape ? 60 : 90) : 70,
                  }
                ]}
              />
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={[showPacking ? styles.text : styles.textBold, { fontSize: isMovil && isLandscape ? 8 : (isMovil ? 10 : 12) }]}>
                Ubicación: {item.Ubicacion}
              </Text>

              <View style={styles.rowTop}>
                <Text style={[styles.title, { fontSize: isMovil && isLandscape ? 10 : 12 }]} numberOfLines={isLandscape ? 1 : 3}>
                  <Text style={[showPacking ? styles.text : styles.textBold, { fontSize: isMovil && isLandscape ? 10 : 12 }]}>
                    {item.Codigo} -
                  </Text>
                  {item.NombreArticulo}
                </Text>
                {showPicking && (
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
                      color={
                        Checked ? (Pending ? "#FFA500" : "#25D366") : "gray"
                      }
                    />
                  </View>
                )}
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
                        backgroundColor: isPacked ? "#EAF7EF" : "white",
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

                    {/* 🔹 Packing (IN / OUT unificado) */}
                    {(showPacking || showPackingEnv) && (
                      <View
                        style={{
                          backgroundColor: isPacked ? "#EAF7EF" : "white",
                          borderRadius: 4,
                          paddingHorizontal: 4,
                          marginHorizontal: 0,
                        }}
                      >
                        <Text style={styles.textBold}>
                          {`Packing: ${packingCantidad ?? 0}`}
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

                {showEdit && !isIncomplete && renderEdit}
                {showEdit && isIncomplete && (
                  <View style={{ flex: 1, maxWidth: 80, justifyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={"circle-exclamation"} size={18} color="#FF4D4F" />
                    <Text style={{ fontSize: 10, color: "#FF4D4F", fontWeight: "bold", marginTop: 4, textAlign: "center" }}>
                      Stock{"\n"}Insuficiente
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
  (prev, next) =>
    prev.item.Picking === next.item.Picking &&
    prev.item.Cantidad === next.item.Cantidad &&
    prev.item.CantidadPL === next.item.CantidadPL && // ✅ agregado
    prev.item.CantidadEnv === next.item.CantidadEnv, // ✅ agregado
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
  mainCardViewIncomplete: {
    backgroundColor: "#FAFAFA",
    borderLeftWidth: 4,
    borderLeftColor: "#FF4D4F", // Borde de acento moderno izquierdo
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
    opacity: 0.85, // Aspecto sutilmente deshabilitado
  },
  imageWrapper: {
    flexGrow: 1,
    maxWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  imageWrapperPacked: {
    flexGrow: 1,
    maxWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor: "#EAF7EF",
  },
  productImageCarrousel: {
    resizeMode: "contain",
  },
  productImageCarrouselPacked: {
    backgroundColor: "#EAF7EF",
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
