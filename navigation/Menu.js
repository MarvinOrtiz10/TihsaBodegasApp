import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, StatusBar } from "react-native";

import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React from "react";

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const screens = ["Home", "Orders", "Payments", "Articles", "Clients"];
  const screen = [
    { title: "Inicio", route: "Home" },
    { title: "Ordenes/Pedidos", route: "Orders" },
    { title: "Recibos de caja", route: "Payments" },
    { title: "Artículos", route: "Articles" },
    { title: "Clientes", route: "Clients" },
  ];
  const screens2 = [
    "Home",
    "Orders",
    "Payments",
    "Articles",
    "Clients",
    "Perfil",
    "Account",
    "Elements",
  ];
  return (
    <>
      <StatusBar />
      <Block
        style={styles.container}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <Block  style={styles.header}>
          <Image styles={styles.logo} source={Images.LogoApp2} />
        </Block>
        <Block  style={{ flex: 1, paddingLeft: 8, paddingRight: 14 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {screen.map((item, index) => {
              return (
                <DrawerCustomItem
                  title={item.title}
                  key={index}
                  navigation={navigation}
                  focused={state.index === index ? true : false}
                />
              );
            })}
            <Block
              flex
              style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
            >
              <Block
                style={{
                  borderColor: "rgba(0,0,0,0.2)",
                  width: "100%",
                  borderWidth: StyleSheet.hairlineWidth,
                }}
              />
              <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
                DOCUMENTATION
              </Text>
            </Block>
            <DrawerCustomItem
              title="Log out"
              navigation={() => navigation.navigate("Login")}
            />
            <DrawerCustomItem title="Getting Started" navigation={navigation} />
          </ScrollView>
        </Block>
      </Block>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flex: 0.6,
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
  },
  logo: {
    width: 100,
  },
});

export default CustomDrawerContent;
