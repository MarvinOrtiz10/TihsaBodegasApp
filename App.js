import React, { useEffect, useCallback, useState } from "react";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font'; // si usas fuentes personalizadas

import Screens from "./navigation/Screens";
import { argonTheme } from "./constants";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

enableScreens();
SplashScreen.preventAutoHideAsync();
library.add(fas);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Si cargas fuentes o datos, hazlo aquí
        await Font.loadAsync({
          // tus fuentes aquí si usas
        });
        // puedes esperar otros recursos si es necesario
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <GalioProvider theme={argonTheme}>
        <Block style={{ flex: 1 }}>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
