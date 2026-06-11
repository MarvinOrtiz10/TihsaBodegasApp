import React, { memo } from "react";
import { StyleSheet, Image, View, Text } from "react-native";

const CardArticle = memo(({ navigation, item }) => {
  function formatCurrency(amount, currencyCode) {
    if (typeof amount !== "number") return "";
    return amount.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }

  return (
    <View style={styles.card}>
      
      <View style={styles.container}>
         {/* 🔥 Badge flotante */}
          <View
            style={[
              styles.badge,
              {
               backgroundColor: item.Existencia > 0 ? "#E6F4EF" : "#FDECEC",
               borderWidth: 0.5,
               borderColor: item.Existencia > 0 ? "#0D7C66" : "#B42318",
              },
            ]}
          >
            <Text style={[styles.badgeText,{color: item.Existencia > 0 ? "#0D7C66" : "#B42318",}]}>
              {item.Existencia > 0 ? "Existencia: " + item.Existencia : "Agotado" }
            </Text>
          </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.Foto }} style={styles.image} />         
        </View>

        <View style={styles.info}>
          <Text style={styles.location}>
            Ubicación: {item.Ubicacion}
          </Text>

          <Text style={styles.name} numberOfLines={3}>
            {item.Codigo} - {item.NombreArticulo}
          </Text>
        </View>

      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 2,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    height: 200,

    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  container: {
    alignItems: "center",
  },

  imageContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  // 🔥 badge flotante
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  info: {
    paddingHorizontal: 8,
  },

  location: {
    fontSize: 12,
    fontWeight: "bold",
  },

  name: {
    fontSize: 12,
  },
});

export default CardArticle;