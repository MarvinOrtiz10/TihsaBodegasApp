import React, { memo } from "react";
import { StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

const { width } = Dimensions.get("screen");
const isMovil = width < 650;

const CardCustomer = memo(({ navigation, item, style }) => {
  const cardContainer = [styles.card, styles.shadow, style];
  const isInactive = item.Inactivo;

  return (
    <Block card flex style={cardContainer}>
      <Block row style={styles.header}>
        <Image
          source={{
            uri:
              item.Foto ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={[styles.profileImage, isInactive && styles.imageInactive]}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={()=>  navigation.navigate("Edit Customer", { codigoCliente: item.CodigoCliente })}
        >
          <FontAwesomeIcon icon={faUserEdit} size={14} color="white" />
        </TouchableOpacity>
      </Block>
      <Block style={styles.infoContainer}>
        <Text style={[styles.clientName, isInactive && styles.textInactive]}>
          <Text style={[styles.clientCode, isInactive && styles.textInactive]}>
            {item.CodigoCliente}
          </Text>
          - {item.Nombre}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.clientDetail, isInactive && styles.textInactive]}
        >
          {item.Direccion}
        </Text>
        <Text style={[styles.clientDetail, isInactive && styles.textInactive]}>
          Nit: {item.Nit}
        </Text>
      </Block>
      {/* Botón de editar
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditarCliente", { cliente: item })}
      >
        <FontAwesomeIcon icon={faUserEdit} size={18} color="white" />
      </TouchableOpacity> */}
    </Block>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    minHeight: 165,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    //alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  clientCode: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
  clientDetail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  editButton: {
    width: 30,
    height: 30,
    backgroundColor: "#0F334F",//"rgb(34, 197, 94)",//"#007AFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInactive: {
    opacity: 0.5,
  },
  textInactive: {
    color: "gray",
  },
});

export default CardCustomer;
